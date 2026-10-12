const registrationForm = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const birthDateInput = document.getElementById("birthDate");
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

birthDateInput.setAttribute("max", localToday);

function getErrorElement(field) {
    return document.getElementById(field.id + "Error");
}

function showError(field, message) {
    const errorElement = getErrorElement(field);

    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(field) {
    const errorElement = getErrorElement(field);

    field.classList.remove("error");
    field.removeAttribute("aria-invalid");

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function validateField(field) {
    const fieldLabel = field.dataset.label || field.name;
    const isRequired = field.dataset.required === "true";

    if (field.type !== "checkbox") {
        field.value = field.value.trim();
    }

    const value = field.type === "checkbox"
        ? field.checked
        : field.value;

    if (isRequired && !value) {
        showError(field, `${fieldLabel} is required.`);
        return false;
    }

    if (!value) {
        clearError(field);
        return true;
    }

    if (field.id === "fullName") {
        if (field.value.length < 2) {
            showError(field, "Full name must contain at least 2 characters.");
            return false;
        }

        if (!/^[\p{L}\p{M} .'-]+$/u.test(field.value)) {
            showError(field, "Enter a valid full name using letters and spaces.");
            return false;
        }
    }

    if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(field.value)) {
            showError(field, "Enter a valid email address, such as name@example.com.");
            return false;
        }
    }

    if (field.id === "phone") {
        const phonePattern = /^09\d{9}$/;

        if (!phonePattern.test(field.value)) {
            showError(field, "Enter an 11-digit Philippine mobile number starting with 09.");
            return false;
        }
    }

    if (field.id === "birthDate") {
        if (field.value > localToday) {
            showError(field, "Date of birth cannot be in the future.");
            return false;
        }
    }

    if (field.id === "password") {
        if (field.value.length < 8) {
            showError(field, "Password must contain at least 8 characters.");
            return false;
        }

        const confirmPassword = document.getElementById("confirmPassword");

        if (confirmPassword.value.trim() !== "") {
            validateField(confirmPassword);
        }
    }

    if (field.id === "confirmPassword") {
        const password = document.getElementById("password");

        if (field.value !== password.value) {
            showError(field, "Passwords do not match.");
            return false;
        }
    }

    if (field.id === "agreement" && !field.checked) {
        showError(field, "You must accept the agreement before registering.");
        return false;
    }

    clearError(field);
    return true;
}

const requiredFields = Array.from(
    registrationForm.querySelectorAll('[data-required="true"]')
);

registrationForm.addEventListener("submit", function(event) {
    event.preventDefault();

    successMessage.hidden = true;

    let formIsValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(function(field) {
        const isValid = validateField(field);

        if (!isValid) {
            formIsValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
    });

    if (!formIsValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;
    }

    requiredFields.forEach(function(field) {
        clearError(field);
    });

    successMessage.textContent =
        "Registration successful! Your information has been validated.";

    successMessage.hidden = false;
    successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

requiredFields.forEach(function(field) {
    const eventName = field.type === "checkbox" ||
                      field.tagName === "SELECT" ||
                      field.type === "date"
        ? "change"
        : "input";

    field.addEventListener(eventName, function() {
        validateField(field);
    });

    field.addEventListener("blur", function() {
        validateField(field);
    });
});

const passwordButtons = document.querySelectorAll(".toggle-password");

passwordButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (!passwordInput) {
            return;
        }

        const shouldShow = passwordInput.type === "password";

        passwordInput.setAttribute(
            "type",
            shouldShow ? "text" : "password"
        );

        button.textContent = shouldShow ? "Hide" : "Show";
        button.setAttribute(
            "aria-label",
            shouldShow ? "Hide password" : "Show password"
        );
        button.setAttribute(
            "aria-pressed",
            String(shouldShow)
        );

        button.classList.toggle("active", shouldShow);
    });
});

registrationForm.addEventListener("reset", function() {
    requiredFields.forEach(function(field) {
        clearError(field);
    });

    successMessage.hidden = true;
    successMessage.textContent = "";
    passwordButtons.forEach(function(button) {
        const passwordInput = document.getElementById(button.dataset.target);

        if (passwordInput) {
            passwordInput.setAttribute("type", "password");
        }

        button.textContent = "Show";
        button.setAttribute("aria-label", "Show password");
        button.setAttribute("aria-pressed", "false");
        button.classList.remove("active");
    });

    birthDateInput.setAttribute("max", localToday);
});