# Exam Prep — Software Engineering Club Registration Project

## Project Overview (2-minute elevator pitch)

This is a **static, single-page website** for the Software Engineering Club at Daffodil International University. It:

1. Shows a landing page with a rotating hero slider (`index.html:29-80`).
2. Provides a **membership registration form** with live validation (`index.html:353`, `script.js:809`).
3. **Auto-saves drafts** to the browser's `localStorage` so nothing is lost on refresh (`script.js:143`).
4. Submits valid data with `fetch()` to a **Google Apps Script web app** (`script.js:1078`).
5. The Apps Script backend (`google-apps-script.gs`) stores each response as a row in Google Sheets, **generates a member ID** like `SEC-2026-0001`, and **sends a confirmation email** via Gmail.

**Stack:** Vanilla HTML5 + CSS3 + JavaScript (no framework, no build tool). Backend = Google Apps Script + Google Sheets + Gmail (serverless, free).

> Files: `index.html` (structure), `style.css` (design), `script.js` (behavior), `google-apps-script.gs` (backend), `smoke_test.py` (automated test).

---

## PART 1 — HTML Structure (index.html)

### EASY

**Q1. What does this project do?**
It is a club membership registration website. Students see club info, fill a registration form (personal, technical, payment details), the site validates everything in the browser, saves data to Google Sheets through Apps Script, and emails the student a member ID.
*(Reference: `DOCUMENTATION.md:5`)*

**Q2. What files make up this project and their roles?**
- `index.html` — page structure and the form markup
- `style.css` — all styling, layout, responsiveness
- `script.js` — validation, slider, draft saving, submission
- `google-apps-script.gs` — server-side storage + email backend
- `smoke_test.py` — automated test that checks the page loads
*(Reference: `SETUP.md:5-13`)*

**Q3. Where is the Google Apps Script URL stored and why there?**
In a `<meta>` tag in the `<head>`:
`<meta name="google-sheets-web-app-url" content="https://script.google.com/macros/s/.../exec">`
*(Reference: `index.html:8`)*

Stored in a meta tag so the JavaScript can read it via `document.querySelector('meta[name="google-sheets-web-app-url"]').content` — it keeps the deployment URL configurable without editing the JS. *(Reference: `script.js:103-105`)*

**Q4. What form sections exist?**
Personal Information, Technical Information, Club Information, Payment Information, and an Agreement checkbox.
*(Reference: `index.html:359`, `index.html:566`, `index.html:721`, `index.html:774`, `index.html:880`)*

**Q5. Why is `novalidate` on the `<form>` tag?**
`<form id="registrationForm" novalidate>` — it turns OFF the browser's built-in validation so our custom JavaScript validation in `script.js` controls all error messages and styling.
*(Reference: `index.html:353`)*

### HARD

**Q6. Why does the submit button start `disabled`?**
`<button type="submit" id="registerBtn" ... disabled>` — the button starts disabled in HTML (`index.html:911-918`) and is also set disabled again in JS at page load (`script.js:1310`). It only becomes enabled when `validateForm()` runs all checks and everything passes — `registerBtn.disabled = !valid;` *(Reference: `script.js:876`)*. This forces the user to complete the whole form before they can submit.

**Q7. Why are `<small class="error"></small>` elements next to every field?**
Each field has an empty `<small class="error">` placeholder (e.g. `index.html:373`). The JS writes error/success messages into these elements (`showError` / `showSuccess`, `script.js:281-324`), and CSS styles `.valid` / `.invalid` classes. It's a pattern for per-field inline feedback without changing the layout.

**Q8. Why use `<section class="form-section">` containers?**
For semantic HTML and clean grouping — each section groups related fields so screen readers understand the form structure, and CSS can style the cards. It also makes the long form visually organized into Personal/Technical/Club/Payment blocks. *(Reference: `index.html:359`)*

**Q9. The hero uses `aria-live="off"` on slides and `aria-label` on arrows/dots — why?**
Accessibility. The dots have `aria-current` updated by JS (`script.js:27`), arrow buttons have `aria-label="Previous slide"` (`index.html:68`), and `aria-live="off"` tells screen readers NOT to announce every auto-slide change (which would be annoying). Accessibility makes the site usable for keyboard/mouse/screen-reader users. *(Reference: `index.html:30`, `index.html:68-78`)*

**Q10. The payment section shows numbers as `01XXXXXXXXX` — why is it masked?**
Real bKash/Nagad/Rocket numbers are intentionally hidden as `01XXXXXXXXX` placeholders (`index.html:799-801`) so public fake numbers aren't published on the live site. The club replaces them with real numbers before going live.

---

## PART 2 — Hero Slider (script.js)

### EASY

**Q11. How does the hero slider work?**
- `heroSlides` = all `.hero-slide` divs; `sliderDots` = the dots (`script.js:8-12`).
- `showSlide(index)` toggles the `.active` class so only one slide shows, and updates the active dot + `aria-current` (`script.js:17-29`).
- `startSlider()` uses `setInterval(() => showSlide(currentSlide + 1), 5000)` — auto-advances every 5 seconds (`script.js:32-35`).

**Q12. How can a user control the slider manually?**
- Arrow buttons: `changeSlide(-1)` / `changeSlide(1)` (`script.js:46-50`)
- Dots: jump directly to a slide (`script.js:54-59`)
- Keyboard: `ArrowLeft` / `ArrowRight` keys (`script.js:66-69`)
- Hover/focus pauses it (`script.js:62-65`)

**Q13. Why does `changeSlide` restart the timer?**
So after the user manually navigates, the 5-second auto-play resets rather than jumping immediately — `showSlide(currentSlide + direction)` then `startSlider()` which clears and re-creates the interval. *(Reference: `script.js:38-41`)*

### HARD

**Q14. Explain the modulo trick in `showSlide`.**
```js
currentSlide = (index + heroSlides.length) % heroSlides.length;
```
*(Reference: `script.js:18`)*

If you press "previous" on slide 0, index = -1. `(-1 + 3) % 3 = 2` → wraps to the LAST slide. If you press "next" on slide 2, index = 3 → `(3 + 3) % 3 = 0` → wraps to the FIRST slide. This creates infinite loop navigation (no out-of-bounds errors).

**Q15. Why is `sliderTimer` cleared on `mouseenter` and re-created on `mouseleave`?**
So the animation pauses while the user is reading/hovering the hero, preventing slides from changing mid-read. `window.clearInterval(sliderTimer)` pauses it (`script.js:62`); `startSlider()` on `mouseleave` restarts it (`script.js:63`). Same pattern for focus-in/focus-out.

**Q16. What does the `visibilitychange` handler do and why is it needed?**
When the user switches browser tabs, `document.hidden` becomes true. Browsers throttle timers in background tabs, so when they come back the interval might fire many times and skip slides. The handler clears the timer on hide and restarts it on show to keep the timing correct. *(Reference: `script.js:72-75`)*

**Q17. Why spread `document.querySelectorAll` into arrays with `[...]`?**
`querySelectorAll` returns a NodeList. Spreading `[...document.querySelectorAll(".hero-slide")]` (line 9) converts it into a real Array, giving access to Array methods (`.forEach`). Note: `NodeList.forEach` works in modern browsers anyway, but converting is a defensive, explicit pattern.

**Q18. What happens if the page has no slides?**
`if (heroSlides.length)` guards everything — if there are no slides, no listeners are attached and `startSlider()` never runs, so the site never crashes. *(Reference: `script.js:43-78`)*

---

## PART 3 — Form Validation (script.js)

### EASY

**Q19. How is validation triggered?**
1. **Live validation:** every `input` and `change` event on all fields calls `validateForm()` (`script.js:910-924`).
2. **On submit:** the submit listener calls `validateForm()` first, and aborts if it's false (`script.js:1056-1062`).

**Q20. How is the student ID validated?**
Regex `^\d{3}-\d{2}-\d{3}$` — exactly 3 digits, hyphen, 2 digits, hyphen, 3 digits (e.g. `242-35-287`). *(Reference: `script.js:359-380`)*

**Q21. How is the email validated?**
Regex `/^[^\s@]+@diu\.edu\.bd$/i` — must end in `@diu.edu.bd` (DIU's domain). The `/i` flag makes it case-insensitive. *(Reference: `script.js:388-409`)*

**Q22. How is age checked?**
`validateDOB()` parses the date, subtracts birth year from current year, then subtracts 1 if the birthday hasn't occurred yet this year (month/day comparison). If age < 16, it errors. *(Reference: `script.js:448-500`)*

**Q23. What fields are required and what's the main gate function?**
`validateForm()` (`script.js:809`) calls ~15 individual validators and combines them with `valid &= validateX()`. The `&=` acts as a boolean AND — if ANY validator returns false, `valid` becomes false. At the end `registerBtn.disabled = !valid` and it returns `Boolean(valid)`. *(Reference: `script.js:811-878`)*

**Q24. How are radio groups (gender, experience) validated?**
`validateRadioGroup` uses `.some(radio => radio.checked)` — returns true if at least one radio is selected. *(Reference: `script.js:564-588`)*

**Q25. How are checkboxes (skills, interests) validated?**
`validateCheckboxGroup` similarly uses `.some(box => box.checked)` — at least one must be checked. *(Reference: `script.js:595-621`)*

### HARD

**Q26. Why does `showError` sometimes return without showing an error? Explain `shouldMarkField`.**
```js
function shouldMarkField(input) {
    const hasValue = input.value.trim() !== "";
    const wasTouched = input.dataset.touched === "true" || formSubmitted;
    return hasValue || wasTouched;
}
```
*(Reference: `script.js:275-279`)*

This is a UX decision: **empty untouched fields are NOT marked red on first page load**. A field is only marked invalid if (a) it has a value that fails, OR (b) the user has touched it (`dataset.touched` is set on input/change, `script.js:913`), OR (c) the user pressed submit (`formSubmitted = true`, `script.js:1054`). Otherwise the whole form would glow red before the user even types — bad UX. This is also referenced in `SETUP.md:88-90` troubleshooting.

**Q27. How does `dataset.touched` work and where is it set?**
Every input gets `input.dataset.touched = "true"` inside the `input` and `change` listeners (`script.js:913`, `script.js:919`). The `data-touched` attribute is then read by `shouldMarkField`. Note for radio groups, ALL radios in the group get `dataset.touched = "true"` when any one changes (e.g. `script.js:930`).

**Q28. How does the URL validation handle optional fields?**
`validateURL` returns `true` immediately if the field is empty (`if (input.value.trim() === "") return true;`). If filled, it tries `new URL(input.value)` inside a `try` — if it throws (invalid URL), the `catch` shows an error. *(Reference: `script.js:629-655`)*

**Q29. How is the payment proof (file upload) validated?**
Three checks in `validatePaymentProof` (`script.js:691-741`):
1. A file must exist — `paymentProof.files.length === 0`
2. File type must be in `["image/png", "image/jpeg", "image/webp", "application/pdf"]`
3. File size ≤ 5MB — `file.size > 5 * 1024 * 1024`

**Q30. Why are validation functions often duplicated (e.g. `validateName` appears twice)?**
`validateName` is defined at `script.js:332` and again at `script.js:769`. The second definition **overrides** the first in JavaScript (function hoisting — the last declaration wins). This is a code smell / accidental duplication, but the project still works because both implementations are identical. A faculty member may ask about this — the honest answer is: it's redundant and the last definition takes effect. (Improvement: remove one.)

**Q31. Why is `Boolean(valid)` returned at the end of `validateForm`?**
Because `valid` is a number after using `&=` (in JS, `true & false = 0`, `true & true = 1`). Wrapping in `Boolean()` converts 0/1 back to a clean `true`/`false` for the submit handler's `if (!validateForm())` check. *(Reference: `script.js:878`)*

**Q32. How do the input masks work (studentId/phone/batch/section)?**
- Student ID: strips anything not `0-9-`: `value.replace(/[^0-9-]/g, "")` (`script.js:1226-1229`)
- Phone: strips everything not a digit: `replace(/[^0-9]/g, "")` (`script.js:1237-1241`)
- Batch: digits only (`script.js:1248-1252`)
- Section: auto-uppercased `.toUpperCase()` (`script.js:1260-1264`)
This is "sanitizing input as the user types" so only valid characters can ever be entered.

**Q33. What is the `scrollToFirstError` feature?**
On a failed submit, it finds the first `.invalid` element or non-empty `.error` and smoothly scrolls it to center so the user immediately sees what to fix. *(Reference: `script.js:1001-1021`)*

---

## PART 4 — Draft Persistence (localStorage)

### EASY

**Q34. How does the form survive a page refresh?**
`saveDraft()` runs on every input/change event and stores a JSON object of all field values under key `"sec-club-registration-draft"` in `localStorage` (`script.js:143-165`, key at `script.js:135`). On page load, `restoreDraft()` is called (`script.js:1316`) and re-fills every field.

**Q35. How are checkboxes/radios saved and restored?**
In `saveDraft`, checked boxes are pushed into an array per field name: `if (!draft[field.name]) draft[field.name] = []; if (field.checked) draft[field.name].push(field.value);` (`script.js:152-156`). In `restoreDraft`, `field.checked = values.includes(field.value)` re-checks them (`script.js:181-185`).

### HARD

**Q36. What is deliberately NOT saved in the draft, and why?**
File inputs: `if (!field.name || field.type === "file") return;` (`script.js:150`). Browsers cannot re-populate a file input programmatically for security reasons, so the payment screenshot is skipped and the user must re-select it after refresh.

**Q37. Why is `saveDraft` / `restoreDraft` wrapped in `try...catch`?**
`localStorage` can throw (privacy mode, full storage, disabled cookies). Wrapping it means a storage failure logs a warning but never crashes the form — the site still works, just without draft persistence. *(Reference: `script.js:162-164`, `script.js:193-195`)*

**Q38. When is `clearDraft()` called?**
1. After a successful submission — `clearDraft()` in the submit success path (`script.js:1103`)
2. When the success modal is closed — `script.js:1160`
3. On form reset — `script.js:1197`
So stale data is never restored for a new applicant.

**Q39. After restoring a draft, why does `validateForm()` get called again?**
`restoreDraft()` ends with `updateCounter(...)` and `validateForm()` (`script.js:190-192`) so restored values immediately get correct validation styling and the submit button reflects the restored state — the form isn't "fooled" into thinking fields are empty.

---

## PART 5 — Form Submission & Fetch (script.js)

### EASY

**Q40. How is the form submitted?**
An async submit listener calls `e.preventDefault()` (so the page doesn't reload), validates, then uses `fetch()` to POST the data to the Google Apps Script URL. *(Reference: `script.js:1051-1121`)*

**Q41. What format is the data sent in?**
`application/x-www-form-urlencoded` — the `createSubmissionData()` function builds a `URLSearchParams` object from `new FormData(form)`. *(Reference: `script.js:1029-1049`, header at `script.js:1081`)*

**Q42. What happens if the Google Sheets URL is missing?**
`if (!googleSheetsUrl)` shows the error: "Google Sheets is not configured yet..." and stops. *(Reference: `script.js:1064-1068`)*

**Q43. What does the loading overlay do?**
`.loading-overlay.active` is toggled on/off (`script.js:1073`, `script.js:1101`) to show a "Please Wait — Submitting your registration..." spinner while the fetch is in flight. *(Reference: `index.html:955-965`)*

### HARD

**Q44. Explain `createSubmissionData()` — how are multiple values handled?**
```js
for (const [name, value] of formData.entries()) {
    if (value instanceof File) continue;          // skip the screenshot
    if (params.has(name)) {
        params.set(name, `${params.get(name)}, ${value}`);  // join duplicates with ", "
    } else {
        params.set(name, value);
    }
}
```
*(Reference: `script.js:1033-1041`)*

Multiple checkboxes (skills, interests) share the same `name`, so `FormData` yields several entries with the same name. The code detects the duplicate and **joins values with ", "** into one string (e.g. `"C++, Python, HTML"`).

**Q46. Why set critical fields explicitly after the loop?**
```js
params.set("email", email.value.trim());
params.set("firstName", firstName.value.trim());
params.set("studentId", studentId.value.trim());
params.set("submittedFrom", window.location.href);
```
*(Reference: `script.js:1044-1047`)*

Because duplicate `name` attributes could merge values unexpectedly, and `params.set` on an existing key REPLACES its value. This guarantees email/name/ID are single clean values, and adds `submittedFrom` (the current page URL) which isn't a form field at all — it's tracked for auditing where the submission came from.

**Q47. How is the Apps Script response parsed and validated?**
The response text is read once; it tries `JSON.parse(responseText)`, and if parsing fails it falls back to `{ ok: response.ok }`. Then `if (!response.ok || responseData.ok !== true)` throws — meaning the front end only shows success if BOTH the HTTP status is OK **and** the Apps Script returned `{ok: true}`. *(Reference: `script.js:1085-1099`)*

**Q48. How are errors displayed to the user?**
The `catch` block re-enables the button, hides the overlay, and sets `submissionError.textContent`. There's special handling: a `"Failed to fetch"` message becomes a helpful tip to check the deployment URL and publish access. *(Reference: `script.js:1105-1119`)*

**Q49. Why is the submit handler `async`?**
So it can use `await fetch(...)` and `await response.text()` — clean asynchronous code instead of promise chains. *(Reference: `script.js:1051`, `script.js:1078`, `script.js:1085`)*

**Q50. Why does the modal reset the form and clear error classes on close?**
`closeModal` listener removes `.active`, calls `form.reset()`, strips all `.valid`/`.invalid` classes, clears `.error` texts, resets char counters to "0", clears the draft, and re-disables the button (`script.js:1129-1163`). This gives the next applicant a completely clean form.

---

## PART 6 — Google Apps Script Backend (google-apps-script.gs)

### EASY

**Q51. What is Google Apps Script's role?**
It's the **serverless backend**. The web app's `doPost(e)` function receives the POST from the browser, writes a row to Google Sheets, generates a member ID, sends a confirmation email via Gmail, and returns JSON. *(Reference: `google-apps-script.gs:14-61`)*

**Q52. Which sheet and columns are used?**
Sheet name = `"Registrations"` (`google-apps-script.gs:5`). The `COLUMNS` array lists all 24 columns from `Timestamp` to `Email Status` (`google-apps-script.gs:6-12`). If the sheet doesn't exist it's auto-created with `insertSheet` (`google-apps-script.gs:23`).

**Q53. How is the member ID generated?**
`nextMemberId_()` — it reads/creates a per-year counter in Script Properties, takes the max of that counter and the current row count, increments, and formats as `SEC-YYYY-NNNN`. Example: `SEC-2026-0001`. *(Reference: `google-apps-script.gs:63-73`)*

**Q54. How does the confirmation email work?**
`sendConfirmationEmail_()` uses `MailApp.sendEmail()` with both a plain-text body and an HTML template, sending the member ID to the applicant's email. *(Reference: `google-apps-script.gs:75-128`)*

### HARD

**Q55. Why use `LockService.getScriptLock()`?**
To prevent **race conditions** — if two people submit at the same moment, the lock serializes access so the member IDs and row appends don't collide/corrupt. `lock.waitLock(30000)` waits up to 30 seconds, and `lock.releaseLock()` in `finally` always releases it. *(Reference: `google-apps-script.gs:15-18`, `google-apps-script.gs:58-60`)*

**Q56. How is spreadsheet formula injection prevented?**
`safeCell_()` prefixes any cell value that starts with `=`, `+`, `-`, or `@` with a single quote `'`:
```js
return /^[=+\-@]/.test(text) ? `'${text}` : text;
```
*(Reference: `google-apps-script.gs:152-155`)*

A value like `=cmd` typed into a form could otherwise be executed by a spreadsheet as a formula — this neutralizes it, and is why the email must also be escaped. (Security requirement documented in `DOCUMENTATION.md:115-117`.)

**Q53b. Why is the email HTML-escaped?**
`escapeHtml_()` converts `& < > " '` to entities (`google-apps-script.gs:143-150`) so user-entered names can't inject markup/scripts into the email HTML template (`google-apps-script.gs:105`). The name is interpolated into HTML, so it must be sanitized (XSS prevention).

**Q57. Explain `getParameter_` — why is it needed?**
```js
function getParameter_(data, requestedName) {
    const exactValue = data[requestedName];
    ...
    const matchingKey = Object.keys(data).find(
        key => key.trim().toLowerCase() === requestedName.toLowerCase()
    );
}
```
*(Reference: `google-apps-script.gs:130-141`)*

It's a **case-insensitive, whitespace-tolerant lookup**. If the browser sends `EMAIL` but the code asks for `email`, the exact match fails but the key scan finds it. Defensive coding against casing differences between the HTML field names and the script.

**Q58. Why is `proofUrl` always `""` — payment proof isn't stored?**
`const proofUrl = "";` (`google-apps-script.gs:29`) — the file is validated in the browser but **intentionally not uploaded**. Reasons: the Apps Script `e.parameter` only receives URL-encoded form values (files aren't included), the sheet shouldn't hold large files, and it's documented as out of scope (`DOCUMENTATION.md:117`). The Payment Proof column is written blank.

**Q59. Why is the email wrapped in its own `try...catch`?**
So an email failure does NOT fail the whole registration. The script records `emailStatus = "Failed: ..."`, writes it to the Email Status column, and still returns `{ok: true}` to the browser. *(Reference: `google-apps-script.gs:43-52`)*

**Q60. What's returned to the browser and how?**
`json_()` wraps a JS object into `ContentService.createTextOutput(JSON.stringify(value)).setMimeType(JSON)` (`google-apps-script.gs:157-161`). Success returns `{ok: true, memberId: "SEC-...", emailSent: true}` (`google-apps-script.gs:54`); failure returns `{ok: false, error: "..."}` (`google-apps-script.gs:57`). This is what `script.js:1089` parses.

**Q61. Why does `nextMemberId_` use `Math.max(savedSequence, registrationCount) + 1`?**
Two sources of truth for uniqueness: the stored counter AND the actual sheet rows. Taking the max means even if the counter was reset (or a row was deleted), the ID never collides with an existing row count. *(Reference: `google-apps-script.gs:66-69`)*

**Q62. Why a per-year property name `MEMBER_ID_SEQUENCE_${year}`?**
IDs restart cleanly each year (`SEC-2026-...` vs `SEC-2027-...`), and the counter is stored persistently in Script Properties so it survives re-deploys. *(Reference: `google-apps-script.gs:64-71`)*

---

## PART 7 — CSS (style.css)

### EASY

**Q63. How is styling organized?**
Design tokens (CSS custom properties/variables) in `:root`, then a reset, then sections for header/hero, cards, form, modal, responsive. *(Reference: `style.css:5-34`)*

**Q64. How is responsiveness handled?**
Flexbox/grid layouts plus media queries for smaller screens, and `clamp()` for fluid sizes like `min-height:clamp(650px,95vh,900px)`. *(Reference: `style.css:111`)*

**Q65. How is the site theme customizable?**
All colors are CSS variables like `--club-blue-600: #2563eb`, `--primary: var(--club-blue-600)` — change one variable and the whole theme updates. *(Reference: `style.css:5-34`)*

### HARD

**Q66. How does the slide transition work in CSS (`.hero-slide.active`)?**
Slides are stacked absolutely; only `.active` gets `opacity: 1` while others are `opacity: 0`, with a CSS transition. JS only toggles the class — CSS animates. (See the hero slide rules around `style.css:118-121`.) This separates behavior (JS) from presentation (CSS).

**Q67. How are `.valid` / `.invalid` field states styled?**
CSS classes applied by JS (`showSuccess` adds `.valid`, `showError` adds `.invalid`). The CSS colors the input border green/red accordingly — again, JS only changes classes, CSS owns the visuals.

**Q68. Why does the header use `position: absolute` with a gradient overlay?**
`.site-header { position:absolute; ... background:linear-gradient(to bottom, rgba(2,6,23,.78), transparent); }` (`style.css:59-73`) — it floats over the hero image at the top of the page (rather than pushing content down) and darkens the top of the image for readable white text.

---

## PART 8 — Architecture, Data Flow & Misc

### EASY

**Q69. Describe the complete data flow of a registration.**
1. User fills the form.
2. Live validation runs on each keystroke; drafts auto-save to `localStorage`.
3. User clicks Register → `validateForm()` must pass.
4. `createSubmissionData()` builds URL-encoded params.
5. `fetch()` POSTs to the Apps Script web app.
6. Apps Script `doPost` acquires a lock, appends a row to the `Registrations` sheet.
7. It generates member ID `SEC-YYYY-NNNN`, sends a Gmail confirmation.
8. It returns `{ok:true, memberId, emailSent}`.
9. Front end shows the success modal and clears the draft.
*(Reference: `DOCUMENTATION.md:145-153`)*

**Q70. Why is this called "serverless"?**
There is no VPS/database server of ours. The "backend" is Google Apps Script running in Google's cloud (Sheets = storage, Gmail = mailer), triggered on demand by each HTTP request. *(Reference: `DOCUMENTATION.md:11`)*

**Q71. How do you run the project locally?**
`python3 -m http.server 8000` then open `http://localhost:8000`. *(Reference: `SETUP.md:23-31`)*

**Q72. What does `smoke_test.py` do?**
It starts a tiny local HTTP server on port 8765, fetches `index.html`, and asserts the response is 200 and contains required elements (title, meta tag, form id, button, hero, key fields). Prints "Smoke test passed" or "failed". *(Reference: `smoke_test.py:44-88`)*

### HARD

**Q73. What are the security measures in the project?**
1. Formula-injection guard in `safeCell_` (prefix `'` on `=`/`+`/`-`/`@`). *(google-apps-script.gs:152-155)*
2. HTML escaping in emails (`escapeHtml_`). *(google-apps-script.gs:143-150)*
3. Input masks strip invalid characters as user types. *(script.js:1226-1252)*
4. File type + size restrictions on upload. *(script.js:707-735)*
5. Email address restricted to DIU domain. *(script.js:392)*
(Not present: real authentication or payment gateway — documented as out of scope, `DOCUMENTATION.md:36-41`.)

**Q74. What are the limitations/weaknesses of this design?**
- Payment proof files are validated but **never stored** (`google-apps-script.gs:28-29`), so there's no actual proof record in the sheet.
- Email is limited by Apps Script daily quotas (`DOCUMENTATION.md:163`).
- No admin dashboard to review/approve applications (`DOCUMENTATION.md:38`).
- `validateName` is duplicated (`script.js:332` and `script.js:769`) — code smell, last one wins.
- Member ID uses "execute as me" Apps Script, so only the owner's drive/sheet works.
- Client-side validation can be bypassed (no server-side re-validation beyond sanitization).

**Q75. If you had more time, what would you improve?**
1. Store payment proofs in Google Drive via Apps Script (`DriveApp`).
2. Add a lightweight admin dashboard or Sheet-bound approval workflow.
3. Remove the duplicate `validateName`.
4. Add a real payment gateway reference (bKash API) instead of manual transaction ID.
5. Add server-side input validation in Apps Script, and move member ID/email sending to a queue to respect quotas.

**Q76. Why use `&=` instead of `&&=`?**
In JS, `&` is the bitwise AND and `&&` is the logical AND. `valid &= validateX()` evaluates the function (side effects always run) and bitwise-ANDs the result. If you wrote `valid &&= validateX()`, later checks would be short-circuited (skipped) once one fails. Since we want ALL validators to run (so every error shows at once), `&=` is intentional. *(Reference: `script.js:813`)*

**Q77. How does the site avoid showing all errors at once on first load?**
`showError` → `shouldMarkField` returns false for empty, untouched, pre-submit fields, so `showError` clears classes and returns without displaying a message. That's why the form looks clean on first load. *(Reference: `script.js:275-308`)*

**Q78. What is the `CNAME` file for?**
GitHub Pages deployment — it maps the site to a custom domain (e.g. `sec.diu.edu.bd`). The static site is hosted free on GitHub Pages; only the backend lives on Google.

---

## Quick-reference: where things live

| Feature | File:Line |
|---|---|
| Meta tag w/ Apps Script URL | `index.html:8` |
| Hero slider markup | `index.html:29-80` |
| Registration form starts | `index.html:353` |
| Student ID input | `index.html:399-405` |
| Payment section | `index.html:774-873` |
| Register button (disabled) | `index.html:911-918` |
| Success modal | `index.html:971-1005` |
| Slider logic | `script.js:8-78` |
| Save draft | `script.js:143-165` |
| Restore draft | `script.js:167-196` |
| shouldMarkField (UX rule) | `script.js:275-279` |
| showError / showSuccess | `script.js:281-324` |
| Student ID regex | `script.js:359-380` |
| Email regex | `script.js:388-409` |
| DOB/age check | `script.js:448-500` |
| validateForm (main gate) | `script.js:809-880` |
| Live validation wiring | `script.js:910-988` |
| scrollToFirstError | `script.js:1001-1021` |
| createSubmissionData | `script.js:1029-1049` |
| fetch submit | `script.js:1051-1121` |
| Close modal reset | `script.js:1129-1163` |
| Input masks | `script.js:1226-1264` |
| Enter-key auto-focus | `script.js:1272-1302` |
| Initial state + restore | `script.js:1310-1317` |
| Sheet name + columns | `google-apps-script.gs:5-12` |
| doPost handler | `google-apps-script.gs:14-61` |
| Member ID generation | `google-apps-script.gs:63-73` |
| Confirmation email | `google-apps-script.gs:75-128` |
| Case-insensitive lookup | `google-apps-script.gs:130-141` |
| HTML escaping | `google-apps-script.gs:143-150` |
| Formula-injection guard | `google-apps-script.gs:152-155` |
| JSON response builder | `google-apps-script.gs:157-161` |
| Smoke test | `smoke_test.py:44-88` |
| Color design tokens | `style.css:5-34` |
