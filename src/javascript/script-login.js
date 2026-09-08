// src/Pages/script-login.js

import { login, createAccount, resetPassword } from "../auth/auth.js";
import { saveUserToFirestore } from "../utils/storage.js";

// LOGIN ELEMENTS
const loginForm = document.querySelector("#login-form");
const emailField = document.querySelector("#email-field");
const passwordField = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");
const passwordError = document.querySelector('#password-error');
const loginBtn = document.querySelector("#login-btn");

// SIGNUP ELEMENTS

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

// SCREEN NAVIGATION ELEMENT

const loginScreen = document.querySelector("#login-screen");
const resetPasswordScreen = document.querySelector("#reset-password-screen");
const otpScreen = document.querySelector("#otp-screen");
const changePasswordScreen = document.querySelector("#change-password-screen");
const createAccountScreen = document.querySelector("#create-account-screen");
const forgotPasswordBtn = document.querySelector("#forgot-password");
const rememberPasswordBtn = document.querySelector("#remember-password");
const resetLinkForm = document.querySelector("#reset-password-screen form");
const createAccountNav = document.querySelector("#create-account-nav");
const loginNavBtn = document.querySelector("#login-nav-btn");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// LOGIN FORM HANDLER

// CLEAR ERROR WHEN ERRORS
if (emailField) {
    emailField.addEventListener("input", function () {
        if (errorMessage) errorMessage.textContent = "";
        emailField.classList.remove("border-red-500");
    });
}

if (passwordField) {
    passwordField.addEventListener("input", function () {
        if (passwordError) passwordError.textContent = "";
        passwordField.classList.remove("border-red-500");
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        errorMessage.textContent = "";
        passwordError.textContent = "";

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

        loginBtn.textContent = "Signing in...";
        loginBtn.disabled = true;

        setTimeout(async () => {
            try {
                await login(emailField.value.trim(), passwordField.value);
                window.location.href = "../index.html";
            } catch (error) {
                if (
                    error.code === "auth/invalid-credential" ||
                    error.code === "auth/wrong-password" ||
                    error.code === "auth/user-not-found"
                ) {
                    errorMessage.textContent = "Incorrect email or password.";
                } else {
                    console.error(error);
                    errorMessage.textContent = "Unable to sign in.";
                }

                loginBtn.textContent = "Sign in";
                loginBtn.disabled = false;
            }
        }, 1500);
    });
}

// SIGNUP FORM HANDLER

// CLEAR ERRORS WHEN TYPING

if (signUpEmailField) {
    signUpEmailField.addEventListener("input", () => {
        if (signUpErrorMsg) signUpErrorMsg.textContent = "";
        signUpEmailField.classList.remove("border-red-500");
    });
}

if (firstName) {
    firstName.addEventListener("input", () => {
        if (firstNameError) firstNameError.textContent = "";
        firstName.classList.remove("border-red-500");
    });
}

if (lastName) {
    lastName.addEventListener("input", () => {
        if (lastNameError) lastNameError.textContent = "";
        lastName.classList.remove("border-red-500");
    });
}

if (DateOfBirth) {
    DateOfBirth.addEventListener("input", () => {
        if (DateOfBirthError) DateOfBirthError.textContent = "";
        DateOfBirth.classList.remove("border-red-500");
    });
}

if (createPassword) {
    createPassword.addEventListener("input", () => {
        if (createPasswordError) createPasswordError.textContent = "";
        createPassword.classList.remove("border-red-500");
    });
}

if (confirmPassword) {
    confirmPassword.addEventListener("input", () => {
        if (confirmPasswordError) confirmPasswordError.textContent = "";
        confirmPassword.classList.remove("border-red-500");
    });
}

if (gender) {
    gender.addEventListener("change", () => {
        if (genderError) genderError.textContent = "";
        gender.classList.remove("border-red-500");
    });
}

// SIGNUP FORM SUBMIT

if (createAccountForm) {
    createAccountForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // CLEAR ALL ERRORS

        if (signUpErrorMsg) signUpErrorMsg.textContent = "";
        if (firstNameError) firstNameError.textContent = "";
        if (lastNameError) lastNameError.textContent = "";
        if (DateOfBirthError) DateOfBirthError.textContent = "";
        if (genderError) genderError.textContent = "";
        if (createPasswordError) createPasswordError.textContent = "";
        if (confirmPasswordError) confirmPasswordError.textContent = "";

        // REMOVE ALL RED BORDERS

        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });

        // EMAIL VALIDATION

        if (signUpEmailField.value.trim() === "") {
            if (signUpErrorMsg) signUpErrorMsg.textContent = "Email is required";
            signUpEmailField.classList.add("border-red-500");
            return;
        }

        if (!emailPattern.test(signUpEmailField.value)) {
            if (signUpErrorMsg) signUpErrorMsg.textContent = "Please enter a valid email";
            signUpEmailField.classList.add("border-red-500");
            return;
        }
        
        // FIRST NAME VALIDATION
        
        if (firstName.value.trim() === "") {
            if (firstNameError) firstNameError.textContent = "First name is required";
            firstName.classList.add("border-red-500");
            return;
        }
        
        // LAST NAME VALIDATION
        
        if (lastName.value.trim() === "") {
            if (lastNameError) lastNameError.textContent = "Last name is required";
            lastName.classList.add("border-red-500");
            return;
        }
        
        // DATE OF BIRTH VALIDATION
        
        if (DateOfBirth.value.trim() === "") {
            if (DateOfBirthError) DateOfBirthError.textContent = "Date of birth is required";
            DateOfBirth.classList.add("border-red-500");
            return;
        }

        if (new Date(DateOfBirth.value) > new Date()) {
            if (DateOfBirthError) DateOfBirthError.textContent = "Date of birth cannot be in the future";
            DateOfBirth.classList.add("border-red-500");
            return;
        }
        
        // GENDER VALIDATION
        
        if (!gender.value) {
            if (genderError) genderError.textContent = "Please select your gender";
            gender.classList.add("border-red-500");
            return;
        }
        
        // PASSWORD VALIDATION
        
        if (createPassword.value.trim() === "") {
            if (createPasswordError) createPasswordError.textContent = "Password is required";
            createPassword.classList.add("border-red-500");
            return;
        }

        if (createPassword.value.length < 6) {
            if (createPasswordError) createPasswordError.textContent = "Password must be at least 6 characters";
            createPassword.classList.add("border-red-500");
            return;
        }
        
        // CONFIRM PASSWORD VALIDATION
        
        if (confirmPassword.value.trim() === "") {
            if (confirmPasswordError) confirmPasswordError.textContent = "Please confirm your password";
            confirmPassword.classList.add("border-red-500");
            return;
        }

        if (createPassword.value !== confirmPassword.value) {
            if (confirmPasswordError) confirmPasswordError.textContent = "Passwords do not match";
            confirmPassword.classList.add("border-red-500");
            return;
        }
        
        // LOADING STATE
        
        createAccountBtn.textContent = "Creating account...";
        createAccountBtn.disabled = true;
        
        // CREATE ACCOUNT
        
        setTimeout(async () => {
        const newUser = {
        fullName: `${firstName.value.trim()} ${lastName.value.trim()}`,
        username: firstName.value.trim().toLowerCase() + Math.floor(Math.random() * 1000),
        email: signUpEmailField.value.trim(),
        password: createPassword.value,
        profileImage: "../../images/Profile_img (0).jpg",
        gender: gender.value,
        dateOfBirth: DateOfBirth.value,
        followers: [],
        following: [],
        posts: 0,
        createdAt: Date.now()
    };

    try {
        const createdUser = await createAccount(newUser);
        newUser.id = createdUser.uid;
        delete newUser.password;
        await saveUserToFirestore(newUser);
        window.location.href = "../../index.html";

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            signUpErrorMsg.textContent = "Email already has an account.";
        } 
        else if (error.code === "auth/weak-password") {
            createPasswordError.textContent = "Password should be at least 6 characters.";
        } 
        else {
            console.error(error);
            signUpErrorMsg.textContent = "Unable to create account.";
        }

        createAccountBtn.textContent = "Create account";
        createAccountBtn.disabled = false;
    }
}, 1500);
});
}

// SCREEN NAVIGATION

function hideAllScreens() {
    if (loginScreen) loginScreen.classList.add("hidden");
    if (resetPasswordScreen) resetPasswordScreen.classList.add("hidden");
    if (otpScreen) otpScreen.classList.add("hidden");
    if (changePasswordScreen) changePasswordScreen.classList.add("hidden");
    if (createAccountScreen) createAccountScreen.classList.add("hidden");
}

// Forgot Password

if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", () => {
        hideAllScreens();
        if (resetPasswordScreen) resetPasswordScreen.classList.remove("hidden");
    });
}

// Remember Password

if (rememberPasswordBtn) {
    rememberPasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllScreens();
        if (loginScreen) loginScreen.classList.remove("hidden");
    });
}

// Reset Link

if (resetLinkForm) {
    resetLinkForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector("#email").value.trim();

        if (!emailPattern.test(email)) {
            alert("Enter a valid email address.");
            return;
        }

        const button = document.querySelector("#reset-link-btn");

        button.textContent = "Sending...";
        button.disabled = true;

        try {
            await resetPassword(email);

            alert("Password reset email sent. Check your inbox.");

            hideAllScreens();
            loginScreen.classList.remove("hidden");

        } catch (error) {

            switch (error.code) {

                case "auth/user-not-found":
                    alert("No account exists with this email.");
                    break;

                case "auth/invalid-email":
                    alert("Email address is invalid.");
                    break;

                default: alert("Unable to send reset email.");
            }

        } finally {
            button.textContent = "Send Reset Link";
            button.disabled = false;
        }
    });
}

// Create Account Navigation

if (createAccountNav) {
    createAccountNav.addEventListener("click", () => {
        hideAllScreens();
        if (createAccountScreen) createAccountScreen.classList.remove("hidden");
    });
}

// Login Navigation

if (loginNavBtn) {
    loginNavBtn.addEventListener("click", () => {
        hideAllScreens();
        if (loginScreen) loginScreen.classList.remove("hidden");
    });
}