const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();

/*
==============================================================
AI MAKEUP ANALYSIS GUIDE
Node.js → Python AI Gateway
==============================================================
*/

const AI_SERVER_URL = "http://127.0.0.1:5001/api/analysis";

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are supported."
                )
            );
        }

        callback(null, true);
    }
});


/*
==============================================================
AI SERVER HEALTH
GET /api/analysis/health
==============================================================
*/

router.get("/health", async (req, res) => {

    try {

        const response = await axios.get(
            `${AI_SERVER_URL}/health`,
            {
                timeout: 5000
            }
        );

        return res.status(200).json({
            success: true,
            node_server: "healthy",
            ai_server: response.data
        });

    } catch (error) {

        console.error(
            "[AI HEALTH ERROR]",
            error.code,
            error.message
        );

        return res.status(503).json({
            success: false,
            node_server: "healthy",
            ai_server: "unavailable",
            message: "Python AI server is not reachable.",
            error_code: error.code || "AI_SERVER_ERROR"
        });
    }
});


/*
==============================================================
REAL AI ANALYSIS
POST /api/analysis/
==============================================================
*/

router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        try {

            /*
            --------------------------------------------------
            1. Validate image
            --------------------------------------------------
            */

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message: "Please upload a facial image."
                });
            }


            /*
            --------------------------------------------------
            2. Create multipart form
            --------------------------------------------------
            */

            const form = new FormData();

            form.append(
                "image",
                req.file.buffer,
                {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                    knownLength: req.file.size
                }
            );


            /*
            --------------------------------------------------
            3. Send image to Python AI
            --------------------------------------------------
            */

            console.log(
                `[AI] Sending ${req.file.originalname} to Python AI...`
            );

            const aiResponse = await axios.post(
                `${AI_SERVER_URL}/`,
                form,
                {
                    headers: {
                        ...form.getHeaders()
                    },

                    timeout: 180000,

                    maxBodyLength: Infinity,

                    maxContentLength: Infinity,

                    validateStatus: () => true
                }
            );


            /*
            --------------------------------------------------
            4. Python response
            --------------------------------------------------
            */

            console.log(
                `[AI] Python AI HTTP ${aiResponse.status}`
            );


            if (
                aiResponse.status < 200 ||
                aiResponse.status >= 300
            ) {

                console.error(
                    "[AI ERROR RESPONSE]",
                    aiResponse.data
                );

                return res.status(502).json({
                    success: false,
                    message: "Python AI analysis failed.",
                    ai_server_status: aiResponse.status,
                    ai_server_response: aiResponse.data
                });
            }


            /*
            --------------------------------------------------
            5. Validate AI JSON
            --------------------------------------------------
            */

            if (
                !aiResponse.data ||
                typeof aiResponse.data !== "object"
            ) {

                return res.status(502).json({
                    success: false,
                    message: "Python AI returned an invalid response."
                });
            }


            /*
            --------------------------------------------------
            6. Return REAL AI result to frontend
            --------------------------------------------------
            */

            return res.status(200).json(
                aiResponse.data
            );

        } catch (error) {

            /*
            --------------------------------------------------
            Multer errors
            --------------------------------------------------
            */

            if (error instanceof multer.MulterError) {

                if (error.code === "LIMIT_FILE_SIZE") {

                    return res.status(413).json({
                        success: false,
                        message:
                            "Image is too large. Maximum size is 10 MB."
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }


            /*
            --------------------------------------------------
            Image validation errors
            --------------------------------------------------
            */

            if (
                error.message &&
                error.message.includes("Only JPG")
            ) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }


            /*
            --------------------------------------------------
            Python connection errors
            --------------------------------------------------
            */

            if (
                error.code === "ECONNREFUSED" ||
                error.code === "ECONNRESET" ||
                error.code === "ETIMEDOUT" ||
                error.code === "ENOTFOUND"
            ) {

                console.error(
                    "[PYTHON AI CONNECTION ERROR]",
                    error.code,
                    error.message
                );

                return res.status(503).json({
                    success: false,
                    message:
                        "Python AI server is not available.",
                    ai_server:
                        `${AI_SERVER_URL}/`,
                    error_code:
                        error.code
                });
            }


            /*
            --------------------------------------------------
            Unexpected error
            --------------------------------------------------
            */

            console.error(
                "[ANALYSIS ERROR]",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unexpected error during AI analysis.",
                error:
                    error.message
            });
        }
    }
);


module.exports = router;