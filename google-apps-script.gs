/** Google Sheets receiver for the Software Engineering Club registration form. */

const SHEET_NAME = "Registrations";
const UPLOAD_FOLDER_PROPERTY = "PAYMENT_PROOF_FOLDER_ID";
const COLUMNS = [
  "Timestamp", "First Name", "Last Name", "Student ID", "Email", "Phone",
  "Date of Birth", "Gender", "Semester", "Batch", "Section", "Experience",
  "Skills", "Interests", "GitHub", "LinkedIn", "Motivation", "Contribution",
  "Payment Method", "Transaction ID", "Payment Proof", "Submitted From",
  "Member ID", "Email Status"
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);
    const data = e && e.parameter ? e.parameter : {};
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
    sheet.setFrozenRows(1);

    const recipientEmail = getParameter_(data, "email");
    const proofUrl = savePaymentProof_(data);
    const memberId = nextMemberId_(sheet);
    const clean = safeCell_;

    sheet.appendRow([
      new Date(), clean(data.firstName), clean(data.lastName), clean(data.studentId),
      clean(recipientEmail), clean(data.phone), clean(data.dob), clean(data.gender),
      clean(data.semester), clean(data.batch), clean(data.section), clean(data.experience),
      clean(data.skills), clean(data.interest), clean(data.github), clean(data.linkedin),
      clean(data.motivation), clean(data.contribution), clean(data.paymentMethod),
      clean(data.transactionId), proofUrl, clean(data.submittedFrom), memberId, "Pending"
    ]);

    const submittedRow = sheet.getLastRow();
    let emailStatus = "Sent";

    try {
      sendConfirmationEmail_(data, memberId, recipientEmail);
    } catch (emailError) {
      emailStatus = `Failed: ${String(emailError.message || emailError)}`;
      console.error(emailError);
    }

    sheet.getRange(submittedRow, COLUMNS.indexOf("Email Status") + 1).setValue(emailStatus);

    return json_({ ok: true, memberId: memberId, emailSent: emailStatus === "Sent" });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error.message || error) });
  } finally {
    lock.releaseLock();
  }
}

function nextMemberId_(sheet) {
  const year = new Date().getFullYear();
  const propertyName = `MEMBER_ID_SEQUENCE_${year}`;
  const properties = PropertiesService.getScriptProperties();
  const savedSequence = Number(properties.getProperty(propertyName) || 0);
  const registrationCount = Math.max(sheet.getLastRow() - 1, 0);
  const nextSequence = Math.max(savedSequence, registrationCount) + 1;

  properties.setProperty(propertyName, String(nextSequence));
  return `SEC-${year}-${String(nextSequence).padStart(4, "0")}`;
}

function sendConfirmationEmail_(data, memberId, recipientEmail) {
  const recipient = String(recipientEmail || "").trim();
  if (!recipient) throw new Error("No email address was provided.");

  const firstName = escapeHtml_(data.firstName || "Member");
  const safeMemberId = escapeHtml_(memberId);
  const subject = `SEC registration confirmed — ${memberId}`;
  const plainText = [
    `Hello ${data.firstName || "Member"},`,
    "",
    "Your Software Engineering Club registration has been received.",
    `Your membership ID is: ${memberId}`,
    "",
    "Please keep this ID for future club communication.",
    "",
    "Software Engineering Club",
    "Daffodil International University"
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a">
      <div style="background:#2563eb;color:#fff;padding:24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0">Registration confirmed</h2>
      </div>
      <div style="padding:28px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px">
        <p>Hello ${firstName},</p>
        <p>Your Software Engineering Club registration has been received.</p>
        <p style="margin:24px 0;padding:18px;background:#eff6ff;border-radius:8px;text-align:center">
          Your membership ID<br>
          <strong style="font-size:24px;color:#1d4ed8">${safeMemberId}</strong>
        </p>
        <p>Please keep this ID for future club communication.</p>
        <p>Software Engineering Club<br>Daffodil International University</p>
      </div>
    </div>`;

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: plainText,
    htmlBody: html,
    name: "Software Engineering Club"
  });
}

function getParameter_(data, requestedName) {
  const exactValue = data[requestedName];
  if (exactValue !== undefined && exactValue !== null) {
    return String(exactValue).trim();
  }

  const matchingKey = Object.keys(data).find(
    key => key.trim().toLowerCase() === requestedName.toLowerCase()
  );

  return matchingKey ? String(data[matchingKey]).trim() : "";
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
