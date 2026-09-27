/*
==============================================================
AI MAKEUP ANALYSIS GUIDE
Professional Backend Server
Version : 6.0.0
==============================================================
*/

"use strict";

/* ============================================================
   ENVIRONMENT
============================================================ */

require("dotenv").config();

/* ============================================================
   CORE MODULES
============================================================ */

const express = require("express");
const cors = require("cors");
const dns = require("dns");

/* ============================================================
   DATABASE
============================================================ */

const connectDB = require("./config/db");

/* ============================================================
   ROUTES
============================================================ */

const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

/* ============================================================
   APPLICATION
============================================================ */

const app = express();

/* ============================================================
   CONFIGURATION
============================================================ */

const PORT = Number(process.env.PORT) || 5000;

const AI_SERVER_URL =
    process.env.AI_SERVER_URL || "http://127.0.0.1:5001";

/* ============================================================
   DNS CONFIGURATION

   Used for reliable external hostname resolution.
============================================================ */

try {
    dns.setServers([
        "1.1.1.1",
        "8.8.8.8"
    ]);
} catch (error) {
    console.warn(
        "DNS configuration warning:",
        error.message
    );
}

/* ============================================================
   DATABASE CONNECTION
============================================================ */

connectDB()
    .then(() => {
        console.log("✅ MongoDB connection initialized");
    })
    .catch((error) => {
        console.error(
            "❌ MongoDB connection failed:",
            error.message
        );
    });

/* ============================================================
   CORS
============================================================ */

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

/* ============================================================
   BODY PARSERS
============================================================ */

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);

/* ============================================================
   REQUEST LOGGING
============================================================ */

app.use((req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        console.log(
            `${req.method} ${req.originalUrl} ` +
            `${res.statusCode} - ${duration}ms`
        );

    });

    next();
});

/* ============================================================
   ROOT API
============================================================ */

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        application: "AI Makeup Analysis Guide",
        backend: "Node.js",
        version: "6.0.0",
        status: "running",
        aiServer: AI_SERVER_URL
    });

});

/* ============================================================
   NODE BACKEND HEALTH
============================================================ */

app.get("/health", (req, res) => {

    res.status(200).json({
        success: true,
        service: "Node.js Backend",
        status: "healthy",
        version: "6.0.0",
        port: PORT
    });

});

/* ============================================================
   AI SERVER CONFIGURATION CHECK
============================================================

   This endpoint DOES NOT perform fake analysis.

   It only checks whether the real Python AI service is
   configured and reachable through the analysis layer.

============================================================ */

app.get("/api/analysis/config", (req, res) => {

    res.status(200).json({
        success: true,
        service: "AI Makeup Analysis",
        aiServer: AI_SERVER_URL,
        mode: "real-ai",
        demoMode: false
    });

});

/* ============================================================
   AUTHENTICATION API
============================================================ */

app.use(
    "/api/auth",
    authRoutes
);

/* ============================================================
   REAL AI ANALYSIS API
============================================================

   IMPORTANT:

   The actual image-analysis logic belongs to:

       routes/analysisRoutes.js

   That route must forward the uploaded image to:

       Python AI Server
       http://127.0.0.1:5001

   The Python service performs the actual AI processing using
   InsightFace and the project's analysis modules.

============================================================ */

app.use(
    "/api/analysis",
    analysisRoutes
);

/* ============================================================
   404 HANDLER
============================================================ */

app.use((req, res) => {

    res.status(404).json({
        success: false,
        error: "ROUTE_NOT_FOUND",
        message: "The requested API route does not exist.",
        path: req.originalUrl,
        method: req.method
    });

});

/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */

app.use((err, req, res, next) => {

    console.error(
        "=================================================="
    );

    console.error(
        "BACKEND ERROR"
    );

    console.error(err);

    console.error(
        "=================================================="
    );

    if (res.headersSent) {
        return next(err);
    }

    res.status(
        err.status || 500
    ).json({

        success: false,

        error:
            err.code ||
            "INTERNAL_SERVER_ERROR",

        message:
            err.message ||
            "An unexpected server error occurred."

    });

});

/* ============================================================
   SERVER START
============================================================ */

const server = app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "=================================================="
        );
        console.log(
            "        AI MAKEUP ANALYSIS GUIDE"
        );
        console.log(
            "        PROFESSIONAL BACKEND"
        );
        console.log(
            "=================================================="
        );

        console.log(
            `Node Server : http://localhost:${PORT}`
        );

        console.log(
            `Health      : http://localhost:${PORT}/health`
        );

        console.log(
            `Auth API    : http://localhost:${PORT}/api/auth`
        );

        console.log(
            `Analysis API: http://localhost:${PORT}/api/analysis`
        );

        console.log(
            `Python AI   : ${AI_SERVER_URL}`
        );

        console.log(
            "AI Mode     : REAL AI"
        );

        console.log(
            "Demo Mode   : DISABLED"
        );

        console.log(
            "=================================================="
        );

        console.log(
            "✅ Node.js backend started successfully."
        );

        console.log("");

    }
);

/* ============================================================
   GRACEFUL SHUTDOWN
============================================================ */

const shutdown = (signal) => {

    console.log(
        `\n${signal} received. Shutting down server...`
    );

    server.close(() => {

        console.log(
            "✅ HTTP server closed."
        );

        process.exit(0);

    });

};

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);

process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);

/* ============================================================
   UNHANDLED ERRORS
============================================================ */

process.on(
    "unhandledRejection",
    (reason) => {

        console.error(
            "Unhandled Promise Rejection:",
            reason
        );

    }
);

process.on(
    "uncaughtException",
    (error) => {

        console.error(
            "Uncaught Exception:",
            error
        );

    }
);