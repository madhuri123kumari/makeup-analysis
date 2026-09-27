// ======================================================
// AI Makeup Analysis Guide
// Professional Login JavaScript
// ======================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------
    // Elements
    // --------------------------------------------------

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (!loginForm) {
        console.error("loginForm not found.");
        return;
    }

    // --------------------------------------------------
    // Password Show / Hide
    // --------------------------------------------------

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", () => {

            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            if (isHidden) {
                togglePassword.classList.remove("fa-eye");
                togglePassword.classList.add("fa-eye-slash");
                togglePassword.setAttribute("aria-label", "Hide password");
            } else {
                togglePassword.classList.remove("fa-eye-slash");
                togglePassword.classList.add("fa-eye");
                togglePassword.setAttribute("aria-label", "Show password");
            }

        });

    }

    // --------------------------------------------------
    // Login Form
    // --------------------------------------------------

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // ------------------------------------------------
        // Validation
        // ------------------------------------------------

        if (!email) {
            alert("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!password) {
            alert("Please enter your password.");
            passwordInput.focus();
            return;
        }

        // Basic email validation
        const emailPattern =
            /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        // ------------------------------------------------
        // Submit Button
        // ------------------------------------------------

        const submitButton =
            loginForm.querySelector('button[type="submit"]');

        const originalButtonText =
            submitButton ? submitButton.textContent : "Login";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Logging in...";
        }

        // ------------------------------------------------
        // Login Data
        // ------------------------------------------------

        const loginData = {
            email: email,
            password: password
        };

        try {

            // IMPORTANT:
            // This endpoint must exist in Flask.
            const response = await fetch(
                "http://127.0.0.1:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(loginData)
                }
            );

            // ------------------------------------------------
            // Safely read response
            // ------------------------------------------------

            const contentType =
                response.headers.get("content-type") || "";

            let data;

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();

                data = {
                    success: false,
                    message: text || "Unexpected server response."
                };
            }

            console.log("Login response:", data);

            // ------------------------------------------------
            // Successful Login
            // ------------------------------------------------

            if (response.ok && data.success) {

                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                if (data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );
                }

                alert("Login successful! Welcome back 🎉");

                window.location.href = "dashboard.html";

                return;
            }

            // ------------------------------------------------
            // Login Failed
            // ------------------------------------------------

            alert(
                data.message ||
                "Invalid email or password."
            );

        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Unable to connect to the server. " +
                "Please make sure the Flask server is running."
            );

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }

        }

    });

});