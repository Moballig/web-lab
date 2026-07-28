/** Google Sheets receiver for the Software Engineering Club registration form. */

const SHEET_NAME = "Registrations";
const UPLOAD_FOLDER_PROPERTY = "PAYMENT_PROOF_FOLDER_ID";
const COLUMNS = [
  "Timestamp", "First Name", "Last Name", "Student ID", "Email", "Phone",
  "Date of Birth", "Gender", "Semester", "Batch", "Section", "Experience",
  "Skills", "Interests", "GitHub", "LinkedIn", "Motivation", "Contribution",
  "Payment Method", "Transaction ID", "Payment Proof", "Submitted From"
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);
    const data = e && e.parameter ? e.parameter : {};
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
    }

    const proofUrl = savePaymentProof_(data);
    const clean = safeCell_;

    sheet.appendRow([
      new Date(), clean(data.firstName), clean(data.lastName), clean(data.studentId),
      clean(data.email), clean(data.phone), clean(data.dob), clean(data.gender),
      clean(data.semester), clean(data.batch), clean(data.section), clean(data.experience),
      clean(data.skills), clean(data.interest), clean(data.github), clean(data.linkedin),
      clean(data.motivation), clean(data.contribution), clean(data.paymentMethod),
      clean(data.transactionId), proofUrl, clean(data.submittedFrom)
    ]);

    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error.message || error) });
  } finally {
    lock.releaseLock();
  }
}

function savePaymentProof_(data) {
  if (!data.paymentProofData) return "";

  const properties = PropertiesService.getScriptProperties();
  const folderId = properties.getProperty(UPLOAD_FOLDER_PROPERTY);
  let folder;

  if (folderId) {
    folder = DriveApp.getFolderById(folderId);
  } else {
    folder = DriveApp.createFolder("SEC Registration Payment Proofs");
    properties.setProperty(UPLOAD_FOLDER_PROPERTY, folder.getId());
  }

  const bytes = Utilities.base64Decode(data.paymentProofData);
  const filename = `${Date.now()}-${data.studentId || "student"}-${data.paymentProofName || "proof"}`;
  const blob = Utilities.newBlob(bytes, data.paymentProofType || "application/octet-stream", filename);
  return folder.createFile(blob).getUrl();
}

function safeCell_(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
