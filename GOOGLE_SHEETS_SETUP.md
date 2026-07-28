# Google Sheets setup

1. Create or open the Google Sheet that should receive registrations.
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with `google-apps-script.gs` from this project and save.
4. Select **Deploy → New deployment → Web app**.
5. Set **Execute as** to yourself and **Who has access** to **Anyone**.
6. Deploy, authorize access to Sheets and Drive, then copy the `/exec` web-app URL.
7. In `index.html`, paste that URL into the `google-sheets-web-app-url` meta tag's `content` value.

The script creates a `Registrations` tab and a Drive folder named `SEC Registration Payment Proofs` on the first successful submission. Each response becomes one row; uploaded payment proofs are saved in that folder and linked from the Sheet.

Each accepted registration receives a sequential ID such as `SEC-2026-0001`. The ID is stored in the **Member ID** column and sent to the applicant by email. The **Email Status** column shows `Sent` or the delivery error. Google applies daily Apps Script email quotas to these messages.

After changing the Apps Script code, select **Deploy → Manage deployments → Edit**, choose **New version**, and deploy it so the public web app receives the update. The `/exec` URL can remain unchanged.
