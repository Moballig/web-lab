// =========================================================
// SOFTWARE ENGINEERING CLUB REGISTRATION
// Part 1 - DOM Elements & Validation Functions
// =========================================================

// -------------------------------
// Form Elements
// -------------------------------

const form = document.getElementById("registrationForm");

const registerBtn = document.getElementById("registerBtn");

const loadingOverlay = document.getElementById("loadingOverlay");

const successModal = document.getElementById("successModal");

const closeModal = document.getElementById("closeModal");

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
// =========================================================

function validateStudentID() {

    const value = studentId.value.trim();

    const regex = /^[0-9-]{8,16}$/;

    if (!regex.test(value)) {

        showError(
            studentId,
            "Student ID must contain 8-12 digits."
        );

        return false;

    }

    showSuccess(studentId);

    return true;

}

// =========================================================
// Email
// =========================================================

function validateEmail() {

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
// =========================================================

function validatePhone() {

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
// =========================================================

function validateDOB() {

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
// =========================================================

function validateSelect(select) {

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
// =========================================================

function validateTextarea(textarea) {

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
// =========================================================

// ---------------------------------------------------------
// Radio Button Validation
// ---------------------------------------------------------

function validateRadioGroup(radios, message) {

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
// ---------------------------------------------------------

function validateCheckboxGroup(boxes, message) {

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
// ---------------------------------------------------------

function validateURL(input) {

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
// ---------------------------------------------------------

function validateTransactionID() {

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
// ---------------------------------------------------------

function validatePaymentProof() {

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
// ---------------------------------------------------------

function validateAgreement() {

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

// ---------------------------------------------------------
// Entire Form Validation
// ---------------------------------------------------------

function validateForm() {

    let valid = true;

    valid &= validateName(firstName);

    valid &= validateName(lastName);

    valid &= validateStudentID();

    valid &= validateEmail();

    valid &= validatePhone();

    valid &= validateDOB();

    valid &= validateSelect(semester);

    valid &= validateName(batch);

    valid &= validatesection();

    valid &= validateTextarea(motivation);

    valid &= validateTextarea(contribution);

    valid &= validateSelect(paymentMethod);

    valid &= validateTransactionID();

    valid &= validatePaymentProof();

    valid &= validateSelect(meetingTime);

    valid &= validateURL(github);

    valid &= validateURL(linkedin);

    valid &= validateRadioGroup(
        genderRadios,
        "Select your gender."
    );

    valid &= validateRadioGroup(
        experienceRadios,
        "Select your experience level."
    );

    valid &= validateCheckboxGroup(
        skills,
        "Select at least one skill."
    );

    valid &= validateCheckboxGroup(
        interests,
        "Select at least one area of interest."
    );

    valid &= validateCheckboxGroup(
        days,
        "Select at least one available day."
    );

    valid &= validateAgreement();

    registerBtn.disabled = !valid;

    return Boolean(valid);

}

// ---------------------------------------------------------
// Live Validation
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

textInputs.forEach(input => {

    input.addEventListener("input", validateForm);

    input.addEventListener("change", validateForm);

});

genderRadios.forEach(radio =>
    radio.addEventListener(
        "change",
        validateForm
    )
);

experienceRadios.forEach(radio =>
    radio.addEventListener(
        "change",
        validateForm
    )
);

skills.forEach(box =>
    box.addEventListener(
        "change",
        validateForm
    )
);

interests.forEach(box =>
    box.addEventListener(
        "change",
        validateForm
    )
);

days.forEach(box =>
    box.addEventListener(
        "change",
        validateForm
    )
);

agreement.addEventListener(
    "change",
    validateForm
);
// =========================================================
// Part 3 - Form Submission, Loading, Modal & Reset
// =========================================================

// ---------------------------------------------------------
// Scroll to First Error
// ---------------------------------------------------------

function scrollToFirstError() {

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
// Form Submit
// ---------------------------------------------------------

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!validateForm()) {

        scrollToFirstError();

        return;

    }

    registerBtn.disabled = true;

    loadingOverlay.classList.add("active");

    // Simulate API request
    setTimeout(() => {

        loadingOverlay.classList.remove("active");

        successModal.classList.add("active");

    }, 2000);

});

// ---------------------------------------------------------
// Close Success Modal
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
// ---------------------------------------------------------

window.addEventListener("click", (e) => {

    if (e.target === successModal) {

        closeModal.click();

    }

});

// ---------------------------------------------------------
// Prevent Spaces in Student ID
// ---------------------------------------------------------

studentId.addEventListener("input", () => {

    studentId.value = studentId.value.replace(/\D/g, "");

});

// ---------------------------------------------------------
// Prevent Letters in Phone Number
// ---------------------------------------------------------

phone.addEventListener("input", () => {

    phone.value = phone.value.replace(/[^0-9]/g, "");

});

// ---------------------------------------------------------
// Limit Batch Input
// ---------------------------------------------------------

batch.addEventListener("input", () => {

    batch.value = batch.value.replace(/[^0-9]/g, "");

});

// ---------------------------------------------------------
// Capitalize Section
// ---------------------------------------------------------

section.addEventListener("input", () => {

    section.value = section.value.toUpperCase();

});

// ---------------------------------------------------------
// Auto Focus Next Field (Optional)
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
// ---------------------------------------------------------

registerBtn.disabled = true;

motivationCount.textContent = "0";

contributionCount.textContent = "0";

validateForm();

// =========================================================
// End of Script
// =========================================================