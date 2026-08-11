# Setup Guide

This guide explains how to set up and run the Software Engineering Club registration project locally and deploy the Google Sheets backend.

## 1. Project Structure

- index.html — landing page and registration form
- style.css — all styling and responsive layout
- script.js — form validation, draft persistence, and submission logic
- google-apps-script.gs — Google Apps Script backend
- GOOGLE_SHEETS_SETUP.md — backend deployment notes
- smoke_test.py — local smoke test for page structure
- asset/ — club images and logo assets

## 2. Local Setup

### Prerequisites
- a modern web browser
- Python 3 installed on your machine
- a text editor or VS Code
- a Google account for Apps Script and Sheets

### Run the site locally
1. Open a terminal in the project folder.
2. Run:

   python3 -m http.server 8000

3. Open this URL in the browser:

   http://localhost:8000

### Smoke test
You can validate that the homepage loads correctly by running:

python3 smoke_test.py

This script starts a temporary local server and checks whether the required HTML structure is present.

## 3. Google Apps Script Setup

1. Open Google Drive.
2. Create or open a Google Sheet for club registrations.
3. Go to Extensions → Apps Script.
4. Replace the script editor content with the code from google-apps-script.gs.
5. Save the project.
6. Select Deploy → New deployment → Web app.
7. Set:
   - Execute as: Me
   - Who has access: Anyone
8. Deploy the project and authorize the required permissions.
9. Copy the generated /exec URL.
10. Open index.html and paste the URL into the meta tag:

   <meta name="google-sheets-web-app-url" content="PASTE_YOUR_DEPLOYED_URL_HERE">

## 4. Deployment Notes

After changing the script code:
1. Go to Deploy → Manage deployments.
2. Click Edit.
3. Create a New version.
4. Deploy again so the public web app uses the updated version.

The script automatically creates a sheet named Registrations if it does not already exist.

## 5. Form Behavior

The form includes:
- live validation
- required field checks
- draft auto-save using localStorage
- success modal after valid submission
- automatic email confirmation

## 6. Troubleshooting

### Google Form not submitting
- check the deployed Apps Script URL
- ensure the app is published with “Anyone” access
- verify the Apps Script has permission to access the Google Sheet and Gmail

### Email not sending
- check Gmail/Apps Script quotas
- ensure the user email field is valid
- inspect the Apps Script execution log for errors

### Fields still showing as invalid on first load
- verify the validation logic checks for interaction state before marking inputs red
- make sure the page is not calling validation too early during initial load

### Data not persisting after refresh
- confirm the browser supports localStorage
- ensure saveDraft() is being called on input/change events
- clear the browser storage if needed and reload the page

## 7. Maintenance

Regular maintenance tasks include:
- verifying the Google Sheet still receives submissions
- checking email delivery status
- updating the club logo or assets when needed
- reviewing validation rules if required by the club
- redeploying the Apps Script after code changes

## 8. Quick Start Summary

1. Start local site with Python HTTP server.
2. Set up Google Apps Script and deploy web app.
3. Paste the /exec URL into the HTML meta tag.
4. Open the site and test the form.
5. Submit a valid registration and verify the Google Sheet and email response.
