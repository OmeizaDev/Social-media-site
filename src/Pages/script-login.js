
import { login, createAccount } from "../auth/auth.js";
import { saveUser, getUser } from "../utils/storage.js";

// ============================================
// ELEMENTS
// ============================================

// Login elements
const loginForm = document.querySelector("#login-form");
const emailField = document.querySelector("#email-field");
const passwordField = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");
const passwordError = document.querySelector('#password-error');
const loginBtn = document.querySelector("#login-btn");

// Signup elements
const createAccountForm = document.querySelector("#create-account-form");
const signUpEmailField = document.querySelector("#signup-email-field");
const signUpErrorMsg = document.querySelector("#signup-email-error");
const createPassword = document.querySelector("#create-password");
const confirmPassword = document.querySelector("#confirm-password");
const firstName = document.querySelector("#first-name");
const firstNameError = document.querySelector("#first-name-error");
const lastName = document.querySelector("#last-name");
const lastNameError = document.querySelector("#last-name-error");
const DateOfBirth = document.querySelector("#date-of-birth");
const DateOfBirthError = document.querySelector("#dob-error");
const gender = document.querySelector("#gender");
const genderError = document.querySelector("#gender-error");
const createPasswordError = document.querySelector("#create-password-error");
const confirmPasswordError = document.querySelector("#confirm-password-error");
const createAccountBtn = document.querySelector("#create-account-btn");

// Screen navigation elements
const loginScreen = document.querySelector("#login-screen");
const resetPasswordScreen = document.querySelector("#reset-password-screen");
const otpScreen = document.querySelector("#otp-screen");
const changePasswordScreen = document.querySelector("#change-password-screen");
const createAccountScreen = document.querySelector("#create-account-screen");
const forgotPasswordBtn = document.querySelector("#forgot-password");
const rememberPasswordBtn = document.querySelector("#remember-password");
const resetLinkForm = document.querySelector("#reset-password-screen form");
const otpForm = document.querySelector("#otp-form");
const newPasswordForm = document.querySelector("#new-password-form");
const createAccountNav = document.querySelector("#create-account-nav");
const loginNavBtn = document.querySelector("#login-nav-btn");

// ============================================
// REGEX PATTERNS
// ============================================

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================
// LOGIN FORM HANDLER
// ============================================

// ✅ Clear errors when typing
emailField.addEventListener("input", function () {
    errorMessage.textContent = "";
    emailField.classList.remove("border-red-500");
});

passwordField.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordField.classList.remove("border-red-500");
});

// ✅ LOGIN FORM SUBMIT
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear errors
    errorMessage.textContent = "";
    passwordError.textContent = "";

    // EMAIL VALIDATION
    if (emailField.value.trim() === "") {
        errorMessage.textContent = "Email is required.";
        emailField.classList.add("border-red-500");
        return;
    }

    if (!emailPattern.test(emailField.value)) {
        errorMessage.textContent = "Please enter a valid email.";
        emailField.classList.add("border-red-500");
        return;
    }

    // PASSWORD VALIDATION
    if (passwordField.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        passwordField.classList.add("border-red-500");
        return;
    }

    if (passwordField.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        passwordField.classList.add("border-red-500");
        return;
    }

    // LOADING STATE
    loginBtn.textContent = "Signing in...";
    loginBtn.disabled = true;

    // ✅ FIXED: Use login() function properly
    setTimeout(() => {
        // Try to login
        const user = login(emailField.value, passwordField.value);
        
        if (user) {
            // Success - save user and redirect
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "./index.html";
        } else {
            // Failed - show error
            errorMessage.textContent = "Invalid email or password. Please try again.";
            loginBtn.textContent = "Sign in";
            loginBtn.disabled = false;
        }
    }, 1500);
});

// ============================================
// SIGNUP FORM HANDLER
// ============================================

// ✅ Clear errors when typing
signUpEmailField.addEventListener("input", () => {
    signUpErrorMsg.textContent = "";
    signUpEmailField.classList.remove("border-red-500");
});

firstName.addEventListener("input", () => {
    firstNameError.textContent = "";
    firstName.classList.remove("border-red-500");
});

lastName.addEventListener("input", () => {
    lastNameError.textContent = "";
    lastName.classList.remove("border-red-500");
});

DateOfBirth.addEventListener("input", () => {
    DateOfBirthError.textContent = "";
    DateOfBirth.classList.remove("border-red-500");
});

createPassword.addEventListener("input", () => {
    createPasswordError.textContent = "";
    createPassword.classList.remove("border-red-500");
});

confirmPassword.addEventListener("input", () => {
    confirmPasswordError.textContent = "";
    confirmPassword.classList.remove("border-red-500");
});

// ✅ SIGNUP FORM SUBMIT
createAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear all errors
    signUpErrorMsg.textContent = "";
    firstNameError.textContent = "";
    lastNameError.textContent = "";
    DateOfBirthError.textContent = "";
    createPasswordError.textContent = "";
    confirmPasswordError.textContent = "";

    // Remove all red borders
    document.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500');
    });

    // ====================
    // EMAIL VALIDATION
    // ====================
    if (signUpEmailField.value.trim() === "") {
        signUpErrorMsg.textContent = "Email is required";
        signUpEmailField.classList.add("border-red-500");
        return;
    }

    if (!emailPattern.test(signUpEmailField.value)) {
        signUpErrorMsg.textContent = "Please enter a valid email";
        signUpEmailField.classList.add("border-red-500");
        return;
    }

    // ====================
    // FIRST NAME VALIDATION
    // ====================
    if (firstName.value.trim() === "") {
        firstNameError.textContent = "First name is required";
        firstName.classList.add("border-red-500");
        return;
    }

    // ====================
    // LAST NAME VALIDATION
    // ====================
    if (lastName.value.trim() === "") {
        lastNameError.textContent = "Last name is required";
        lastName.classList.add("border-red-500");
        return;
    }

    // ====================
    // DATE OF BIRTH VALIDATION
    // ====================
    if (DateOfBirth.value.trim() === "") {
        DateOfBirthError.textContent = "Date of birth is required";
        DateOfBirth.classList.add("border-red-500");
        return;
    }

    // ====================
    // GENDER VALIDATION
    // ====================
    if (!gender.value) {
        genderError.textContent = "Please select your gender";
        gender.classList.add("border-red-500");
        return;
    }

    // ====================
    // PASSWORD VALIDATION
    // ====================
    if (createPassword.value.trim() === "") {
        createPasswordError.textContent = "Password is required";
        createPassword.classList.add("border-red-500");
        return;
    }

    if (createPassword.value.length < 6) {
        createPasswordError.textContent = "Password must be at least 6 characters";
        createPassword.classList.add("border-red-500");
        return;
    }

    // ====================
    // CONFIRM PASSWORD VALIDATION
    // ====================
    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password";
        confirmPassword.classList.add("border-red-500");
        return;
    }

    if (createPassword.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match";
        confirmPassword.classList.add("border-red-500");
        return;
    }

    // ====================
    // LOADING STATE
    // ====================
    createAccountBtn.textContent = "Creating account...";
    createAccountBtn.disabled = true;

    // ====================
    // CREATE ACCOUNT
    // ====================
    setTimeout(() => {
        // Create user object
        const newUser = {
            id: Date.now(),
            fullName: `${firstName.value.trim()} ${lastName.value.trim()}`,
            username: firstName.value.trim().toLowerCase(),
            email: signUpEmailField.value.trim(),
            password: createPassword.value,
            profileImage: "../images/Profile_img (0).jpg",
            gender: gender.value,
            dateOfBirth: DateOfBirth.value,
            followers: 0,
            following: 0,
            posts: 0,
            createdAt: new Date().toISOString()
        };

        // ✅ Save user using createAccount()
        createAccount(newUser);
        
        // Save current user
        saveUser(newUser);

        // Redirect to feed
        window.location.href = "./index.html";

        // Reset button (just in case)
        createAccountBtn.textContent = "Create account";
        createAccountBtn.disabled = false;
    }, 1500);
});

// ============================================
// SCREEN NAVIGATION
// ============================================

function hideAllScreens() {
    loginScreen.classList.add("hidden");
    resetPasswordScreen.classList.add("hidden");
    otpScreen.classList.add("hidden");
    changePasswordScreen.classList.add("hidden");
    createAccountScreen.classList.add("hidden");
}

// Forgot Password
forgotPasswordBtn.addEventListener("click", () => {
    hideAllScreens();
    resetPasswordScreen.classList.remove("hidden");
});

// Remember Password
rememberPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllScreens();
    loginScreen.classList.remove("hidden");
});

// Reset Link
resetLinkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAllScreens();
    otpScreen.classList.remove("hidden");
});

// OTP
otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAllScreens();
    changePasswordScreen.classList.remove("hidden");
});

// New Password
newPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAllScreens();
    loginScreen.classList.remove("hidden");
});

// Create Account Navigation
createAccountNav.addEventListener("click", () => {
    hideAllScreens();
    createAccountScreen.classList.remove("hidden");
});

// Login Navigation
loginNavBtn.addEventListener("click", () => {
    hideAllScreens();
    loginScreen.classList.remove("hidden");
});