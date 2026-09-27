/**
 * ==============================================================
 * AI Makeup Analysis Guide
 * Authentication Routes
 *
 * Author  : Madhuri
 * Version : 1.0.0
 * ==============================================================
 */

const express = require("express");

const router = express.Router();

/* ============================================================
   Health Check
============================================================ */

router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Authentication API",
        status: "healthy"
    });
});

/* ============================================================
   Login
============================================================ */

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // TODO:
    // Validate user
    // Compare password
    // Generate JWT Token

    res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
            email
        }
    });

});

/* ============================================================
   Signup
============================================================ */

router.post("/signup", (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    // TODO:
    // Save user into MongoDB

    res.status(201).json({
        success: true,
        message: "Account created successfully.",
        user: {
            name,
            email
        }
    });

});

/* ============================================================
   Logout
============================================================ */

router.post("/logout", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Logout successful."
    });

});

/* ============================================================
   Current User
============================================================ */

router.get("/me", (req, res) => {

    res.status(200).json({
        success: true,
        user: {
            id: 1,
            name: "Madhuri",
            email: "madhuri@example.com"
        }
    });

});

/* ============================================================
   Export
============================================================ */

module.exports = router;