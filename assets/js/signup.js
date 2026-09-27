/* =========================================================
   AI MAKEUP ANALYSIS GUIDE
   Professional Signup / Registration
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------------------------------
    // ELEMENTS
    // -------------------------------------------------------

    const signupForm = document.getElementById("signupForm");
    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    // Optional confirm-password field
    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    // Find signup button INSIDE the form
    const signupButton =
        signupForm?.querySelector("button[type='submit']") ||
        signupForm?.querySelector(".btn");


    // -------------------------------------------------------
    // CHECK FORM
    // -------------------------------------------------------

    if (!signupForm) {
        console.error("Signup form #signupForm was not found.");
        return;
    }


    // -------------------------------------------------------
    // PASSWORD SHOW / HIDE
    // -------------------------------------------------------

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", () => {

            const showingPassword =
                passwordInput.type === "text";

            passwordInput.type =
                showingPassword ? "password" : "text";

            togglePassword.classList.toggle(
                "fa-eye",
                showingPassword
            );

            togglePassword.classList.toggle(
                "fa-eye-slash",
                !showingPassword
            );

            togglePassword.setAttribute(
                "aria-label",
                showingPassword
                    ? "Show password"
                    : "Hide password"
            );
        });
    }


    // -------------------------------------------------------
    // EMAIL VALIDATION
    // -------------------------------------------------------

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    // -------------------------------------------------------
    // PASSWORD VALIDATION
    // -------------------------------------------------------

    function validatePassword(password) {

        if (password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        return null;
    }


    // -------------------------------------------------------
    // BUTTON STATE
    // -------------------------------------------------------

    function setLoading(isLoading) {

        if (!signupButton) return;

        signupButton.disabled = isLoading;

        if (isLoading) {

            signupButton.dataset.originalText =
                signupButton.innerHTML;

            signupButton.innerHTML =
                `<i class="fas fa-spinner fa-spin"></i>
                 Creating Account...`;

        } else {

            signupButton.innerHTML =
                signupButton.dataset.originalText ||
                "Create Account";
        }
    }


    // -------------------------------------------------------
    // SAFE JSON RESPONSE
    // -------------------------------------------------------

    async function getResponseData(response) {

        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {

            return await response.json();
        }

        const text = await response.text();

        return {
            success: false,
            message:
                text ||
                `Server returned HTTP ${response.status}`
        };
    }


    // -------------------------------------------------------
    // SIGNUP
    // -------------------------------------------------------

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // ---------------------------------------------------
        // GET VALUES
        // ---------------------------------------------------

        const fullName =
            fullNameInput?.value.trim() || "";

        const email =
            emailInput?.value.trim().toLowerCase() || "";

        const password =
            passwordInput?.value || "";

        const confirmPassword =
            confirmPasswordInput?.value || "";


        // ---------------------------------------------------
        // BASIC VALIDATION
        // ---------------------------------------------------

        if (!fullName) {

            alert("Please enter your full name.");
            fullNameInput?.focus();
            return;
        }


        if (fullName.length < 2) {

            alert("Please enter a valid full name.");
            fullNameInput?.focus();
            return;
        }


        if (!email) {

            alert("Please enter your email address.");
            emailInput?.focus();
            return;
        }


        if (!isValidEmail(email)) {

            alert("Please enter a valid email address.");
            emailInput?.focus();
            return;
        }


        if (!password) {

            alert("Please enter a password.");
            passwordInput?.focus();
            return;
        }


        const passwordError =
            validatePassword(password);

        if (passwordError) {

            alert(passwordError);
            passwordInput?.focus();
            return;
        }


        // ---------------------------------------------------
        // CONFIRM PASSWORD
        // ---------------------------------------------------

        if (confirmPasswordInput) {

            if (!confirmPassword) {

                alert("Please confirm your password.");
                confirmPasswordInput.focus();
                return;
            }

            if (password !== confirmPassword) {

                alert("Passwords do not match.");
                confirmPasswordInput.focus();
                return;
            }
        }


        // ---------------------------------------------------
        // PREPARE DATA
        // ---------------------------------------------------

        const userData = {
            fullName: fullName,
            email: email,
            password: password
        };


        setLoading(true);


        try {

            /*
             * IMPORTANT:
             *
             * Use the Flask backend directly.
             *
             * Your Flask server is running on:
             * http://127.0.0.1:5000
             */

            const API_BASE_URL =
                "http://127.0.0.1:5000";


            const response = await fetch(
                `${API_BASE_URL}/api/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(userData)
                }
            );


            // ------------------------------------------------
            // READ RESPONSE
            // ------------------------------------------------

            const data =
                await getResponseData(response);


            console.log(
                "Signup response:",
                response.status,
                data
            );


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            if (
                response.ok &&
                data.success === true
            ) {

                // Save token if backend provides one
                if (data.token) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );
                }


                // Save user information
                if (data.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );
                }


                // Save login state
                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                alert(
                    "🎉 Account created successfully!"
                );


                // Redirect
                window.location.href =
                    "dashboard.html";

                return;
            }


            // ------------------------------------------------
            // SERVER ERROR
            // ------------------------------------------------

            alert(
                data.message ||
                "Unable to create your account."
            );


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


            // ------------------------------------------------
            // CONNECTION ERROR
            // ------------------------------------------------

            if (
                error instanceof TypeError &&
                error.message.toLowerCase().includes("fetch")
            ) {

                alert(
                    "Unable to connect to the Flask server.\n\n" +
                    "Make sure python app.py is running on port 5000."
                );

            } else {

                alert(
                    "Something went wrong while creating your account. " +
                    "Please try again."
                );
            }

        } finally {

            setLoading(false);
        }

    });

});