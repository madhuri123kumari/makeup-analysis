/**
 * ==============================================================
 * AI Makeup Analysis Guide
 * Professional Backend Server
 *
 * Author  : Madhuri
 * Version : 5.0.0
 * ==============================================================
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const app = express();

/* ==========================================================
   Middleware
========================================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ==========================================================
   Static Files
========================================================== */

app.use(express.static(path.join(__dirname, "../")));

/* ==========================================================
   API Routes
========================================================== */

app.use("/api/auth", authRoutes);

/* ==========================================================
   Health Check
========================================================== */

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,
        service: "AI Makeup Analysis Guide",
        status: "healthy",
        timestamp: new Date().toISOString()

    });

});

/* ==========================================================
   Home Route
========================================================== */

app.get("/", (req, res) => {

    res.json({

        success: true,
        message: "AI Makeup Analysis Backend Running"

    });

});

/* ==========================================================
   404 Handler
========================================================== */

app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route Not Found"

    });

});

/* ==========================================================
   Global Error Handler
========================================================== */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,
        message: "Internal Server Error"

    });

});

/* ==========================================================
   Start Server
========================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("==========================================");
    console.log(" AI Makeup Analysis Guide Backend");
    console.log(" Server Started Successfully");
    console.log(` http://localhost:${PORT}`);
    console.log("==========================================");

});