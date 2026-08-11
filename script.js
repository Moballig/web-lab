// =========================================================
// HERO SLIDER
// This section controls the rotating hero banner and its
// navigation dots/arrows. It keeps the homepage visually active
// and allows keyboard and mouse interaction.
// =========================================================

const hero = document.querySelector(".hero");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const sliderDots = [...document.querySelectorAll(".slider-dot")];
const previousSlideButtons = [...document.querySelectorAll(".slider-prev")];
const nextSlideButtons = [...document.querySelectorAll(".slider-next")];
let currentSlide = 0;
let sliderTimer;

// Show the selected slide and update the active dot state.
function showSlide(index) { // Defined at line 17; called from lines 38, 55, 67-68
    currentSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === currentSlide);
    });

    sliderDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
}

// Restart the automatic slide timer so the banner keeps rotating.
function startSlider() { // Defined at line 32; called from lines 40, 63-65, 72-74
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
}

// Move to the next or previous slide and restart the timer.
function changeSlide(direction) { // Defined at line 38; called from lines 46, 50, 66-68
    showSlide(currentSlide + direction); // showSlide() defined at line 17; called here
    startSlider(); // startSlider() defined at line 32; called here
}

if (heroSlides.length) {
    // Arrow buttons move through the slide list.
    previousSlideButtons.forEach((button) => {
        button.addEventListener("click", () => changeSlide(-1));
    });

    nextSlideButtons.forEach((button) => {
        button.addEventListener("click", () => changeSlide(1));
    });

    // Dot navigation lets users jump directly to a slide.
    sliderDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index); // showSlide() defined at line 17; called here from dot click
            startSlider(); // startSlider() defined at line 32; called here after manual slide change
        });
    });

    // Pause the slider while the user hovers or focuses on the hero area.
    hero.addEventListener("mouseenter", () => window.clearInterval(sliderTimer));
    hero.addEventListener("mouseleave", startSlider);
    hero.addEventListener("focusin", () => window.clearInterval(sliderTimer));
    hero.addEventListener("focusout", startSlider);
    hero.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") changeSlide(-1);
        if (event.key === "ArrowRight") changeSlide(1);
    });

    // Restart the slider when the page becomes visible again.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) window.clearInterval(sliderTimer);
        else startSlider();
    });

    startSlider();
}

// =========================================================
// SOFTWARE ENGINEERING CLUB REGISTRATION
// Part 1 - DOM Elements & Validation Functions
// This section holds the form references and reusable validation
// helpers used throughout the registration flow.
// =========================================================

// -------------------------------
// Form Elements
// These references are used to read form data, trigger validation,
// show loading states, and display success/error feedback.
// -------------------------------

const form = document.getElementById("registrationForm");

const registerBtn = document.getElementById("registerBtn");

const loadingOverlay = document.getElementById("loadingOverlay");

const successModal = document.getElementById("successModal");

const closeModal = document.getElementById("closeModal");
const submissionError = document.getElementById("submissionError");
const googleSheetsUrl = document
    .querySelector('meta[name="google-sheets-web-app-url"]')
    ?.content.trim();

// -------------------------------
// Inputs
// -------------------------------

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const studentId = document.getElementById("studentId");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");

const semester = document.getElementById("semester");
const batch = document.getElementById("batch");
const section = document.getElementById("section");

const github = document.getElementById("github");
const linkedin = document.getElementById("linkedin");

const motivation = document.getElementById("motivation");
const contribution = document.getElementById("contribution");

const paymentMethod = document.getElementById("paymentMethod");
const transactionId = document.getElementById("transactionId");
const paymentProof = document.getElementById("paymentProof");

const meetingTime = document.getElementById("meetingTime");

const agreement = document.getElementById("agreement");

// -------------------------------
// Character Counter
// -------------------------------

const motivationCount = document.getElementById("motivationCount");
const contributionCount = document.getElementById("contributionCount");

// -------------------------------
// Radio Groups
// -------------------------------

const genderRadios =
    document.querySelectorAll("input[name='gender']");

const experienceRadios =
    document.querySelectorAll("input[name='experience']");

// -------------------------------
// Checkbox Groups
// -------------------------------

const skills =
    document.querySelectorAll("input[name='skills']");

const interests =
    document.querySelectorAll("input[name='interest']");

const days =
    document.querySelectorAll("input[name='days']");

// =========================================================
// Character Counter
// These counters update the remaining text count for the two
// long-form textareas so users stay within the 300-character limit.
// =========================================================

function updateCounter(textarea, counter) {

    counter.textContent = textarea.value.length;

}

motivation.addEventListener("input", () => {

    updateCounter(
        motivation,
        motivationCount
    );

});

contribution.addEventListener("input", () => {

    updateCounter(
        contribution,
        contributionCount
    );

});

// =========================================================
// Error Handling
// The form visually marks invalid fields and places a message next
// to them so the user knows exactly what to fix.
// =========================================================

function showError(input, message) {

    input.classList.remove("valid");

    input.classList.add("invalid");

    const error =
        input.parentElement.querySelector(".error");

    if (error) {

        error.textContent = message;

    }

}

function showSuccess(input) {

    input.classList.remove("invalid");

    input.classList.add("valid");

    const error =
        input.parentElement.querySelector(".error");

    if (error) {

        error.textContent = "";

    }

}

// =========================================================
// Text Validation
// These functions check the required text fields and ensure they
// meet the expected minimum length or format before submission.
// =========================================================

function validateName(input) {

    const value = input.value.trim();

    if (value.length < 2) {

        showError(
            input,
            "Minimum 2 characters required."
        );

        return false;

    }

    showSuccess(input);

    return true;

}

// =========================================================
// Student ID
// Student IDs follow the university's format, so we validate them
// against a strict pattern before allowing the form to submit.
// =========================================================

function validateStudentID() { // Defined at line 269; called from validateForm() at line 726

    const value = studentId.value.trim();

    const regex = /^\d{3}-\d{2}-\d{3}$/;

    if (!regex.test(value)) {

        showError(
            studentId,
            "Use the format 242-35-287."
        );

        return false;

    }

    showSuccess(studentId);

    return true;

}

// =========================================================
// Email
// Daffodil students are expected to use their university email,
// so this validation restricts the address format.
// =========================================================

function validateEmail() { // Defined at line 298; called from validateForm() at line 728

    const value = email.value.trim();

    const regex = /^[^\s@]+@diu\.edu\.bd$/i;

    if (!regex.test(value)) {

        showError(
            email,
            "Use your university email."
        );

        return false;

    }

    showSuccess(email);

    return true;

}

// =========================================================
// Phone Number
// We allow only digits so that the contact number stays consistent
// and avoids invalid characters in the form data.
// =========================================================

function validatePhone() { // Defined at line 327; called from validateForm() at line 730

    const value =
        phone.value.replace(/\s+/g, "");

    const regex =
        /^[0-9]{10,15}$/;

    if (!regex.test(value)) {

        showError(
            phone,
            "Enter a valid phone number."
        );

        return false;

    }

    showSuccess(phone);

    return true;

}

// =========================================================
// Age Validation
// The club requires members to be at least 16 before registration,
// so this function calculates age from the selected date.
// =========================================================

function validateDOB() { // Defined at line 358; called from validateForm() at line 732

    if (dob.value === "") {

        showError(
            dob,
            "Date of Birth is required."
        );

        return false;

    }

    const birth =
        new Date(dob.value);

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birth.getFullYear();

    const month =
        today.getMonth() -
        birth.getMonth();

    if (
        month < 0 ||
        (month === 0 &&
            today.getDate() < birth.getDate())
    ) {

        age--;

    }

    if (age < 16) {

        showError(
            dob,
            "Minimum age is 16."
        );

        return false;

    }

    showSuccess(dob);

    return true;

}

// =========================================================
// Dropdown Validation
// Select fields must be answered to ensure the form is complete.
// =========================================================

function validateSelect(select) { // Defined at line 417; called from validateForm() at lines 735, 742, 748, 756

    if (select.value === "") {

        showError(
            select,
            "Please select an option."
        );

        return false;

    }

    showSuccess(select);

    return true;

}

// =========================================================
// Textarea Validation
// Motivation and contribution fields are required to contain enough
// detail, so they are checked for a minimum word count/length.
// =========================================================

function validateTextarea(textarea) { // Defined at line 442; called from validateForm() at lines 746-747

    const value =
        textarea.value.trim();

    if (value.length < 20) {

        showError(
            textarea,
            "Minimum 20 characters required."
        );

        return false;

    }

    showSuccess(textarea);

    return true;

}
// =========================================================
// Part 2 - Group Validation & Form Validation
// This section validates grouped controls such as radios, checkboxes,
// and the final form state before enabling the submit button.
// =========================================================

// ---------------------------------------------------------
// Radio Button Validation
// Ensures at least one option in each radio group is selected.
// ---------------------------------------------------------

function validateRadioGroup(radios, message) { // Defined at line 474; called from validateForm() at lines 760-767

    const checked =
        [...radios].some(radio => radio.checked);

    const error =
        radios[0]
            .closest(".form-group")
            .querySelector(".error");

    if (!checked) {

        if (error)
            error.textContent = message;

        return false;

    }

    if (error)
        error.textContent = "";

    return true;

}

// ---------------------------------------------------------
// Checkbox Validation
// Checks that the user selected at least one skill or interest.
// ---------------------------------------------------------

function validateCheckboxGroup(boxes, message) { // Defined at line 505; called from validateForm() at lines 769-782

    if (!boxes.length) return true;

    const checked =
        [...boxes].some(box => box.checked);

    const error =
        boxes[0]
            .closest(".form-group")
            .querySelector(".error");

    if (!checked) {

        if (error)
            error.textContent = message;

        return false;

    }

    if (error)
        error.textContent = "";

    return true;

}

// ---------------------------------------------------------
// URL Validation (Optional)
// Social/profile links are optional, but if provided they must be
// valid absolute URLs for correct formatting.
// ---------------------------------------------------------

function validateURL(input) { // Defined at line 539; called from validateForm() at lines 753-754

    if (input.value.trim() === "")
        return true;

    try {

        new URL(input.value);

        showSuccess(input);

        return true;

    }

    catch {

        showError(
            input,
            "Please enter a valid URL."
        );

        return false;

    }

}

// ---------------------------------------------------------
// Transaction ID
// Payment references are required for club registration and are
// checked for a minimum valid length.
// ---------------------------------------------------------

function validateTransactionID() { // Defined at line 573; called from validateForm() at line 749

    const value =
        transactionId.value.trim();

    if (value.length < 8) {

        showError(
            transactionId,
            "Enter a valid transaction ID."
        );

        return false;

    }

    showSuccess(transactionId);

    return true;

}

// ---------------------------------------------------------
// Payment Screenshot
// The proof of payment must be present and within a safe file type
// and size limit before the application can be submitted.
// ---------------------------------------------------------

function validatePaymentProof() { // Defined at line 601; called from validateForm() at line 750

    if (paymentProof.files.length === 0) {

        showError(
            paymentProof,
            "Upload your payment screenshot."
        );

        return false;

    }

    const file =
        paymentProof.files[0];

    const allowed =
        [
            "image/png",
            "image/jpeg",
            "image/webp",
            "application/pdf"
        ];

    if (!allowed.includes(file.type)) {

        showError(
            paymentProof,
            "Only JPG, PNG, WEBP or PDF allowed."
        );

        return false;

    }

    if (file.size > 5 * 1024 * 1024) {

        showError(
            paymentProof,
            "Maximum file size is 5MB."
        );

        return false;

    }

    showSuccess(paymentProof);

    return true;

}

// ---------------------------------------------------------
// Agreement
// Members must confirm the declaration before submission.
// ---------------------------------------------------------

function validateAgreement() { // Defined at line 658; called from validateForm() at line 785

    const error =
        agreement
            .closest(".agreement")
            .querySelector(".error");

    if (!agreement.checked) {

        error.textContent =
            "Please accept the declaration.";

        return false;

    }

    error.textContent = "";

    return true;

}
function validateName(input) { // Defined at line 242; called from validateForm() at lines 719-758

    const value = input.value.trim();

    if (value.length < 2) {

        showError(
            input,
            "Minimum 2 characters required."
        );

        return false;

    }

    showSuccess(input);

    return true;

}

function validateSection() { // Defined at line 700; called from validateForm() at line 739
    const value = section.value.trim();

    if (!/^[a-z0-9-]{1,4}$/i.test(value)) {
        showError(section, "Enter a valid section, such as A or PC-A.");
        return false;
    }

    showSuccess(section);
    return true;
}

// ---------------------------------------------------------
// Entire Form Validation
// This is the main validation gate. It runs the full set of checks
// and enables or disables the registration button depending on the
// result of all required fields.
// ---------------------------------------------------------

function validateForm() { // Defined at line 719; called from lines 822-863, 929, 933

    let valid = true;

    valid &= validateName(firstName); // Defined in validateName(); called here

    valid &= validateName(lastName); // Defined in validateName(); called here

    valid &= validateStudentID(); // Defined in validateStudentID(); called here

    valid &= validateEmail(); // Defined in validateEmail(); called here

    valid &= validatePhone(); // Defined in validatePhone(); called here

    valid &= validateDOB(); // Defined in validateDOB(); called here

    valid &= validateSelect(semester); // Defined in validateSelect(); called here

    valid &= validateName(batch); // Defined in validateName(); called here

    valid &= validateSection(); // Defined in validateSection(); called here

    valid &= validateTextarea(motivation); // Defined in validateTextarea(); called here

    valid &= validateTextarea(contribution); // Defined in validateTextarea(); called here

    valid &= validateSelect(paymentMethod); // Defined in validateSelect(); called here

    valid &= validateTransactionID(); // Defined in validateTransactionID(); called here

    valid &= validatePaymentProof(); // Defined in validatePaymentProof(); called here

    if (meetingTime) valid &= validateSelect(meetingTime); // Defined in validateSelect(); called here

    valid &= validateURL(github); // Defined in validateURL(); called here

    valid &= validateURL(linkedin); // Defined in validateURL(); called here

    valid &= validateRadioGroup(
        genderRadios,
        "Select your gender."
    ); // Defined in validateRadioGroup(); called here

    valid &= validateRadioGroup(
        experienceRadios,
        "Select your experience level."
    ); // Defined in validateRadioGroup(); called here

    valid &= validateCheckboxGroup(
        skills,
        "Select at least one skill."
    ); // Defined in validateCheckboxGroup(); called here

    valid &= validateCheckboxGroup(
        interests,
        "Select at least one area of interest."
    ); // Defined in validateCheckboxGroup(); called here

    if (days.length) {
        valid &= validateCheckboxGroup(
            days,
            "Select at least one available day."
        ); // Defined in validateCheckboxGroup(); called here
    }

    valid &= validateAgreement(); // Defined in validateAgreement(); called here

    registerBtn.disabled = !valid;

    return Boolean(valid);

}

// ---------------------------------------------------------
// Live Validation
// The page validates users as they type so field errors appear
// immediately and the submit button reflects current status.
// ---------------------------------------------------------

const textInputs = [

    firstName,
    lastName,
    studentId,
    email,
    phone,
    dob,
    semester,
    batch,
    section,
    github,
    linkedin,
    motivation,
    contribution,
    paymentMethod,
    transactionId,
    paymentProof,
    meetingTime

];

textInputs.filter(Boolean).forEach(input => {

    input.addEventListener("input", validateForm); // validateForm() defined above; called here on every input event

    input.addEventListener("change", validateForm); // validateForm() defined above; called here on change event

});

genderRadios.forEach(radio =>
    radio.addEventListener(
        "change",
        validateForm // validateForm() defined above; called here when gender changes
    )
);

experienceRadios.forEach(radio =>
    radio.addEventListener(
        "change",
        validateForm // validateForm() defined above; called here when experience changes
    )
);

skills.forEach(box =>
    box.addEventListener(
        "change",
        validateForm // validateForm() defined above; called here when skills change
    )
);

interests.forEach(box =>
    box.addEventListener(
        "change",
        validateForm // validateForm() defined above; called here when interests change
    )
);

days.forEach(box =>
    box.addEventListener(
        "change",
        validateForm // validateForm() defined above; called here when day selections change
    )
);

agreement.addEventListener(
    "change",
    validateForm // validateForm() defined above; called here when agreement checkbox changes
);
// =========================================================
// Part 3 - Form Submission, Loading, Modal & Reset
// This final section submits the completed form, shows a loading
// state, handles the success modal, and resets the page state.
// =========================================================

// ---------------------------------------------------------
// Scroll to First Error
// When validation fails, this helps move the user directly to the
// first invalid field so they can fix it without confusion.
// ---------------------------------------------------------

function scrollToFirstError() { // Defined at line 879; called from line 933

    const firstError = document.querySelector(

        ".invalid, .error:not(:empty)"

    );

    if (firstError) {

        firstError.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

}

// ---------------------------------------------------------
// Google Sheets Submission
// The form data is converted into URL-encoded parameters before
// being sent to the Apps Script endpoint that stores entries.
// ---------------------------------------------------------

function createSubmissionData() { // Defined at line 907; called from line 947
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [name, value] of formData.entries()) {
        if (value instanceof File) continue;

        if (params.has(name)) {
            params.set(name, `${params.get(name)}, ${value}`);
        } else {
            params.set(name, value);
        }
    }

    // Keep critical fields explicit even if browser FormData behavior varies.
    params.set("email", email.value.trim());
    params.set("firstName", firstName.value.trim());
    params.set("studentId", studentId.value.trim());
    params.set("submittedFrom", window.location.href);
    return params;
}

form.addEventListener("submit", async function (e) { // submit listener; calls validateForm() and scrollToFirstError()

    e.preventDefault();

    if (!validateForm()) { // validateForm() defined above; called here before sending

        scrollToFirstError(); // scrollToFirstError() defined above; called here when validation fails

        return;

    }

    if (!googleSheetsUrl) {
        submissionError.textContent =
            "Google Sheets is not configured yet. Add your deployed Apps Script URL to index.html.";
        return;
    }

    registerBtn.disabled = true;
    submissionError.textContent = "";

    loadingOverlay.classList.add("active");

    try {
        const body = createSubmissionData(); // createSubmissionData() defined above; called here before fetch()

        const response = await fetch(googleSheetsUrl, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body
        });

        const responseText = await response.text();
        let responseData;

        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = { ok: response.ok };
        }

        if (!response.ok || responseData.ok !== true) {
            throw new Error(
                responseData?.error ||
                `Apps Script returned ${response.status} ${response.statusText}`
            );
        }

        loadingOverlay.classList.remove("active");
        registerBtn.disabled = false;
        successModal.classList.add("active");
    } catch (error) {
        loadingOverlay.classList.remove("active");
        registerBtn.disabled = false;

        const message = error instanceof Error && error.message
            ? error.message
            : "Registration could not be submitted. Check your connection and try again.";

        submissionError.textContent =
            message === "Failed to fetch"
                ? "The Google Apps Script endpoint rejected the request. Recheck the deployed web-app URL and publish it with Anyone access."
                : message;

        console.error("Google Sheets submission failed:", error);
    }

});

// ---------------------------------------------------------
// Close Success Modal
// Resetting the form after a successful submission clears all
// validation styling and returns the page to a clean initial state.
// ---------------------------------------------------------

closeModal.addEventListener("click", () => {

    successModal.classList.remove("active");

    form.reset();

    // Remove validation classes
    document
        .querySelectorAll(".valid, .invalid")
        .forEach(element => {

            element.classList.remove(
                "valid",
                "invalid"
            );

        });

    // Clear error messages
    document
        .querySelectorAll(".error")
        .forEach(error => {

            error.textContent = "";

        });

    // Reset character counters
    motivationCount.textContent = "0";
    contributionCount.textContent = "0";

    registerBtn.disabled = true;

});

// ---------------------------------------------------------
// Reset Button
// Clearing the form must also remove all error classes and reset
// the character counters back to zero.
// ---------------------------------------------------------

form.addEventListener("reset", () => {

    setTimeout(() => {

        document
            .querySelectorAll(".valid, .invalid")
            .forEach(element => {

                element.classList.remove(
                    "valid",
                    "invalid"
                );

            });

        document
            .querySelectorAll(".error")
            .forEach(error => {

                error.textContent = "";

            });

        motivationCount.textContent = "0";
        contributionCount.textContent = "0";

        registerBtn.disabled = true;

    }, 10);

});

// ---------------------------------------------------------
// Optional: Close Modal by Clicking Outside
// Clicking outside the success modal behaves like pressing the
// close button and closes the confirmation dialog.
// ---------------------------------------------------------

window.addEventListener("click", (e) => {

    if (e.target === successModal) {

        closeModal.click();

    }

});

// ---------------------------------------------------------
// Prevent Spaces in Student ID
// This keeps the university ID clean and formatted as a numeric ID
// with hyphens only.
// ---------------------------------------------------------

studentId.addEventListener("input", () => {
    studentId.value = studentId.value.replace(/[^0-9-]/g, "");

});

// ---------------------------------------------------------
// Prevent Letters in Phone Number
// Phone numbers are stored as numeric values, so text characters are
// stripped as the user types.
// ---------------------------------------------------------

phone.addEventListener("input", () => {

    phone.value = phone.value.replace(/[^0-9]/g, "");

});

// ---------------------------------------------------------
// Limit Batch Input
// Batch values are numeric, so this input only accepts digits.
// ---------------------------------------------------------

batch.addEventListener("input", () => {

    batch.value = batch.value.replace(/[^0-9]/g, "");

});

// ---------------------------------------------------------
// Capitalize Section
// Sections are usually displayed in uppercase letters, so this auto-
// formats the text as the user types.
// ---------------------------------------------------------

section.addEventListener("input", () => {

    section.value = section.value.toUpperCase();

});

// ---------------------------------------------------------
// Auto Focus Next Field (Optional)
// Pressing Enter in a non-textarea field moves the cursor to the next
// input, which makes long forms easier to complete quickly.
// ---------------------------------------------------------

const inputs = document.querySelectorAll(

    "input, select, textarea"

);

inputs.forEach((input, index) => {

    input.addEventListener("keydown", (e) => {

        if (

            e.key === "Enter" &&

            input.tagName !== "TEXTAREA"

        ) {

            e.preventDefault();

            if (inputs[index + 1]) {

                inputs[index + 1].focus();

            }

        }

    });

});

// ---------------------------------------------------------
// Initial State
// The form begins in a disabled state until all required validation
// checks pass successfully.
// ---------------------------------------------------------

registerBtn.disabled = true;

motivationCount.textContent = "0";

contributionCount.textContent = "0";

validateForm();

// =========================================================
// End of Script
// =========================================================
