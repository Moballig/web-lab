# Software Engineering Club Registration System - SRS

## 1. Introduction

This project is a static registration website for the Software Engineering Club at Daffodil International University. It is designed to collect member applications, validate the entered information, store the submissions in Google Sheets, and send a confirmation email to the applicant.

The system is built using a combination of:
- HTML for structure
- CSS for styling and layout
- JavaScript for client-side validation and interaction
- Google Apps Script for server-side data handling and email notifications
- Google Sheets as the backend storage layer

## 2. Purpose

The purpose of the system is to simplify the club membership registration process, reduce manual error handling, and provide a clean, user-friendly experience for prospective members.

The system should:
- collect registration information in a structured format
- validate required fields before submission
- keep form data safe during a refresh or accidental page reload
- store valid submissions in Google Sheets
- generate a member ID for each applicant
- send a confirmation email to the applicant

## 3. Scope

### In Scope
- club registration form
- client-side validation
- responsive front-end interface
- Google Sheets integration
- confirmation emails through Gmail/Google Apps Script
- persistence of partially filled forms using browser storage

### Out of Scope
- login or authentication system
- admin dashboard
- database server setup
- complex user management
- payment processing gateway integration

## 4. Functional Requirements

### 4.1 User Interface
The system shall provide a landing page with:
- hero section
- club overview
- activities and community information
- registration form
- success modal after submission

### 4.2 Form Fields
The registration form shall include personal, academic, technical, and payment information, including:
- first name
- last name
- student ID
- university email
- phone number
- date of birth
- gender
- semester
- batch
- section
- programming experience
- skills and interests
- GitHub and LinkedIn links
- motivation and contribution text
- payment method and transaction ID
- payment proof upload
- agreement checkbox

### 4.3 Validation Requirements
The system shall validate that:
- required fields are not empty
- names are long enough
- student ID follows the expected format
- university email uses the DIU domain
- phone number contains only valid digits
- the user is at least 16 years old
- payment method is selected
- transaction ID is valid
- payment proof is uploaded and within allowed file constraints
- at least one skill or area of interest is selected
- radio groups and checkbox groups have a selection
- agreement is accepted

### 4.4 Draft Recovery
If the user refreshes the page before submitting, the system shall preserve the already entered data in localStorage and restore it when the page loads again.

### 4.5 Submission Requirements
When the form is valid:
- the data is sent to the Google Apps Script web app
- the Apps Script stores the response in Google Sheets
- a member ID is generated
- a confirmation email is sent to the applicant
- a success modal is shown

### 4.6 Error Handling
The system shall display useful validation messages and show a clear error if:
- Google Sheets URL is not configured
- the Apps Script request fails
- email sending fails
- the file upload is invalid

## 5. Non-Functional Requirements

### 5.1 Usability
The interface shall be clean, readable, and responsive on desktop and mobile screens.

### 5.2 Reliability
The form must not lose entered information after a refresh before submission.

### 5.3 Security
- sensitive values must be sanitized before outputting to the page or email
- spreadsheet formula injection must be prevented in imported data
- payment proof is intentionally not stored in the sheet

### 5.4 Maintainability
The code shall be documented and organized into distinct sections for:
- slider logic
- validation logic
- submission logic
- reset logic
- helper functions

## 6. System Architecture

### Front-End Layer
- index.html: page structure and form markup
- style.css: styling, layout, responsive behavior, and visual design
- script.js: client-side validation, persistence, and form submission logic

### Back-End Integration Layer
- google-apps-script.gs: receives form POST requests and writes them to Google Sheets

### Storage Layer
- Google Sheet named Registrations

### Notification Layer
- Gmail via Google Apps Script MailApp

## 7. Data Flow

1. User fills out the registration form.
2. JavaScript validates each field live and on submit.
3. Draft values are saved in localStorage after each change.
4. When the user submits, the form is posted to the Google Apps Script web app.
5. Apps Script reads the form parameters.
6. A new row is appended to the Registrations sheet.
7. A member ID is created and stored.
8. A confirmation email is sent to the applicant.
9. The front end shows a success modal.

## 8. Assumptions and Constraints
- The project is designed for a university club registration workflow.
- The Apps Script must be deployed as a public web app.
- Google Sheets and Gmail access must be authorized for the Apps Script project.
- Payment proof files are not permanently saved by the backend due to the current design.

## 9. Risks and Considerations
- The public Apps Script URL must stay valid after deployment.
- Email sending is limited by Google Apps Script quotas.
- If the Google Sheet is deleted or the script is redeployed incorrectly, form submissions may fail.
- The form depends on browser localStorage; users who clear browser data may lose their draft.

## 10. Acceptance Criteria
The project is considered successful when:
- the homepage loads without errors
- the registration form validates required fields correctly
- partial data remains after refresh
- valid submissions are saved in Google Sheets
- member IDs are generated properly
- confirmation emails are sent successfully
- users receive a clear success or error message

## 11. Summary
This system provides a practical and modern solution for student club registration. It combines a responsive front-end with a lightweight serverless backend, making the setup simple while still delivering reliable data capture and email notifications.
