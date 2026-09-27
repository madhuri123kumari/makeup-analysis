"use strict";

/*
 * ==========================================================
 * AI MAKEUP ANALYSIS GUIDE
 * Professional Dashboard Controller
 * ==========================================================
 *
 * REAL AI FRONTEND CONTROLLER
 *
 * Backend:
 *
 * POST /api/analysis/
 * GET  /api/analysis/health
 * POST /api/analysis/makeup-visual
 *
 * This JavaScript file DOES NOT create fake AI predictions.
 *
 * Skin type, acne, face shape, eye analysis, lip analysis,
 * beauty score, recommendations and products must come from
 * the backend AI pipeline.
 *
 * Frontend responsibilities:
 *
 * 1. Upload image
 * 2. Browse image
 * 3. Drag & Drop
 * 4. Live camera
 * 5. Preview image
 * 6. Send image to Flask
 * 7. Display real AI response
 * 8. Display recommendations
 * 9. Display products
 * 10. Dark / Light mode
 * 11. Notifications
 * 12. Makeup visualization
 * 13. Report / Save / Share
 *
 * ==========================================================
 */

(() => {

    "use strict";


    /* ======================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = Object.freeze({

        /*
         * Flask backend.
         *
         * Keep this pointed to the Flask server.
         */
        API_BASE_URL:
            window.MAKEUP_API_BASE_URL ||
            "http://127.0.0.1:5000/api/analysis/",


        /*
         * Maximum uploaded image size:
         * 10 MB
         */
        MAX_IMAGE_SIZE:
            10 * 1024 * 1024,


        /*
         * Supported image types.
         */
        ALLOWED_TYPES:
            Object.freeze([
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/bmp"
            ]),


        /*
         * Theme storage key.
         */
        THEME_KEY:
            "makeup-dashboard-theme",


        /*
         * Notification storage.
         */
        NOTIFICATION_KEY:
            "makeup-dashboard-notifications",


        /*
         * Analysis history storage.
         */
        HISTORY_KEY:
            "makeup-dashboard-history",


        /*
         * Maximum history records.
         */
        MAX_HISTORY:
            20,


        /*
         * Backend request timeout.
         */
        REQUEST_TIMEOUT:
            120000

    });


    /* ======================================================
       APPLICATION STATE
    ====================================================== */

    const state = {

        selectedFile:
            null,

        previewURL:
            null,

        analysisResult:
            null,

        isAnalyzing:
            false,

        beautyChart:
            null,

        cameraStream:
            null,

        cameraModal:
            null,

        initialized:
            false,

        makeupFile:
            null,

        makeupPreviewURL:
            null,

        isGeneratingMakeup:
            false,

        notificationCount:
            0

    };


    /* ======================================================
       SHORT DOM HELPER
    ====================================================== */

    const $ = (id) =>
        document.getElementById(id);


    /* ======================================================
       DOM REFERENCES
    ====================================================== */

    const els = {

        /*
         * Upload
         */
        uploadBox:
            $("uploadBox") ||
            $("dropArea"),

        dropArea:
            $("dropArea"),

        browseBtn:
            $("browseBtn"),

        cameraBtn:
            $("cameraBtn"),

        imageInput:
            $("imageInput"),

        previewImage:
            $("previewImage"),

        analyzeBtn:
            $("analyzeBtn"),

        startAnalysisBtn:
            $("startAnalysisBtn"),

        removeImage:
            $("removeImage"),


        /*
         * Analysis result
         */
        skinType:
            $("skinType"),

        skinTone:
            $("skinTone"),

        undertone:
            $("undertone"),

        faceShape:
            $("faceShape"),

        acneLevel:
            $("acneLevel") ||
            $("acneStatus"),

        darkCircles:
            $("darkCircles") ||
            $("darkCircle"),

        eyeShape:
            $("eyeShape"),

        eyeColor:
            $("eyeColor"),

        lipShape:
            $("lipShape"),

        lipColor:
            $("lipColor"),

        confidence:
            $("confidence"),

        aiMethod:
            $("aiMethod"),


        /*
         * Beauty score
         */
        beautyScore:
            $("beautyScore"),

        dashboardBeautyScore:
            $("dashboardBeautyScore"),

        dashboardSkinType:
            $("dashboardSkinType"),

        totalAnalysis:
            $("totalAnalysis"),


        /*
         * Processing
         */
        progressFill:
            $("progressFill"),

        progressText:
            $("progressText"),

        progressCircle:
            $("progressCircle"),

        processingStatus:
            $("processingStatus"),


        /*
         * Beauty breakdown
         */
        beautyProgressScore:
            $("beautyProgressScore"),

        beautyProgressGrade:
            $("beautyProgressGrade"),

        beautySkinScore:
            $("beautySkinScore"),

        beautyEyesScore:
            $("beautyEyesScore"),

        beautyFaceScore:
            $("beautyFaceScore"),

        beautyLipsScore:
            $("beautyLipsScore"),

        beautyChart:
            $("beautyChart"),


        /*
         * Makeup visualization
         */
        makeupSourceImage:
            $("makeupSourceImage"),

        makeupInputPreview:
            $("makeupInputPreview"),

        makeupPhotoInput:
            $("makeupPhotoInput"),

        makeupUploadArea:
            $("makeupUploadArea"),

        makeupPreviewContainer:
            $("makeupPreviewContainer"),

        makeupGeneratedImage:
            $("aiMakeupImage") ||
            $("makeupGeneratedImage"),

        makeupResultPlaceholder:
            $("makeupResultPlaceholder"),

        makeupConsent:
            $("makeupConsent"),

        generateMakeupBtn:
            $("generateMakeupBtn"),

        makeupVisualStatus:
            $("makeupVisualStatus") ||
            $("makeupGenerationStatus"),

        makeupRecommendationSummary:
            $("makeupRecommendationSummary"),


        /*
         * Dashboard
         */
        search:
            $("dashboardSearch"),

        notificationBtn:
            $("notificationBtn") ||
            document.querySelector(
                '.icon-btn[title="Notifications"]'
            ) ||
            document.querySelector(
                '[aria-label*="notification" i]'
            ),

        darkModeBtn:
            $("darkModeBtn") ||
            document.querySelector(
                '.icon-btn[title="Dark Mode"]'
            ) ||
            document.querySelector(
                '[aria-label*="dark mode" i]'
            ),

        resetBtn:
            $("resetBtn") ||
            $("resetButton"),

        backendStatus:
            $("backendStatus"),

        history:
            $("analysisHistoryList") ||
            $("historyList"),


        /*
         * Reports
         */
        reportBtn:
            $("downloadReport") ||
            $("reportBtn") ||
            $("downloadBtn"),

        saveBtn:
            $("saveReport") ||
            $("saveBtn"),

        shareBtn:
            $("shareReport") ||
            $("shareBtn")

    };


    /* ======================================================
       PRODUCT CARD IDs
    ====================================================== */

    const PRODUCT_CARD_IDS = Object.freeze({

        cleanser: [
            "product-cleanser",
            "cleanser"
        ],

        toner: [
            "product-toner",
            "toner"
        ],

        moisturizer: [
            "product-moisturizer",
            "moisturizer"
        ],

        sunscreen: [
            "product-sunscreen",
            "sunscreen"
        ],

        primer: [
            "product-primer",
            "primer"
        ],

        foundation: [
            "product-foundation",
            "foundation"
        ],

        concealer: [
            "product-concealer",
            "concealer"
        ],

        blush: [
            "product-blush",
            "blush"
        ],

        contour: [
            "product-contour",
            "contour"
        ],

        highlighter: [
            "product-highlighter",
            "highlighter"
        ],

        eyeshadow: [
            "product-eyeshadow",
            "eyeshadow"
        ],

        eyeliner: [
            "product-eyeliner",
            "eyeliner"
        ],

        mascara: [
            "product-mascara",
            "mascara"
        ],

        lipstick: [
            "product-lipstick",
            "lipstick"
        ],

        setting_spray: [
            "product-setting_spray",
            "product-setting-spray",
            "setting_spray"
        ]

    });


    /* ======================================================
       LOCAL PRODUCT IMAGE PATHS
    ====================================================== */

    const LOCAL_PRODUCT_IMAGES =
        Object.freeze({

            cleanser:
                "assets/images/products/cleanser.jpg",

            toner:
                "assets/images/products/toner.jpg",

            moisturizer:
                "assets/images/products/moisturizer.jpg",

            sunscreen:
                "assets/images/products/sunscreen.jpg",

            primer:
                "assets/images/products/primer.jpg",

            foundation:
                "assets/images/products/foundation.jpg",

            concealer:
                "assets/images/products/concealer.jpg",

            blush:
                "assets/images/products/blush.jpg",

            contour:
                "assets/images/products/contour.jpg",

            highlighter:
                "assets/images/products/highlighter.jpg",

            eyeshadow:
                "assets/images/products/eyeshadow.jpg",

            eyeliner:
                "assets/images/products/eyeliner.jpg",

            mascara:
                "assets/images/products/mascara.jpg",

            lipstick:
                "assets/images/products/lipstick.jpg",

            setting_spray:
                "assets/images/products/setting_spray.jpg"

        });


    /*
     * Verified product photos for the exact products that
     * are already present in the current catalog/UI.
     *
     * These are NOT generated images.
     * The URL is used only when the backend returns the
     * exact matching product name.
     */
    const VERIFIED_PRODUCT_IMAGES_BY_NAME =
        Object.freeze({

            "Maybelline Fit Me Matte + Poreless":
                "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w%3A540/tyINCh2d_H-940513_1.jpg",

            "L.A. Girl Pro Conceal HD":
                "https://hokmakeup.com/cdn/shop/files/81555969721_0_3689e743-4642-4fa0-8440-6d1cbffee155.png?v=1781871282&width=1920",

            "LA Girl Pro Conceal HD":
                "https://hokmakeup.com/cdn/shop/files/81555969721_0_3689e743-4642-4fa0-8440-6d1cbffee155.png?v=1781871282&width=1920",

            "MAC Velvet Teddy":
                "https://allurify.pk/cdn/shop/files/Velvet_Teddy.webp?v=1759580428&width=1024",

            "La Roche Posay SPF 50+":
                "https://finalchoice.com.pk/cdn/shop/files/Websiteupload-Recovered_2cd445a4-20ca-442f-b92e-436da57bb83a.jpg?v=1743069922",

            "La Roche-Posay Anthelios Invisible Fluid SPF 50+":
                "https://finalchoice.com.pk/cdn/shop/files/Websiteupload-Recovered_2cd445a4-20ca-442f-b92e-436da57bb83a.jpg?v=1743069922",

            "CeraVe Moisturizing Lotion":
                "https://www.lojaglamourosa.com/resources/medias/shop/products/thumbnails/shop-image-large/shop-cm-05297-02-moisturizing-lotion-cerave---473ml--1.jpg",

            "CeraVe Moisturizing Cream":
                "https://www.lojaglamourosa.com/resources/medias/shop/products/thumbnails/shop-image-large/shop-cm-05297-02-moisturizing-lotion-cerave---473ml--1.jpg",

            "MAC Fix+ Setting Spray":
                "https://freshbeautyco.com.au/cdn/shop/files/34056183002.jpg?v=1725355083",

            "MAC Fix+ Alcohol-Free Setting Spray":
                "https://freshbeautyco.com.au/cdn/shop/files/34056183002.jpg?v=1725355083"

        });


    /* ======================================================
       APPLICATION START
    ====================================================== */

    function start() {

        if (state.initialized) {
            return;
        }


        state.initialized =
            true;


        /*
         * Add only runtime styles required
         * by camera / notifications.
         */
        ensureRuntimeStyles();


        /*
         * Initialize every dashboard subsystem.
         */
        initializeUpload();

        initializeAnalysis();

        initializeMakeupVisual();

        initializeTheme();

        initializeSearch();

        initializeNotifications();

        initializeReset();

        initializeNavigation();

        initializeReportActions();

        initializeProductCards();

        initializeChart();

        checkBackendHealth();


        /*
         * Update makeup button based on
         * actual analysis state.
         */
        updateMakeupButton();


        updateProcessing(
            0,
            "Ready",
            "Upload a clear face image to start real AI analysis."
        );

    }


    /* ======================================================
       UPLOAD INITIALIZATION
    ====================================================== */

    function initializeUpload() {

        /*
         * File input
         */
        if (els.imageInput) {

            els.imageInput.addEventListener(
                "change",
                (event) => {

                    const file =
                        event.target.files?.[0];

                    if (file) {

                        handleImage(file);

                    }

                }
            );

        }


        /*
         * Browse button
         */
        if (els.browseBtn) {

            els.browseBtn.type =
                "button";


            els.browseBtn.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    if (!els.imageInput) {

                        showToast(
                            "Image upload control is unavailable.",
                            "error"
                        );

                        return;
                    }


                    try {

                        /*
                         * Modern browser.
                         */
                        if (
                            typeof els.imageInput.showPicker ===
                            "function"
                        ) {

                            els.imageInput.showPicker();

                        } else {

                            els.imageInput.click();

                        }

                    } catch (error) {

                        console.warn(
                            "Native picker fallback:",
                            error
                        );

                        els.imageInput.click();

                    }

                }
            );

        }


        /*
         * Camera
         */
        if (els.cameraBtn) {

            els.cameraBtn.type =
                "button";


            els.cameraBtn.addEventListener(
                "click",
                openLiveCamera
            );

        }


        /*
         * Drag & Drop targets.
         *
         * Both uploadBox and dropArea
         * are supported.
         */
        const dropTargets = [
            els.uploadBox,
            els.dropArea
        ].filter(Boolean);


        const uniqueTargets =
            [
                ...new Set(
                    dropTargets
                )
            ];


        uniqueTargets.forEach(
            (target) => {


                /*
                 * Drag enter / over
                 */
                [
                    "dragenter",
                    "dragover"
                ].forEach(
                    (eventName) => {

                        target.addEventListener(
                            eventName,
                            (event) => {

                                event.preventDefault();

                                event.stopPropagation();

                                target.classList.add(
                                    "dragover",
                                    "dragging"
                                );

                            }
                        );

                    }
                );


                /*
                 * Drag leave / drop
                 */
                [
                    "dragleave",
                    "drop"
                ].forEach(
                    (eventName) => {

                        target.addEventListener(
                            eventName,
                            (event) => {

                                event.preventDefault();

                                event.stopPropagation();

                                target.classList.remove(
                                    "dragover",
                                    "dragging"
                                );

                            }
                        );

                    }
                );


                /*
                 * Actual dropped file
                 */
                target.addEventListener(
                    "drop",
                    (event) => {

                        const file =
                            event
                                .dataTransfer
                                ?.files
                                ?.[0];


                        if (file) {

                            handleImage(file);

                        }

                    }
                );

            }
        );

    }


    /* ======================================================
       IMAGE PROCESSING
    ====================================================== */

    function handleImage(file) {

        if (!file) {
            return;
        }


        const fileType =
            String(
                file.type || ""
            ).toLowerCase();


        /*
         * Validate image MIME type.
         */
        if (
            !CONFIG.ALLOWED_TYPES.includes(
                fileType
            )
        ) {

            resetFileInput();


            showToast(
                "Please select a JPG, PNG, WEBP or BMP image.",
                "error"
            );


            return;
        }


        /*
         * Validate image size.
         */
        if (
            file.size >
            CONFIG.MAX_IMAGE_SIZE
        ) {

            resetFileInput();


            showToast(
                "Image size must be less than 10 MB.",
                "error"
            );


            return;
        }


        /*
         * IMPORTANT:
         *
         * Clear the previous analysis BEFORE
         * storing the new file.
         *
         * resetResults() clears selectedFile and
         * hides the preview. In the old flow it
         * was called AFTER setImage(), which
         * immediately removed the newly selected
         * image and disabled Analyze Face.
         */
        resetResults(false);


        /*
         * Save the newly selected file only
         * after the old state has been cleared.
         */
        state.selectedFile =
            file;


        /*
         * Create a fresh object URL for the
         * selected image.
         */
        state.previewURL =
            URL.createObjectURL(
                file
            );


        /*
         * Main preview.
         */
        setImage(
            els.previewImage,
            state.previewURL,
            "Uploaded face image"
        );


        /*
         * Makeup source image.
         */
        setImage(
            els.makeupSourceImage,
            state.previewURL,
            "Makeup source image"
        );


        /*
         * Makeup input preview.
         */
        setImage(
            els.makeupInputPreview,
            state.previewURL,
            "Makeup input preview"
        );


        /*
         * Update upload UI.
         */
        if (els.uploadBox) {

            els.uploadBox.classList.add(
                "has-image"
            );

        }


        /*
         * Enable analysis.
         */
        if (els.analyzeBtn) {

            els.analyzeBtn.disabled =
                false;

        }


        /*
         * Processing status.
         */
        updateProcessing(
            0,
            "Image Ready",
            "Your image is ready for real AI analysis."
        );


        /*
         * Makeup visualization requires
         * a valid analyzed image.
         */
        updateMakeupButton();


        /*
         * Notification.
         */
        showToast(
            "Image uploaded successfully.",
            "success"
        );

    }


    /* ======================================================
       SET IMAGE
    ====================================================== */

    function setImage(
        image,
        src,
        alt
    ) {

        if (!image || !src) {

            console.error(
                "Image preview could not be initialized: missing element or source."
            );

            return;

        }


        /*
         * Remove the HTML hidden state and
         * any inline hiding left by resetResults().
         */
        image.hidden =
            false;

        image.removeAttribute(
            "hidden"
        );


        /*
         * Set the real object/blob URL.
         */
        image.src =
            src;


        image.alt =
            alt ||
            "Uploaded image";


        /*
         * Force the preview to be visible.
         */
        image.style.display =
            "block";

        image.style.visibility =
            "visible";

        image.style.opacity =
            "1";

        image.style.width =
            "100%";

        image.style.height =
            "100%";

        image.style.maxWidth =
            "100%";

        image.style.maxHeight =
            "100%";

        image.style.objectFit =
            "contain";


        /*
         * Make the parent preview state
         * aware that an actual image exists.
         */
        const previewContainer =
            image.closest(
                ".preview-box, .preview-container, .live-preview, .image-preview"
            );


        if (previewContainer) {

            previewContainer.classList.add(
                "has-image"
            );

            previewContainer.style.overflow =
                "hidden";

        }


        /*
         * Confirm that the browser really
         * decoded the selected image.
         */
        image.onload =
            () => {

                image.style.display =
                    "block";

                image.style.visibility =
                    "visible";

                image.style.opacity =
                    "1";

                console.log(
                    "REAL IMAGE PREVIEW LOADED:",
                    {
                        width:
                            image.naturalWidth,

                        height:
                            image.naturalHeight
                    }
                );

            };


        /*
         * Give the user a useful error if
         * the browser cannot decode the file.
         */
        image.onerror =
            () => {

                console.error(
                    "REAL IMAGE PREVIEW FAILED:",
                    src
                );

                showToast(
                    "The selected image could not be displayed. Please choose another JPG, PNG or WEBP image.",
                    "error"
                );

            };

    }


    /* ======================================================
       RESET FILE INPUT
    ====================================================== */

    function resetFileInput() {

        if (els.imageInput) {

            els.imageInput.value =
                "";

        }


        state.selectedFile =
            null;


        state.analysisResult =
            null;


        updateMakeupButton();

    }


    /* ======================================================
       REVOKE PREVIEW
    ====================================================== */

    function revokePreviewURL() {

        if (state.previewURL) {

            URL.revokeObjectURL(
                state.previewURL
            );


            state.previewURL =
                null;

        }

    }


    /* ======================================================
       ANALYSIS INITIALIZATION
    ====================================================== */

    function initializeAnalysis() {

        if (!els.analyzeBtn) {
            return;
        }


        /*
         * Disabled until an image is selected.
         */
        els.analyzeBtn.disabled =
            !state.selectedFile;


        els.analyzeBtn.type =
            "button";


        els.analyzeBtn.addEventListener(
            "click",
            analyzeImage
        );


        /*
         * Start Analysis button.
         */
        if (els.startAnalysisBtn) {

            els.startAnalysisBtn.type =
                "button";


            els.startAnalysisBtn.addEventListener(
                "click",
                () => {

                    els.uploadBox?.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "center"
                        }
                    );


                    setTimeout(
                        () => {

                            els.imageInput?.click();

                        },
                        250
                    );

                }
            );

        }


        /*
         * Remove image.
         */
        if (els.removeImage) {

            els.removeImage.type =
                "button";


            els.removeImage.addEventListener(
                "click",
                () => {

                    resetResults(
                        true
                    );

                }
            );

        }

    }


    /* ======================================================
       REAL AI ANALYSIS
    ====================================================== */

    async function analyzeImage() {

        /*
         * Image required.
         */
        if (!state.selectedFile) {

            showToast(
                "Please upload an image first.",
                "warning"
            );


            return;
        }


        /*
         * Prevent duplicate requests.
         */
        if (state.isAnalyzing) {

            return;

        }


        state.isAnalyzing =
            true;


        setAnalyzing(
            true
        );


        try {

            /*
             * Create multipart form.
             */
            const formData =
                new FormData();


            /*
             * IMPORTANT:
             *
             * Flask expects:
             *
             * request.files["image"]
             */
            formData.append(
                "image",
                state.selectedFile,
                state.selectedFile.name
            );


            updateProcessing(
                10,
                "Uploading Image",
                "Sending your image to the AI backend."
            );


            /*
             * Send to Flask.
             */
            const response =
                await fetch(
                    CONFIG.API_BASE_URL,
                    {
                        method:
                            "POST",

                        body:
                            formData,

                        cache:
                            "no-store"
                    }
                );


            updateProcessing(
                45,
                "AI Processing",
                "Analyzing facial features and skin characteristics."
            );


            /*
             * Parse JSON.
             */
            const data =
                await parseJSONResponse(
                    response
                );


            /*
             * HTTP error.
             */
            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    `AI server returned HTTP ${response.status}.`
                );

            }


            /*
             * Backend explicitly reported failure.
             */
            if (
                data?.success ===
                false
            ) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Real AI analysis failed."
                );

            }


            /*
             * Verify that this is genuinely
             * an AI response.
             */
            validateAnalysisResponse(
                data
            );


            /*
             * Save complete backend response.
             */
            state.analysisResult =
                data;


            /*
             * Display analysis.
             */
            displayAnalysisResult(
                data
            );


            /*
             * Display real recommendations.
             */
            displayRecommendations(
                data
            );


            /*
             * Display backend products.
             */
            displayProducts(
                data
            );


            /*
             * Beauty metrics.
             */
            updateBeautyProgress(
                data
            );


            /*
             * Dashboard counters.
             */
            updateDashboardStats(
                data
            );


            /*
             * Save history.
             */
            updateAnalysisHistory(
                data
            );


            /*
             * Complete.
             */
            updateProcessing(
                100,
                "Analysis Completed",
                "Real AI facial analysis completed successfully."
            );


            /*
             * Enable makeup visualization.
             */
            updateMakeupButton();


            /*
             * Success notification.
             */
            showToast(
                "Real AI analysis completed successfully.",
                "success"
            );


            /*
             * Developer console.
             */
            console.log(
                "REAL AI ANALYSIS RESULT:",
                data
            );

        } catch (error) {

            console.error(
                "REAL AI ANALYSIS ERROR:",
                error
            );


            const message =
                getFriendlyError(
                    error
                );


            updateProcessing(
                0,
                "Analysis Failed",
                message
            );


            showToast(
                message,
                "error"
            );

        } finally {

            state.isAnalyzing =
                false;


            setAnalyzing(
                false
            );

        }

    }


    /* ======================================================
       VALIDATE REAL AI RESPONSE
    ====================================================== */

    function validateAnalysisResponse(
        data
    ) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new Error(
                "The AI backend returned an empty response."
            );

        }


        const analysis =
            getAnalysisObject(
                data
            );


        /*
         * Verify REAL_AI flag.
         */
        const realAI =
            data.metadata?.analysis_mode ===
                "REAL_AI" ||

            data.analysis_mode ===
                "REAL_AI" ||

            data.real_ai ===
                true ||

            data.real_ai_analysis ===
                true ||

            data.health_flags?.real_ai ===
                true ||

            data.skin_analysis?.ai_status?.skin_type ===
                true ||

            data.skin_analysis?.skin_type?.real_ai ===
                true;


        /*
         * Never accept an unverified
         * response as real AI.
         */
        if (!realAI) {

            throw new Error(
                "The backend response is not marked as a verified real-AI analysis."
            );

        }


        /*
         * Make sure actual analysis
         * fields exist.
         */
        const hasAnalysis =
            Boolean(

                data.skin_analysis ||

                analysis.skin_analysis ||

                data.face_shape ||

                analysis.face_shape ||

                data.eye_analysis ||

                analysis.eye_analysis ||

                data.lip_analysis ||

                analysis.lip_analysis ||

                data.beauty_score ||

                analysis.beauty_score

            );


        if (!hasAnalysis) {

            throw new Error(
                "The backend response does not contain facial analysis data."
            );

        }

    }


    /* ======================================================
       DISPLAY ANALYSIS RESULT
    ====================================================== */

    function displayAnalysisResult(
        data
    ) {

        const analysis =
            getAnalysisObject(
                data
            );


        /*
         * Skin analysis.
         */
        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};


        /*
         * Face shape.
         */
        const face =
            analysis.face_shape ||
            data.face_shape ||
            {};


        /*
         * Eye analysis.
         */
        const eyes =
            analysis.eye_analysis ||
            analysis.eyes ||
            data.eye_analysis ||
            data.eyes ||
            {};


        /*
         * Lip analysis.
         */
        const lips =
            analysis.lip_analysis ||
            analysis.lips ||
            data.lip_analysis ||
            data.lips ||
            {};


        /*
         * Skin type.
         */
        setText(
            els.skinType,
            firstValue(
                skin.skin_type,
                skin.type,
                analysis.skin_type
            )
        );


        /*
         * Skin tone.
         */
        setText(
            els.skinTone,
            firstValue(
                skin.skin_tone,
                skin.tone,
                analysis.skin_tone
            )
        );


        /*
         * Undertone.
         */
        setText(
            els.undertone,
            firstValue(
                skin.undertone,
                analysis.undertone
            )
        );


        /*
         * Face shape.
         */
        setText(
            els.faceShape,
            firstValue(
                face.face_shape,
                face.shape,
                face.label,
                analysis.face_shape
            )
        );


        /*
         * Acne.
         */
        setText(
            els.acneLevel,
            firstValue(
                skin.acne_level,
                skin.acne,
                analysis.acne_level
            )
        );


        /*
         * Dark circles.
         */
        setText(
            els.darkCircles,
            firstValue(
                skin.dark_circles,
                eyes.dark_circles,
                analysis.dark_circles
            )
        );


        /*
         * Eye shape.
         */
        setText(
            els.eyeShape,
            firstValue(
                eyes.eye_shape,
                eyes.shape,
                eyes.eyeShape
            )
        );


        /*
         * Eye color.
         */
        setText(
            els.eyeColor,
            firstValue(
                eyes.eye_color,
                eyes.color
            )
        );


        /*
         * Lip shape.
         */
        setText(
            els.lipShape,
            firstValue(
                lips.lip_shape,
                lips.shape
            )
        );


        /*
         * Lip color.
         */
        setText(
            els.lipColor,
            firstValue(
                lips.lip_color,
                lips.color
            )
        );


        /*
         * Confidence.
         */
        const confidence =
            findConfidence(
                data
            );


        if (els.confidence) {

            els.confidence.textContent =
                confidence === null
                    ? "--"
                    : `${Math.round(
                        confidence * 100
                    )}%`;

        }


        /*
         * AI method.
         */
        setText(
            els.aiMethod,
            firstValue(
                data.ai_method,
                data.method,
                data.model,
                analysis.ai_method
            )
        );


        /*
         * Real AI status labels.
         */
        const realAI =
            data.real_ai === true ||

            data.real_ai_analysis === true ||

            data.analysis_mode ===
                "REAL_AI" ||

            data.metadata?.analysis_mode ===
                "REAL_AI" ||

            data.health_flags?.real_ai ===
                true;


        document
            .querySelectorAll(
                "#aiStatus, #realAIStatus, .real-ai-status"
            )
            .forEach(
                (element) => {

                    element.textContent =
                        realAI
                            ? "Real AI analysis verified"
                            : "AI analysis completed";


                    element.classList.toggle(
                        "ai-verified",
                        realAI
                    );

                }
            );

    }


    /* ======================================================
       DISPLAY REAL RECOMMENDATIONS
    ====================================================== */

    function displayRecommendations(
        data
    ) {

        /*
         * IMPORTANT:
         *
         * Recommendations are NOT invented
         * by this JavaScript.
         *
         * They come from Flask backend.
         */
        const recommendations =
            data.recommendations ||

            data.personalized_recommendations ||

            data.recommendation_result ||

            data.analysis?.recommendations ||

            {};


        if (
            !recommendations ||
            typeof recommendations !==
                "object"
        ) {

            return;

        }


        const categories =
            Object.keys(
                PRODUCT_CARD_IDS
            );


        let displayed =
            0;


        categories.forEach(
            (category) => {

                const value =
                    recommendations[category] ??
                    recommendations[
                        category.replaceAll(
                            "_",
                            ""
                        )
                    ];


                if (
                    value === undefined ||
                    value === null
                ) {

                    return;

                }


                const elements =
                    findRecommendationElements(
                        category
                    );


                elements.forEach(
                    (element) => {

                        element.textContent =
                            formatBackendValue(
                                value
                            );

                    }
                );


                if (
                    elements.length
                ) {

                    displayed +=
                        1;

                }

            }
        );


        /*
         * General recommendation.
         */
        const general =
            recommendations.general ||

            recommendations.summary ||

            recommendations.overview;


        if (general) {

            findElementsByIDs(
                [
                    "generalRecommendation",
                    "makeupRecommendation",
                    "aiMakeupRecommendation",
                    "makeupRecommended"
                ]
            ).forEach(
                (element) => {

                    element.textContent =
                        formatBackendValue(
                            general
                        );

                }
            );

        }


        /*
         * Recommendation section.
         */
        const section =
            $("aiMakeupRecommended") ||

            $("aiMakeupRecommendations") ||

            $("makeupRecommendations") ||

            document.querySelector(
                ".recommendations-section"
            );


        if (section) {

            section.hidden =
                displayed === 0;


            section.dataset.aiRecommendationCount =
                String(
                    displayed
                );

        }

    }


    /* ======================================================
       FIND RECOMMENDATION ELEMENTS
    ====================================================== */

    function findRecommendationElements(
        category
    ) {

        return findElementsByIDs(
            [
                `${category}Recommendation`,
                `${category}-recommendation`,
                `recommendation${capitalize(
                    category
                )}`,
                `recommendation-${category}`
            ]
        );

    }



    /* ======================================================
       PRODUCT AREA INITIALIZATION
    ====================================================== */

    function initializeProductCards() {

        const section =
            $("recommendedProducts") ||
            $("aiRecommendedProducts") ||
            document.querySelector(
                ".products-section"
            ) ||
            document.querySelector(
                ".recommendation-section"
            );

        if (section) {
            section.hidden = true;
            section.style.display = "none";
            section.dataset.aiProductsReady = "false";
        }

        document
            .querySelectorAll(
                ".product-grid .product-card"
            )
            .forEach((card) => {

                card.hidden = true;
                card.style.display = "none";
                card.setAttribute(
                    "aria-hidden",
                    "true"
                );

            });
    }


    function getExactProductImage(
        product,
        category
    ) {

        if (
            !product ||
            typeof product !== "object"
        ) {
            return null;
        }

        const backendCandidates = [
            product.image_url,
            product.image,
            product.imageUrl,
            product.product_image,
            product.product_image_url,
            product.thumbnail
        ];

        for (
            const candidate of backendCandidates
        ) {

            if (
                typeof candidate === "string" &&
                (
                    /^https?:\/\//i.test(candidate.trim()) ||
                    /^data:image\//i.test(candidate.trim()) ||
                    /^assets\//i.test(candidate.trim())
                )
            ) {

                return candidate.trim();

            }
        }

        const productName = String(
            product.name ||
            product.product_name ||
            product.title ||
            ""
        ).trim();

        /*
         * Exact-name verified image only.
         * We deliberately do NOT use a category image
         * for a different product.
         */
        if (
            VERIFIED_PRODUCT_IMAGES_BY_NAME[
                productName
            ]
        ) {

            return VERIFIED_PRODUCT_IMAGES_BY_NAME[
                productName
            ];

        }

        /*
         * Only use a local category image when the project
         * explicitly contains that category asset.
         */
        const local =
            LOCAL_PRODUCT_IMAGES[
                category
            ];

        return (
            typeof local === "string" &&
            local.trim()
                ? local.trim()
                : null
        );

    }


    function ensureProductImage(
        card,
        product,
        category,
        name
    ) {

        let wrapper =
            card.querySelector(
                ".ai-product-image-wrap"
            );

        if (!wrapper) {

            wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "ai-product-image-wrap";

            card.prepend(
                wrapper
            );

        }

        wrapper.replaceChildren();

        const imageURL =
            getExactProductImage(
                product,
                category
            );

        if (!imageURL) {

            wrapper.hidden = true;

            return;

        }

        const image =
            document.createElement(
                "img"
            );

        image.className =
            "ai-product-image";

        image.src =
            imageURL;

        image.alt =
            `${name} product image`;

        image.loading =
            "lazy";

        image.decoding =
            "async";

        image.referrerPolicy =
            "no-referrer";

        image.addEventListener(
            "error",
            () => {

                /*
                 * Never replace a failed real image
                 * with a random/fake image.
                 */
                wrapper.remove();

            },
            {
                once: true
            }
        );

        wrapper.appendChild(
            image
        );

        wrapper.hidden =
            false;

    }


    /* ======================================================
       DISPLAY PRODUCTS
    ====================================================== */

    function displayProducts(
        data
    ) {


        /*
         * Product catalog must come from the backend
         * and must explicitly identify that it used
         * the real AI analysis.
         */
        const catalog =
            data.product_catalog ||

            data.product_recommendations ||

            data.products ||

            data.data?.product_catalog;


        if (
            !catalog ||
            typeof catalog !==
                "object"
        ) {

            return;

        }


        const verifiedRealAI =
            catalog.real_ai_analysis_used === true &&
            catalog.fake_prediction === false &&
            catalog.random_prediction === false;

        if (!verifiedRealAI) {

            console.error(
                "Product recommendations rejected: backend did not verify REAL_AI."
            );

            const section =
                $("recommendedProducts") ||
                $("aiRecommendedProducts") ||
                document.querySelector(
                    ".products-section"
                ) ||
                document.querySelector(
                    ".recommendation-section"
                );

            if (section) {
                section.hidden = true;
                section.style.display = "none";
            }

            showToast(
                "Product recommendations were not displayed because the backend did not return a verified REAL_AI result.",
                "warning"
            );

            return;

        }


        const products =
            catalog.products ||
            catalog;


        if (
            !products ||
            typeof products !==
                "object"
        ) {

            return;

        }


        let displayed =
            0;


        Object.entries(
            PRODUCT_CARD_IDS
        ).forEach(
            ([category, ids]) => {

                const product =
                    products[
                        category
                    ];


                if (
                    !product ||
                    typeof product !==
                        "object"
                ) {

                    return;

                }


                const card =
                    findProductCard(
                        category,
                        ids
                    );


                if (!card) {

                    return;

                }


                renderProductCard(
                    card,
                    product,
                    category
                );


                displayed +=
                    1;

            }
        );


        /*
         * Product section.
         */
        const section =
            $("recommendedProducts") ||

            $("aiRecommendedProducts") ||

            document.querySelector(
                ".products-section"
            ) ||

            document.querySelector(
                ".recommendation-section"
            );


        if (
            section &&
            displayed > 0
        ) {

            section.hidden =
                false;


            section.style.display =
                "";

        }

    }


    /* ======================================================
       FIND PRODUCT CARD
    ====================================================== */

    function findProductCard(
        category,
        ids
    ) {

        /*
         * Try exact IDs first.
         */
        for (
            const id of ids
        ) {

            const element =
                $(id);


            if (element) {

                return (
                    element.closest(
                        ".product-card"
                    ) ||
                    element
                );

            }

        }


        /*
         * Then use data-product.
         */
        return [
            ...document.querySelectorAll(
                ".product-card"
            )
        ].find(
            (card) => {

                const value =
                    (
                        card.dataset.product ||
                        ""
                    )
                    .toLowerCase()
                    .replace(
                        /[\s-]/g,
                        "_"
                    );


                return (
                    value ===
                    category
                );

            }
        ) || null;

    }


    /* ======================================================
       RENDER PRODUCT CARD
    ====================================================== */


    function renderProductCard(
        card,
        product,
        category
    ) {

        card.hidden =
            false;

        card.style.display =
            "";

        card.setAttribute(
            "aria-hidden",
            "false"
        );

        const name =
            product.name ||
            product.product_name ||
            product.title ||
            `${capitalize(category)} recommendation`;

        const brand =
            product.brand ||
            product.company ||
            "";

        const reason =
            product.reason ||
            product.description ||
            product.recommendation_reason ||
            product.why_recommended ||
            "";

        const score =
            product.match_score ??
            product.compatibility_score;

        /*
         * Keep the card title category-oriented,
         * but show the actual AI-selected product
         * below it.
         */
        const heading =
            card.querySelector(
                "h3"
            );

        if (heading) {

            heading.textContent =
                capitalize(
                    category.replace(
                        /_/g,
                        " "
                    )
                );

        }

        /*
         * Add the actual product photograph.
         * No random image is ever generated.
         */
        ensureProductImage(
            card,
            product,
            category,
            name
        );

        /*
         * Product information.
         */
        let text =
            brand
                ? `${brand} — ${name}`
                : name;

        if (reason) {

            text +=
                `\n${reason}`;

        }

        if (
            score !== undefined &&
            score !== null
        ) {

            const numeric =
                Number(
                    score
                );

            if (
                Number.isFinite(
                    numeric
                )
            ) {

                text +=
                    `\nAI compatibility: ${Math.round(
                        numeric
                    )}%`;

            }

        }

        const paragraph =
            card.querySelector(
                "p"
            );

        if (paragraph) {

            paragraph.textContent =
                text;

        } else {

            const description =
                document.createElement(
                    "p"
                );

            description.className =
                "product-description";

            description.textContent =
                text;

            card.appendChild(
                description
            );

        }

        /*
         * Optional real product URL.
         * Only use a URL supplied by the backend.
         */
        const productURL =
            product.official_url ||
            product.product_url ||
            product.productUrl ||
            product.url ||
            null;

        let link =
            card.querySelector(
                ".ai-product-link"
            );

        if (
            typeof productURL === "string" &&
            /^https?:\/\//i.test(
                productURL.trim()
            )
        ) {

            if (!link) {

                link =
                    document.createElement(
                        "a"
                    );

                link.className =
                    "ai-product-link";

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

                link.textContent =
                    "View product";

                card.appendChild(
                    link
                );

            }

            link.href =
                productURL.trim();

            link.hidden =
                false;

        } else if (link) {

            link.remove();

        }

        /*
         * Store the complete backend result
         * for report/save/share functionality.
         */
        card.dataset.aiProduct =
            JSON.stringify(
                product
            );

    }


    /* ======================================================
       PART 1 END
    ====================================================== */

    /* ======================================================
       MAKEUP VISUALIZATION INITIALIZATION
    ====================================================== */

    function initializeMakeupVisual() {

        /*
         * Makeup photo upload.
         */
        if (els.makeupPhotoInput) {

            els.makeupPhotoInput.addEventListener(
                "change",
                (event) => {

                    const file =
                        event.target.files?.[0];

                    if (!file) {
                        return;
                    }

                    handleMakeupImage(
                        file
                    );
                }
            );
        }


        /*
         * Makeup upload area.
         */
        if (els.makeupUploadArea) {

            els.makeupUploadArea.addEventListener(
                "click",
                () => {

                    if (
                        els.makeupPhotoInput
                    ) {

                        els.makeupPhotoInput.click();

                    }

                }
            );


            els.makeupUploadArea.addEventListener(
                "dragover",
                (event) => {

                    event.preventDefault();

                    els.makeupUploadArea.classList.add(
                        "dragover"
                    );

                }
            );


            els.makeupUploadArea.addEventListener(
                "dragleave",
                () => {

                    els.makeupUploadArea.classList.remove(
                        "dragover"
                    );

                }
            );


            els.makeupUploadArea.addEventListener(
                "drop",
                (event) => {

                    event.preventDefault();

                    els.makeupUploadArea.classList.remove(
                        "dragover"
                    );


                    const file =
                        event.dataTransfer?.files?.[0];


                    if (file) {

                        handleMakeupImage(
                            file
                        );

                    }

                }
            );

        }


        /*
         * Generate makeup button.
         */
        if (els.generateMakeupBtn) {

            els.generateMakeupBtn.type =
                "button";


            els.generateMakeupBtn.addEventListener(
                "click",
                generateMakeupVisual
            );

        }


        /*
         * Consent checkbox.
         */
        if (els.makeupConsent) {

            els.makeupConsent.addEventListener(
                "change",
                updateMakeupButton
            );

        }

    }


    /* ======================================================
       MAKEUP IMAGE HANDLER
    ====================================================== */

    function handleMakeupImage(
        file
    ) {

        if (!file) {
            return;
        }


        const allowed =
            CONFIG.ALLOWED_TYPES.includes(
                String(
                    file.type || ""
                ).toLowerCase()
            );


        if (!allowed) {

            showToast(
                "Please select a valid JPG, PNG, WEBP or BMP image.",
                "error"
            );

            return;
        }


        if (
            file.size >
            CONFIG.MAX_IMAGE_SIZE
        ) {

            showToast(
                "Makeup image must be less than 10 MB.",
                "error"
            );

            return;
        }


        /*
         * Revoke previous preview.
         */
        if (
            state.makeupPreviewURL
        ) {

            URL.revokeObjectURL(
                state.makeupPreviewURL
            );

        }


        state.makeupFile =
            file;


        state.makeupPreviewURL =
            URL.createObjectURL(
                file
            );


        /*
         * Display preview.
         */
        setImage(
            els.makeupInputPreview,
            state.makeupPreviewURL,
            "Makeup visualization source image"
        );


        setImage(
            els.makeupSourceImage,
            state.makeupPreviewURL,
            "Makeup source image"
        );


        if (
            els.makeupPreviewContainer
        ) {

            els.makeupPreviewContainer.hidden =
                false;

        }


        updateMakeupButton();


        showToast(
            "Makeup visualization image is ready.",
            "success"
        );

    }


    /* ======================================================
       UPDATE MAKEUP BUTTON
    ====================================================== */

    function updateMakeupButton() {

        if (
            !els.generateMakeupBtn
        ) {

            return;
        }


        /*
         * Makeup visualization requires:
         *
         * 1. Uploaded image
         * 2. Completed real AI analysis
         * 3. Consent if consent checkbox exists
         */
        const hasImage =
            Boolean(
                state.makeupFile ||
                state.selectedFile
            );


        const hasAnalysis =
            Boolean(
                state.analysisResult
            );


        const consentRequired =
            Boolean(
                els.makeupConsent
            );


        const consentGiven =
            !consentRequired ||
            Boolean(
                els.makeupConsent.checked
            );


        els.generateMakeupBtn.disabled =
            !hasImage ||
            !hasAnalysis ||
            !consentGiven ||
            state.isGeneratingMakeup;


        /*
         * Helpful status.
         */
        if (
            !hasAnalysis &&
            els.makeupVisualStatus
        ) {

            els.makeupVisualStatus.textContent =
                "Complete the real AI analysis first.";

        }

    }


    /* ======================================================
       GENERATE REAL AI MAKEUP VISUAL
    ====================================================== */

    async function generateMakeupVisual() {

        if (
            state.isGeneratingMakeup
        ) {

            return;
        }


        /*
         * Real analysis is required.
         */
        if (
            !state.analysisResult
        ) {

            showToast(
                "Complete the real AI analysis before generating makeup visualization.",
                "warning"
            );

            return;
        }


        /*
         * Select source image.
         */
        const sourceFile =
            state.makeupFile ||
            state.selectedFile;


        if (!sourceFile) {

            showToast(
                "Please upload a makeup visualization image.",
                "warning"
            );

            return;
        }


        /*
         * Consent.
         */
        if (
            els.makeupConsent &&
            !els.makeupConsent.checked
        ) {

            showToast(
                "Please provide consent before generating a makeup visualization.",
                "warning"
            );

            return;
        }


        state.isGeneratingMakeup =
            true;


        updateMakeupButton();


        setMakeupStatus(
            "Generating AI makeup visualization..."
        );


        try {

            /*
             * Send original image and
             * real analysis to backend.
             */
            const formData =
                new FormData();


            formData.append(
                "image",
                sourceFile,
                sourceFile.name
            );


            /*
             * Include the actual AI analysis.
             *
             * The backend can use this to
             * create personalized makeup.
             */
            formData.append(
                "analysis",
                JSON.stringify(
                    state.analysisResult
                )
            );


            const response =
                await fetch(
                    getMakeupVisualEndpoint(),
                    {
                        method:
                            "POST",

                        body:
                            formData,

                        cache:
                            "no-store"
                    }
                );


            const data =
                await parseJSONResponse(
                    response
                );


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    `Makeup visualization failed with HTTP ${response.status}.`
                );

            }


            if (
                data?.success ===
                false
            ) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "The AI makeup visualization failed."
                );

            }


            /*
             * Accept actual generated
             * image data from backend.
             */
            const imageURL =
                extractGeneratedImageURL(
                    data
                );


            if (!imageURL) {

                throw new Error(
                    "The AI backend did not return a generated makeup image."
                );

            }


            /*
             * Display actual generated image.
             */
            if (
                els.makeupGeneratedImage
            ) {

                els.makeupGeneratedImage.src =
                    imageURL;


                els.makeupGeneratedImage.alt =
                    "AI generated makeup visualization";


                els.makeupGeneratedImage.hidden =
                    false;


                els.makeupGeneratedImage.style.display =
                    "block";


                els.makeupGeneratedImage.style.visibility =
                    "visible";

            }


            /*
             * Hide placeholder.
             */
            if (
                els.makeupResultPlaceholder
            ) {

                els.makeupResultPlaceholder.hidden =
                    true;

            }


            /*
             * Recommendation summary.
             */
            const recommendationText =
                extractRecommendationSummary(
                    state.analysisResult
                );


            if (
                els.makeupRecommendationSummary &&
                recommendationText
            ) {

                els.makeupRecommendationSummary.textContent =
                    recommendationText;

            }


            setMakeupStatus(
                "AI makeup visualization generated successfully."
            );


            showToast(
                "AI makeup visualization generated.",
                "success"
            );


        } catch (error) {

            console.error(
                "MAKEUP VISUALIZATION ERROR:",
                error
            );


            const message =
                getFriendlyError(
                    error
                );


            setMakeupStatus(
                message
            );


            showToast(
                message,
                "error"
            );

        } finally {

            state.isGeneratingMakeup =
                false;


            updateMakeupButton();

        }

    }


    /* ======================================================
       MAKEUP VISUAL ENDPOINT
    ====================================================== */

    function getMakeupVisualEndpoint() {

        /*
         * CONFIG.API_BASE_URL:
         *
         * http://127.0.0.1:5000/api/analysis/
         *
         * Result:
         *
         * http://127.0.0.1:5000/api/analysis/makeup-visual
         */

        return (
            CONFIG.API_BASE_URL
                .replace(
                    /\/+$/,
                    ""
                ) +
            "/makeup-visual"
        );

    }


    /* ======================================================
       EXTRACT GENERATED IMAGE
    ====================================================== */

    function extractGeneratedImageURL(
        data
    ) {

        const candidates = [

            data?.image_data_url,

            data?.imageDataUrl,

            data?.generated_image,

            data?.generatedImage,

            data?.image_url,

            data?.imageUrl,

            data?.result?.image_data_url,

            data?.result?.generated_image,

            data?.result?.image_url,

            data?.data?.image_data_url,

            data?.data?.generated_image,

            data?.data?.image_url

        ];


        for (
            const candidate of candidates
        ) {

            if (
                typeof candidate ===
                "string" &&
                candidate.trim()
            ) {

                return candidate;

            }

        }


        return null;

    }


    /* ======================================================
       EXTRACT RECOMMENDATION SUMMARY
    ====================================================== */

    function extractRecommendationSummary(
        data
    ) {

        const recommendations =
            data?.recommendations ||
            data?.personalized_recommendations ||
            data?.analysis?.recommendations;


        if (
            typeof recommendations ===
            "string"
        ) {

            return recommendations;

        }


        if (
            !recommendations ||
            typeof recommendations !==
            "object"
        ) {

            return "";

        }


        const summary =
            recommendations.summary ||
            recommendations.general ||
            recommendations.overview;


        if (summary) {

            return formatBackendValue(
                summary
            );

        }


        const values =
            Object.values(
                recommendations
            )
            .filter(
                value =>
                    value !== null &&
                    value !== undefined &&
                    value !== ""
            )
            .slice(
                0,
                4
            );


        return values.length
            ? values
                .map(
                    formatBackendValue
                )
                .join(
                    " • "
                )
            : "";

    }


    /* ======================================================
       MAKEUP STATUS
    ====================================================== */

    function setMakeupStatus(
        message
    ) {

        if (
            els.makeupVisualStatus
        ) {

            els.makeupVisualStatus.textContent =
                message || "";

        }

    }


    /* ======================================================
       BEAUTY SCORE / METRICS
    ====================================================== */

    function updateBeautyProgress(
        data
    ) {

        const analysis =
            getAnalysisObject(
                data
            );


        const score =
            findNumericValue(
                data,
                [
                    "beauty_score",
                    "beautyScore",
                    "overall_score",
                    "overallScore"
                ]
            );


        if (
            score === null
        ) {

            return;

        }


        const safeScore =
            Math.max(
                0,
                Math.min(
                    100,
                    score
                )
            );


        /*
         * Main score.
         */
        animateNumber(
            els.beautyScore,
            safeScore,
            "%"
        );


        /*
         * Dashboard score.
         */
        animateNumber(
            els.dashboardBeautyScore,
            safeScore,
            "%"
        );


        /*
         * SVG progress.
         */
        updateCircularProgress(
            safeScore
        );


        /*
         * Beauty progress score.
         */
        setText(
            els.beautyProgressScore,
            `${Math.round(
                safeScore
            )}%`
        );


        /*
         * Grade.
         */
        setText(
            els.beautyProgressGrade,
            getScoreGrade(
                safeScore
            )
        );


        /*
         * Optional category scores.
         */
        const breakdown =
            data.beauty_breakdown ||
            data.beautyBreakdown ||
            analysis.beauty_breakdown ||
            {};


        setNumericText(
            els.beautySkinScore,
            breakdown.skin
        );


        setNumericText(
            els.beautyEyesScore,
            breakdown.eyes
        );


        setNumericText(
            els.beautyFaceScore,
            breakdown.face
        );


        setNumericText(
            els.beautyLipsScore,
            breakdown.lips
        );


        /*
         * Chart.
         */
        updateBeautyChart(
            breakdown
        );

    }


    /* ======================================================
       SCORE GRADE
    ====================================================== */

    function getScoreGrade(
        score
    ) {

        /*
         * This is only a UI representation
         * of the backend score.
         *
         * It does not change the score.
         */
        if (score >= 90) {

            return "Excellent";

        }


        if (score >= 80) {

            return "Very Good";

        }


        if (score >= 70) {

            return "Good";

        }


        if (score >= 60) {

            return "Balanced";

        }


        return "Needs Attention";

    }


    /* ======================================================
       CIRCULAR PROGRESS
    ====================================================== */

    function updateCircularProgress(
        score
    ) {

        if (
            !els.progressCircle
        ) {

            return;

        }


        const radius =
            Number(
                els.progressCircle.getAttribute(
                    "r"
                )
            ) || 75;


        const circumference =
            2 *
            Math.PI *
            radius;


        const offset =
            circumference -
            (
                score /
                100
            ) *
            circumference;


        els.progressCircle.style.strokeDasharray =
            String(
                circumference
            );


        requestAnimationFrame(
            () => {

                els.progressCircle.style.strokeDashoffset =
                    String(
                        offset
                    );

            }
        );

    }


    /* ======================================================
       BEAUTY CHART INITIALIZATION
    ====================================================== */

    function initializeChart() {

        /*
         * Existing Chart.js canvas.
         */
        if (
            !els.beautyChart ||
            typeof Chart ===
            "undefined"
        ) {

            return;

        }


        /*
         * Prevent duplicate charts.
         */
        if (
            state.beautyChart
        ) {

            try {

                state.beautyChart.destroy();

            } catch (_) {}

        }


        const context =
            els.beautyChart.getContext(
                "2d"
            );


        if (!context) {

            return;

        }


        state.beautyChart =
            new Chart(
                context,
                {
                    type:
                        "doughnut",

                    data: {

                        labels: [
                            "Skin",
                            "Eyes",
                            "Face",
                            "Lips"
                        ],

                        datasets: [
                            {
                                data: [
                                    0,
                                    0,
                                    0,
                                    0
                                ],

                                borderWidth:
                                    0
                            }
                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        cutout:
                            "72%",

                        plugins: {

                            legend: {
                                display:
                                    false
                            }

                        }

                    }

                }
            );

    }


    /* ======================================================
       UPDATE BEAUTY CHART
    ====================================================== */

    function updateBeautyChart(
        breakdown
    ) {

        if (
            !state.beautyChart
        ) {

            return;

        }


        const values = [

            numericOrZero(
                breakdown.skin
            ),

            numericOrZero(
                breakdown.eyes
            ),

            numericOrZero(
                breakdown.face
            ),

            numericOrZero(
                breakdown.lips
            )

        ];


        /*
         * If backend does not provide
         * breakdown values, don't invent them.
         */
        const hasRealBreakdown =
            values.some(
                value =>
                    value > 0
            );


        if (
            !hasRealBreakdown
        ) {

            return;

        }


        state.beautyChart.data.datasets[0].data =
            values;


        state.beautyChart.update();

    }


    /* ======================================================
       DASHBOARD STATISTICS
    ====================================================== */

    function updateDashboardStats(
        data
    ) {

        const analysis =
            getAnalysisObject(
                data
            );


        /*
         * Skin type.
         */
        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};


        const type =
            firstValue(
                skin.skin_type,
                skin.type,
                analysis.skin_type
            );


        setText(
            els.dashboardSkinType,
            type
        );


        /*
         * Total analysis count.
         *
         * We increment only when the
         * backend confirms successful analysis.
         */
        if (
            els.totalAnalysis
        ) {

            const current =
                parseInt(
                    els.totalAnalysis.textContent,
                    10
                );


            if (
                Number.isFinite(
                    current
                )
            ) {

                els.totalAnalysis.textContent =
                    String(
                        current + 1
                    );

            }

        }

    }


    /* ======================================================
       HISTORY
    ====================================================== */

    function updateAnalysisHistory(
        data
    ) {

        const analysis =
            getAnalysisObject(
                data
            );


        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};


        const historyItem = {

            id:
                createID(),

            timestamp:
                new Date().toISOString(),

            skinType:
                firstValue(
                    skin.skin_type,
                    skin.type
                ) ||
                "--",

            skinTone:
                firstValue(
                    skin.skin_tone,
                    skin.tone
                ) ||
                "--",

            faceShape:
                firstValue(
                    analysis.face_shape,
                    data.face_shape
                ) ||
                "--",

            beautyScore:
                findNumericValue(
                    data,
                    [
                        "beauty_score",
                        "beautyScore"
                    ]
                )

        };


        let history =
            readStorageArray(
                CONFIG.HISTORY_KEY
            );


        history.unshift(
            historyItem
        );


        history =
            history.slice(
                0,
                CONFIG.MAX_HISTORY
            );


        writeStorage(
            CONFIG.HISTORY_KEY,
            history
        );


        renderHistory(
            history
        );

    }


    /* ======================================================
       RENDER HISTORY
    ====================================================== */

    function renderHistory(
        history
    ) {

        if (
            !els.history
        ) {

            return;

        }


        els.history.innerHTML =
            "";


        if (
            !history.length
        ) {

            els.history.innerHTML =
                `
                    <div class="empty-history">
                        No analysis history yet.
                    </div>
                `;

            return;

        }


        history.forEach(
            (item) => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "analysis-history-item";


                const date =
                    formatDate(
                        item.timestamp
                    );


                row.innerHTML =
                    `
                        <div class="history-main">

                            <strong>
                                AI Skin Analysis
                            </strong>

                            <span>
                                ${escapeHTML(
                                    date
                                )}
                            </span>

                        </div>

                        <div class="history-details">

                            <span>
                                Skin:
                                ${escapeHTML(
                                    item.skinType
                                )}
                            </span>

                            <span>
                                Tone:
                                ${escapeHTML(
                                    item.skinTone
                                )}
                            </span>

                            <span>
                                Face:
                                ${escapeHTML(
                                    item.faceShape
                                )}
                            </span>

                        </div>
                    `;


                els.history.appendChild(
                    row
                );

            }
        );

    }


    /* ======================================================
       THEME / DARK MODE
    ====================================================== */

    function initializeTheme() {

        /*
         * Read saved theme.
         */
        const saved =
            localStorage.getItem(
                CONFIG.THEME_KEY
            );


        if (
            saved ===
            "dark"
        ) {

            applyTheme(
                "dark"
            );

        } else {

            applyTheme(
                "light"
            );

        }


        /*
         * Dark mode button.
         */
        if (
            els.darkModeBtn
        ) {

            els.darkModeBtn.type =
                "button";


            els.darkModeBtn.addEventListener(
                "click",
                toggleTheme
            );

        }


        updateThemeIcon();

    }


    /* ======================================================
       TOGGLE THEME
    ====================================================== */

    function toggleTheme(
        event
    ) {

        if (event) {

            event.preventDefault();

        }


        const current =
            document.body.classList.contains(
                "dark-mode"
            )
                ? "dark"
                : "light";


        const next =
            current === "dark"
                ? "light"
                : "dark";


        applyTheme(
            next
        );


        localStorage.setItem(
            CONFIG.THEME_KEY,
            next
        );


        updateThemeIcon();


        showToast(
            next === "dark"
                ? "Dark mode enabled."
                : "Light mode enabled.",
            "success"
        );

    }


    /* ======================================================
       APPLY THEME
    ====================================================== */

    function applyTheme(
        theme
    ) {

        const isDark =
            theme === "dark";


        document.body.classList.toggle(
            "dark-mode",
            isDark
        );


        document.documentElement.classList.toggle(
            "dark-mode",
            isDark
        );


        document.body.classList.toggle(
            "light-mode",
            !isDark
        );


        document.documentElement.setAttribute(
            "data-theme",
            theme
        );


        /*
         * Compatibility with projects
         * using .dark-theme.
         */
        document.body.classList.toggle(
            "dark-theme",
            isDark
        );


        document.documentElement.classList.toggle(
            "dark-theme",
            isDark
        );

    }


    /* ======================================================
       THEME ICON
    ====================================================== */

    function updateThemeIcon() {

        if (
            !els.darkModeBtn
        ) {

            return;

        }


        const icon =
            els.darkModeBtn.querySelector(
                "i"
            );


        if (!icon) {

            return;

        }


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        icon.classList.toggle(
            "fa-moon",
            !isDark
        );


        icon.classList.toggle(
            "fa-sun",
            isDark
        );


        els.darkModeBtn.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );


        els.darkModeBtn.setAttribute(
            "title",
            isDark
                ? "Light Mode"
                : "Dark Mode"
        );

    }


    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    function initializeNotifications() {

        if (
            !els.notificationBtn
        ) {

            return;

        }


        els.notificationBtn.type =
            "button";


        els.notificationBtn.addEventListener(
            "click",
            toggleNotificationPanel
        );


        /*
         * Restore stored notifications.
         */
        const notifications =
            readStorageArray(
                CONFIG.NOTIFICATION_KEY
            );


        state.notificationCount =
            notifications.filter(
                item =>
                    !item.read
            ).length;


        updateNotificationBadge();

    }


    /* ======================================================
       TOGGLE NOTIFICATION PANEL
    ====================================================== */

    function toggleNotificationPanel(
        event
    ) {

        if (event) {

            event.preventDefault();

        }


        let panel =
            $("notificationPanel");


        if (!panel) {

            panel =
                createNotificationPanel();

        }


        const hidden =
            panel.hidden;


        panel.hidden =
            !hidden;


        if (!panel.hidden) {

            renderNotifications();

        }

    }


    /* ======================================================
       CREATE NOTIFICATION PANEL
    ====================================================== */

    function createNotificationPanel() {

        const panel =
            document.createElement(
                "div"
            );


        panel.id =
            "notificationPanel";


        panel.className =
            "notification-panel";


        panel.hidden =
            true;


        panel.innerHTML =
            `
                <div class="notification-header">

                    <strong>
                        Notifications
                    </strong>

                    <button
                        type="button"
                        class="notification-close"
                        aria-label="Close notifications"
                    >
                        ×
                    </button>

                </div>

                <div
                    class="notification-list"
                    id="notificationList"
                ></div>

                <div class="notification-footer">

                    <button
                        type="button"
                        id="markNotificationsRead"
                    >
                        Mark all as read
                    </button>

                </div>
            `;


        document.body.appendChild(
            panel
        );


        panel
            .querySelector(
                ".notification-close"
            )
            ?.addEventListener(
                "click",
                () => {

                    panel.hidden =
                        true;

                }
            );


        panel
            .querySelector(
                "#markNotificationsRead"
            )
            ?.addEventListener(
                "click",
                markNotificationsRead
            );


        return panel;

    }


    /* ======================================================
       ADD NOTIFICATION
    ====================================================== */

    function addNotification(
        title,
        message,
        type = "info"
    ) {

        const notifications =
            readStorageArray(
                CONFIG.NOTIFICATION_KEY
            );


        notifications.unshift({

            id:
                createID(),

            title:
                String(
                    title ||
                    "Notification"
                ),

            message:
                String(
                    message ||
                    ""
                ),

            type:
                type,

            timestamp:
                new Date().toISOString(),

            read:
                false

        });


        /*
         * Keep latest 30.
         */
        notifications.splice(
            30
        );


        writeStorage(
            CONFIG.NOTIFICATION_KEY,
            notifications
        );


        state.notificationCount =
            notifications.filter(
                item =>
                    !item.read
            ).length;


        updateNotificationBadge();


        /*
         * Refresh open panel.
         */
        const panel =
            $("notificationPanel");


        if (
            panel &&
            !panel.hidden
        ) {

            renderNotifications();

        }

    }


    /* ======================================================
       RENDER NOTIFICATIONS
    ====================================================== */

    function renderNotifications() {

        const list =
            $("notificationList");


        if (!list) {

            return;

        }


        const notifications =
            readStorageArray(
                CONFIG.NOTIFICATION_KEY
            );


        if (
            !notifications.length
        ) {

            list.innerHTML =
                `
                    <div class="empty-notifications">
                        No notifications.
                    </div>
                `;

            return;

        }


        list.innerHTML =
            notifications
                .slice(
                    0,
                    15
                )
                .map(
                    item =>
                        `
                            <div
                                class="notification-item ${
                                    item.read
                                        ? "read"
                                        : "unread"
                                }"
                                data-notification-id="${escapeHTML(
                                    item.id
                                )}"
                            >

                                <div class="notification-icon">
                                    <i class="fa-solid fa-bell"></i>
                                </div>

                                <div class="notification-content">

                                    <strong>
                                        ${escapeHTML(
                                            item.title
                                        )}
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            item.message
                                        )}
                                    </p>

                                    <small>
                                        ${escapeHTML(
                                            formatDate(
                                                item.timestamp
                                            )
                                        )}
                                    </small>

                                </div>

                            </div>
                        `
                )
                .join("");

    }


    /* ======================================================
       MARK NOTIFICATIONS READ
    ====================================================== */

    function markNotificationsRead() {

        const notifications =
            readStorageArray(
                CONFIG.NOTIFICATION_KEY
            );


        notifications.forEach(
            item => {

                item.read =
                    true;

            }
        );


        writeStorage(
            CONFIG.NOTIFICATION_KEY,
            notifications
        );


        state.notificationCount =
            0;


        updateNotificationBadge();


        renderNotifications();

    }


    /* ======================================================
       NOTIFICATION BADGE
    ====================================================== */

    function updateNotificationBadge() {

        const existing =
            document.querySelector(
                "#notificationBadge, .notification-badge"
            );


        if (!existing) {

            return;

        }


        if (
            state.notificationCount >
            0
        ) {

            existing.textContent =
                String(
                    state.notificationCount
                );


            existing.hidden =
                false;

        } else {

            existing.textContent =
                "";


            existing.hidden =
                true;

        }

    }


    /* ======================================================
       SEARCH
    ====================================================== */

    function initializeSearch() {

        if (
            !els.search
        ) {

            return;

        }


        els.search.addEventListener(
            "input",
            handleSearch
        );

    }


    /* ======================================================
       SEARCH HANDLER
    ====================================================== */

    function handleSearch(
        event
    ) {

        const query =
            String(
                event.target.value ||
                ""
            )
            .trim()
            .toLowerCase();


        /*
         * Search dashboard cards.
         */
        const searchable =
            document.querySelectorAll(
                ".searchable, .product-card, .recommendation-card, .analysis-card"
            );


        searchable.forEach(
            (element) => {

                const text =
                    element.textContent
                        .toLowerCase();


                element.style.display =
                    !query ||
                    text.includes(
                        query
                    )
                        ? ""
                        : "none";

            }
        );

    }


    /* ======================================================
       RESET DASHBOARD
    ====================================================== */

    function initializeReset() {

        if (
            !els.resetBtn
        ) {

            return;

        }


        els.resetBtn.type =
            "button";


        els.resetBtn.addEventListener(
            "click",
            () => {

                resetResults(
                    true
                );

            }
        );

    }


    /* ======================================================
       RESET RESULTS
    ====================================================== */

    function resetResults(
        showNotification = true
    ) {

        /*
         * Don't interrupt an active
         * backend analysis.
         */
        if (
            state.isAnalyzing
        ) {

            return;

        }


        state.selectedFile =
            null;


        state.analysisResult =
            null;


        /*
         * Makeup state.
         */
        state.makeupFile =
            null;


        if (
            state.makeupPreviewURL
        ) {

            URL.revokeObjectURL(
                state.makeupPreviewURL
            );


            state.makeupPreviewURL =
                null;

        }


        /*
         * Preview URLs.
         */
        revokePreviewURL();


        /*
         * File input.
         */
        if (
            els.imageInput
        ) {

            els.imageInput.value =
                "";

        }


        if (
            els.makeupPhotoInput
        ) {

            els.makeupPhotoInput.value =
                "";

        }


        /*
         * Main preview.
         */
        if (
            els.previewImage
        ) {

            els.previewImage.removeAttribute(
                "src"
            );

            els.previewImage.hidden =
                true;

            els.previewImage.style.display =
                "none";

            els.previewImage.style.visibility =
                "hidden";

            els.previewImage.style.opacity =
                "0";


            const previewContainer =
                els.previewImage.closest(
                    ".preview-box, .preview-container, .live-preview, .image-preview"
                );


            if (previewContainer) {

                previewContainer.classList.remove(
                    "has-image"
                );

            }

        }


        /*
         * Upload state.
         */
        if (
            els.uploadBox
        ) {

            els.uploadBox.classList.remove(
                "has-image"
            );

        }


        /*
         * Reset displayed analysis.
         */
        const resetElements = [

            els.skinType,
            els.skinTone,
            els.undertone,
            els.faceShape,
            els.acneLevel,
            els.darkCircles,
            els.eyeShape,
            els.eyeColor,
            els.lipShape,
            els.lipColor,
            els.confidence,
            els.aiMethod

        ];


        resetElements.forEach(
            element => {

                setText(
                    element,
                    "--"
                );

            }
        );


        /*
         * Score.
         */
        setText(
            els.beautyScore,
            "--"
        );


        setText(
            els.dashboardBeautyScore,
            "--"
        );


        /*
         * Analysis button.
         */
        if (
            els.analyzeBtn
        ) {

            els.analyzeBtn.disabled =
                true;

        }


        /*
         * Reset processing.
         */
        updateProcessing(
            0,
            "Ready",
            "Upload a clear face image to start real AI analysis."
        );


        /*
         * Makeup visualization.
         */
        if (
            els.makeupGeneratedImage
        ) {

            els.makeupGeneratedImage.removeAttribute(
                "src"
            );


            els.makeupGeneratedImage.hidden =
                true;

        }


        if (
            els.makeupResultPlaceholder
        ) {

            els.makeupResultPlaceholder.hidden =
                false;

        }


        updateMakeupButton();


        if (
            showNotification
        ) {

            showToast(
                "Analysis reset.",
                "info"
            );

        }

    }


    /* ======================================================
       NAVIGATION
    ====================================================== */

    function initializeNavigation() {

        /*
         * Smooth-scroll internal anchors.
         */
        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        (event) => {

                            const selector =
                                link.getAttribute(
                                    "href"
                                );


                            if (
                                !selector ||
                                selector === "#"
                            ) {

                                return;

                            }


                            const target =
                                document.querySelector(
                                    selector
                                );


                            if (
                                target
                            ) {

                                event.preventDefault();


                                target.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",

                                        block:
                                            "start"
                                    }
                                );

                            }

                        }
                    );

                }
            );

    }


    /* ======================================================
       REPORT ACTIONS
       Download / Save / Share / Analyze Again
    ====================================================== */

    function findActionButton(
        selectors,
        textMatcher
    ) {

        for (
            const selector of selectors
        ) {

            const element =
                document.querySelector(
                    selector
                );

            if (element) {
                return element;
            }

        }


        /*
         * Fallback for existing HTML where
         * only button text is present.
         */
        if (
            typeof textMatcher ===
            "function"
        ) {

            const buttons =
                [
                    ...document.querySelectorAll(
                        "button, a"
                    )
                ];

            return (
                buttons.find(
                    button =>
                        textMatcher(
                            String(
                                button.textContent ||
                                ""
                            ).trim()
                        )
                ) ||
                null
            );

        }


        return null;

    }


    function initializeReportActions() {

        const downloadButton =
            findActionButton(
                [
                    "#downloadReport",
                    "#downloadBtn",
                    "#reportBtn",
                    ".download-btn",
                    ".download-report-btn",
                    "[data-action='download-report']"
                ],
                text =>
                    /download\s+report/i.test(
                        text
                    )
            );


        const saveButton =
            findActionButton(
                [
                    "#saveReport",
                    "#saveBtn",
                    ".save-btn",
                    ".save-report-btn",
                    "[data-action='save-report']"
                ],
                text =>
                    /save\s+report/i.test(
                        text
                    )
            );


        const shareButton =
            findActionButton(
                [
                    "#shareReport",
                    "#shareBtn",
                    ".share-btn",
                    ".share-report-btn",
                    "[data-action='share-report']"
                ],
                text =>
                    /^share(?:\s+report)?$/i.test(
                        text
                    )
            );


        const againButton =
            findActionButton(
                [
                    "#analyzeAgain",
                    "#analyzeAgainBtn",
                    "#againBtn",
                    ".again-btn",
                    ".analyze-again-btn",
                    "[data-action='analyze-again']"
                ],
                text =>
                    /analyze\s+again/i.test(
                        text
                    )
            );


        /*
         * Download.
         */
        if (
            downloadButton
        ) {

            downloadButton.type =
                "button";


            downloadButton.addEventListener(
                "click",
                downloadReport
            );

        }


        /*
         * Save.
         */
        if (
            saveButton
        ) {

            saveButton.type =
                "button";


            saveButton.addEventListener(
                "click",
                saveAnalysis
            );

        }


        /*
         * Share.
         */
        if (
            shareButton
        ) {

            shareButton.type =
                "button";


            shareButton.addEventListener(
                "click",
                shareAnalysis
            );

        }


        /*
         * Analyze Again.
         */
        if (
            againButton
        ) {

            againButton.type =
                "button";


            againButton.addEventListener(
                "click",
                analyzeAgain
            );

        }

    }


    /* ======================================================
       ANALYZE AGAIN
    ====================================================== */

    function analyzeAgain(
        event
    ) {

        if (event) {
            event.preventDefault();
        }


        if (
            state.isAnalyzing
        ) {

            showToast(
                "Please wait until the current AI analysis finishes.",
                "warning"
            );

            return;

        }


        resetResults(
            false
        );


        /*
         * Return the user to the upload
         * area so a new image can be selected.
         */
        const target =
            els.uploadBox ||
            els.dropArea;


        if (target) {

            target.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );

        }


        showToast(
            "Ready for a new real AI analysis.",
            "success"
        );

    }


    /* ======================================================
       DOWNLOAD AI REPORT
    ====================================================== */

    function downloadReport() {

        if (
            !state.analysisResult
        ) {

            showToast(
                "Complete AI analysis before downloading the report.",
                "warning"
            );

            return;

        }


        const result =
            state.analysisResult;


        const report =
            result.report ||
            {};


        /*
         * First preference:
         * use an actual report generated
         * by the backend.
         */
        const reportURL =
            result.report_url ||
            result.reportUrl ||
            report.url ||
            report.download_url ||
            report.downloadUrl;


        if (reportURL) {

            try {

                const absolute =
                    new URL(
                        reportURL,
                        CONFIG.API_BASE_URL
                    ).href;


                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    absolute;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                return;

            } catch (error) {

                console.error(
                    "Invalid backend report URL:",
                    error
                );

            }

        }


        /*
         * Second preference:
         * if the backend returned report text,
         * download that exact backend content.
         */
        const reportText =
            report.text ||
            report.content ||
            result.report_text ||
            result.reportText;


        if (
            reportText
        ) {

            downloadTextFile(
                "ai-makeup-analysis-report.txt",
                reportText
            );

            showToast(
                "AI report downloaded successfully.",
                "success"
            );

            return;

        }


        /*
         * Professional local report generated
         * ONLY from the genuine backend response.
         *
         * No prediction, score, recommendation
         * or skin result is invented here.
         */
        const html =
            buildActualAnalysisReportHTML(
                result
            );


        downloadHTMLFile(
            "ai-makeup-analysis-report.html",
            html
        );


        showToast(
            "Your AI analysis report has been downloaded.",
            "success"
        );

    }


    /* ======================================================
       BUILD ACTUAL ANALYSIS REPORT
    ====================================================== */

    function buildActualAnalysisReportHTML(
        data
    ) {

        const analysis =
            getAnalysisObject(
                data
            );


        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};


        const face =
            analysis.face_shape ||
            data.face_shape ||
            {};


        const eyes =
            analysis.eye_analysis ||
            data.eye_analysis ||
            {};


        const lips =
            analysis.lip_analysis ||
            data.lip_analysis ||
            {};


        const recommendations =
            data.recommendations ||
            data.personalized_recommendations ||
            analysis.recommendations ||
            {};


        const score =
            findNumericValue(
                data,
                [
                    "beauty_score",
                    "beautyScore",
                    "overall_score",
                    "overallScore"
                ]
            );


        const realAI =
            data.real_ai === true ||
            data.real_ai_analysis === true ||
            data.analysis_mode === "REAL_AI" ||
            data.metadata?.analysis_mode === "REAL_AI";


        const safe =
            value =>
                escapeHTML(
                    formatBackendValue(
                        value ?? "--"
                    )
                );


        const recommendationRows =
            Object.entries(
                recommendations
            )
            .map(
                ([key, value]) =>
                    `<tr>
                        <th>${safe(
                            key
                        )}</th>
                        <td>${safe(
                            value
                        )}</td>
                    </tr>`
            )
            .join("");


        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Makeup Analysis Report</title>
<style>
body{
    font-family:Arial,Helvetica,sans-serif;
    margin:0;
    padding:40px;
    background:#f7f4fb;
    color:#202024;
}
.report{
    max-width:900px;
    margin:auto;
    background:#fff;
    padding:36px;
    border-radius:20px;
    box-shadow:0 15px 50px rgba(0,0,0,.10);
}
h1{margin-top:0;color:#b02bdc}
h2{margin-top:30px;color:#7d2db5}
.badge{
    display:inline-block;
    padding:7px 12px;
    border-radius:999px;
    background:#eee6ff;
    color:#7625a8;
    font-weight:700;
}
.score{
    font-size:42px;
    font-weight:800;
    margin:12px 0;
}
table{
    width:100%;
    border-collapse:collapse;
    margin-top:12px;
}
th,td{
    text-align:left;
    padding:11px;
    border-bottom:1px solid #eee;
    vertical-align:top;
}
th{
    width:30%;
    background:#faf7fd;
}
.note{
    color:#666;
    font-size:13px;
    margin-top:30px;
}
</style>
</head>
<body>
<div class="report">
<h1>AI Makeup Analysis Report</h1>
<p>
<span class="badge">
${realAI ? "REAL AI ANALYSIS VERIFIED" : "AI ANALYSIS"}
</span>
</p>

<h2>Overall Result</h2>
<div class="score">
${score === null ? "--" : `${Math.round(score)}%`}
</div>

<h2>Skin Analysis</h2>
<table>
<tr><th>Skin Type</th><td>${safe(
    skin.skin_type ||
    skin.type
)}</td></tr>
<tr><th>Skin Tone</th><td>${safe(
    skin.skin_tone ||
    skin.tone
)}</td></tr>
<tr><th>Undertone</th><td>${safe(
    skin.undertone
)}</td></tr>
<tr><th>Acne</th><td>${safe(
    skin.acne_level ||
    skin.acne
)}</td></tr>
<tr><th>Dark Circles</th><td>${safe(
    skin.dark_circles ||
    eyes.dark_circles
)}</td></tr>
</table>

<h2>Face Analysis</h2>
<table>
<tr><th>Face Shape</th><td>${safe(
    face.face_shape ||
    face.shape ||
    face.label
)}</td></tr>
<tr><th>Eye Shape</th><td>${safe(
    eyes.eye_shape ||
    eyes.shape
)}</td></tr>
<tr><th>Eye Color</th><td>${safe(
    eyes.eye_color ||
    eyes.color
)}</td></tr>
<tr><th>Lip Shape</th><td>${safe(
    lips.lip_shape ||
    lips.shape
)}</td></tr>
<tr><th>Lip Color</th><td>${safe(
    lips.lip_color ||
    lips.color
)}</td></tr>
</table>

<h2>Personalized Makeup Recommendations</h2>
<table>
${recommendationRows ||
    "<tr><td>No recommendation data was returned by the AI backend.</td></tr>"}
</table>

<p class="note">
This report contains the analysis data returned by the AI backend.
The frontend does not invent or alter AI predictions.
Generated: ${escapeHTML(
    new Date().toLocaleString()
)}
</p>
</div>
</body>
</html>`;

    }


    /* ======================================================
       ESCAPE REPORT HTML
    ====================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* ======================================================
       SAVE ANALYSIS
    ====================================================== */

    async function saveAnalysis() {

        if (
            !state.analysisResult
        ) {

            showToast(
                "Complete AI analysis before saving.",
                "warning"
            );


            return;

        }


        /*
         * If backend exposes a save
         * endpoint, use it.
         */
        const endpoint =
            CONFIG.API_BASE_URL
                .replace(
                    /\/+$/,
                    ""
                ) +
            "/save";


        try {

            const response =
                await fetch(
                    endpoint,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                state.analysisResult
                            )
                    }
                );


            const data =
                await parseJSONResponse(
                    response
                );


            if (
                response.ok &&
                data?.success !== false
            ) {

                showToast(
                    data?.message ||
                    "Analysis saved successfully.",
                    "success"
                );


                return;

            }


            /*
             * If backend save endpoint is
             * unavailable, save the genuine
             * analysis response locally.
             *
             * No AI data is modified.
             */
            saveLocalAnalysis();

        } catch (error) {

            console.warn(
                "Backend save unavailable:",
                error
            );


            saveLocalAnalysis();

        }

    }


    /* ======================================================
       SAVE LOCAL ANALYSIS
    ====================================================== */

    function saveLocalAnalysis() {

        const saved =
            readStorageArray(
                "saved-ai-analyses"
            );


        saved.unshift({

            id:
                createID(),

            savedAt:
                new Date().toISOString(),

            analysis:
                state.analysisResult

        });


        saved.splice(
            20
        );


        writeStorage(
            "saved-ai-analyses",
            saved
        );


        showToast(
            "The genuine AI analysis has been saved on this device.",
            "success"
        );

    }


    /* ======================================================
       SHARE ANALYSIS
    ====================================================== */

    async function shareAnalysis() {

        if (
            !state.analysisResult
        ) {

            showToast(
                "Complete AI analysis before sharing.",
                "warning"
            );


            return;

        }


        const shareData = {

            title:
                "AI Makeup Analysis",

            text:
                createShareSummary(),

            url:
                window.location.href

        };


        try {

            if (
                typeof navigator.share ===
                "function"
            ) {

                await navigator.share(
                    shareData
                );


                return;

            }


            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText ===
                "function"
            ) {

                await navigator.clipboard.writeText(
                    shareData.text +
                    "\n" +
                    shareData.url
                );


                showToast(
                    "Analysis summary copied to clipboard.",
                    "success"
                );


                return;

            }


            showToast(
                "Sharing is not supported by this browser.",
                "warning"
            );

        } catch (error) {

            if (
                error?.name ===
                "AbortError"
            ) {

                return;

            }


            console.error(
                "Share error:",
                error
            );


            showToast(
                "Unable to share the analysis.",
                "error"
            );

        }

    }


    /* ======================================================
       SHARE SUMMARY
    ====================================================== */

    function createShareSummary() {

        const data =
            state.analysisResult;


        const analysis =
            getAnalysisObject(
                data
            );


        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};


        const face =
            firstValue(
                analysis.face_shape,
                data.face_shape
            );


        const skinType =
            firstValue(
                skin.skin_type,
                skin.type
            );


        const score =
            findNumericValue(
                data,
                [
                    "beauty_score",
                    "beautyScore"
                ]
            );


        return [
            "AI Makeup Analysis",
            `Skin Type: ${skinType || "--"}`,
            `Face Shape: ${face || "--"}`,
            `Beauty Score: ${
                score === null
                    ? "--"
                    : Math.round(score)
            }`
        ].join(
            "\n"
        );

    }


    /* ======================================================
       PART 2 END
    ====================================================== */
        /* ======================================================
       LIVE CAMERA
    ====================================================== */

    async function openLiveCamera(event) {

        if (event) {
            event.preventDefault();
        }


        /*
         * Browser camera API availability.
         */
        if (
            !navigator.mediaDevices ||
            typeof navigator.mediaDevices.getUserMedia !==
                "function"
        ) {

            showToast(
                "Live camera is not supported by this browser.",
                "error"
            );

            return;
        }


        /*
         * Stop previous camera if any.
         */
        closeLiveCamera();


        try {

            /*
             * Request front-facing camera.
             */
            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "user"
                        },

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }
                    },

                    audio: false

                });


            state.cameraStream =
                stream;


            /*
             * Create camera UI.
             */
            createCameraModal();


            /*
             * Start video stream.
             */
            const video =
                $("liveCameraVideo");


            if (video) {

                video.srcObject =
                    stream;


                try {

                    await video.play();

                } catch (error) {

                    console.warn(
                        "Camera autoplay was blocked:",
                        error
                    );

                }

            }

        } catch (error) {

            console.error(
                "LIVE CAMERA ERROR:",
                error
            );


            let message =
                "Unable to access the camera.";


            if (
                error?.name ===
                "NotAllowedError"
            ) {

                message =
                    "Camera permission was denied. Please allow camera access in your browser.";

            } else if (
                error?.name ===
                "NotFoundError"
            ) {

                message =
                    "No camera was found on this device.";

            } else if (
                error?.name ===
                "NotReadableError"
            ) {

                message =
                    "The camera is already being used by another application.";

            }


            showToast(
                message,
                "error"
            );

        }

    }


    /* ======================================================
       CREATE CAMERA MODAL
    ====================================================== */

    function createCameraModal() {

        /*
         * Remove old modal if present.
         */
        closeExistingCameraModal();


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "liveCameraModal";


        modal.className =
            "live-camera-modal";


        modal.innerHTML = `
            <div class="live-camera-backdrop">

                <div class="live-camera-container">

                    <div class="live-camera-header">

                        <div>

                            <h2>
                                Live Camera
                            </h2>

                            <p>
                                Position your face inside the frame.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="live-camera-close"
                            id="closeLiveCameraBtn"
                            aria-label="Close camera"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    <div class="live-camera-preview">

                        <video
                            id="liveCameraVideo"
                            autoplay
                            muted
                            playsinline
                        ></video>


                        <div
                            class="camera-face-guide"
                            aria-hidden="true"
                        ></div>

                    </div>


                    <div class="live-camera-controls">

                        <button
                            type="button"
                            class="camera-capture-btn"
                            id="captureCameraBtn"
                        >
                            <i class="fa-solid fa-camera"></i>

                            Capture Photo

                        </button>


                        <button
                            type="button"
                            class="camera-cancel-btn"
                            id="cancelCameraBtn"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>
        `;


        document.body.appendChild(
            modal
        );


        state.cameraModal =
            modal;


        /*
         * Close button.
         */
        $("closeLiveCameraBtn")
            ?.addEventListener(
                "click",
                closeLiveCamera
            );


        /*
         * Cancel button.
         */
        $("cancelCameraBtn")
            ?.addEventListener(
                "click",
                closeLiveCamera
            );


        /*
         * Capture button.
         */
        $("captureCameraBtn")
            ?.addEventListener(
                "click",
                captureCameraImage
            );


        /*
         * Escape key.
         */
        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    modal
                ) {

                    closeLiveCamera();

                }

            }
        );

    }


    /* ======================================================
       CAPTURE LIVE CAMERA IMAGE
    ====================================================== */

    function captureCameraImage() {

        const video =
            $("liveCameraVideo");


        if (!video) {

            showToast(
                "Camera preview is unavailable.",
                "error"
            );

            return;
        }


        /*
         * Video must have actual dimensions.
         */
        if (
            !video.videoWidth ||
            !video.videoHeight
        ) {

            showToast(
                "Camera is not ready yet. Please wait a moment.",
                "warning"
            );

            return;
        }


        /*
         * Create canvas with actual
         * camera resolution.
         */
        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            video.videoWidth;


        canvas.height =
            video.videoHeight;


        const context =
            canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );


        if (!context) {

            showToast(
                "Unable to capture the camera image.",
                "error"
            );

            return;
        }


        /*
         * Draw current camera frame.
         */
        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
         * Convert to JPEG.
         */
        canvas.toBlob(
            (blob) => {

                if (!blob) {

                    showToast(
                        "Camera image could not be created.",
                        "error"
                    );

                    return;
                }


                /*
                 * Create real File object.
                 */
                const file =
                    new File(
                        [blob],
                        `camera-${Date.now()}.jpg`,
                        {
                            type:
                                "image/jpeg",

                            lastModified:
                                Date.now()
                        }
                    );


                /*
                 * Close camera first.
                 */
                closeLiveCamera();


                /*
                 * Send captured image
                 * through the same image
                 * pipeline as Browse/Drag & Drop.
                 */
                handleImage(
                    file
                );


                /*
                 * Synchronize hidden file input
                 * where browser permits it.
                 */
                try {

                    if (
                        els.imageInput
                    ) {

                        const transfer =
                            new DataTransfer();


                        transfer.items.add(
                            file
                        );


                        els.imageInput.files =
                            transfer.files;

                    }

                } catch (error) {

                    console.debug(
                        "Camera file-input synchronization skipped:",
                        error
                    );

                }


                showToast(
                    "Photo captured successfully.",
                    "success"
                );

            },
            "image/jpeg",
            0.92
        );

    }


    /* ======================================================
       CLOSE LIVE CAMERA
    ====================================================== */

    function closeLiveCamera() {

        /*
         * Stop all camera tracks.
         */
        if (
            state.cameraStream
        ) {

            state.cameraStream
                .getTracks()
                .forEach(
                    (track) => {

                        try {

                            track.stop();

                        } catch (error) {

                            console.debug(
                                "Camera track stop error:",
                                error
                            );

                        }

                    }
                );


            state.cameraStream =
                null;

        }


        closeExistingCameraModal();

    }


    /* ======================================================
       CLOSE CAMERA MODAL ONLY
    ====================================================== */

    function closeExistingCameraModal() {

        const modal =
            state.cameraModal ||
            $("liveCameraModal");


        if (modal) {

            modal.remove();

        }


        state.cameraModal =
            null;

    }


    /* ======================================================
       BACKEND HEALTH CHECK
    ====================================================== */

    async function checkBackendHealth() {

        if (
            !els.backendStatus
        ) {

            return;

        }


        /*
         * Derive:
         *
         * http://127.0.0.1:5000/api/analysis/
         *
         * ->
         *
         * http://127.0.0.1:5000/api/analysis/health
         */
        const healthURL =
            CONFIG.API_BASE_URL
                .replace(
                    /\/+$/,
                    ""
                ) +
            "/health";


        setBackendStatus(
            "Checking AI backend...",
            "checking"
        );


        try {

            const controller =
                new AbortController();


            const timer =
                setTimeout(
                    () => {
                        controller.abort();
                    },
                    10000
                );


            const response =
                await fetch(
                    healthURL,
                    {
                        method:
                            "GET",

                        cache:
                            "no-store",

                        signal:
                            controller.signal
                    }
                );


            clearTimeout(
                timer
            );


            const data =
                await parseJSONResponse(
                    response
                );


            if (
                response.ok &&
                data?.success !== false
            ) {

                setBackendStatus(
                    "AI Backend Online",
                    "online"
                );


                return;

            }


            setBackendStatus(
                "AI Backend Error",
                "error"
            );


        } catch (error) {

            console.warn(
                "AI backend health check failed:",
                error
            );


            setBackendStatus(
                "AI Backend Offline",
                "offline"
            );

        }

    }


    /* ======================================================
       BACKEND STATUS UI
    ====================================================== */

    function setBackendStatus(
        message,
        stateName
    ) {

        if (
            !els.backendStatus
        ) {

            return;

        }


        els.backendStatus.textContent =
            message;


        els.backendStatus.dataset.status =
            stateName;


        els.backendStatus.classList.remove(
            "online",
            "offline",
            "error",
            "checking"
        );


        els.backendStatus.classList.add(
            stateName
        );

    }


    /* ======================================================
       PROCESSING UI
    ====================================================== */

    function updateProcessing(
        percent,
        title,
        message
    ) {

        const safePercent =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        percent
                    ) || 0
                )
            );


        /*
         * Progress bar.
         */
        if (
            els.progressFill
        ) {

            els.progressFill.style.width =
                `${safePercent}%`;

        }


        /*
         * Processing title.
         */
        if (
            els.processingStatus
        ) {

            els.processingStatus.textContent =
                title || "";

        }


        /*
         * Processing description.
         */
        if (
            els.progressText
        ) {

            els.progressText.textContent =
                message || "";

        }

    }


    /* ======================================================
       ANALYSIS BUTTON LOADING STATE
    ====================================================== */

    function setAnalyzing(
        analyzing
    ) {

        if (
            !els.analyzeBtn
        ) {

            return;

        }


        if (
            analyzing
        ) {

            if (
                !els.analyzeBtn.dataset.originalText
            ) {

                els.analyzeBtn.dataset.originalText =
                    els.analyzeBtn.textContent.trim();

            }


            els.analyzeBtn.disabled =
                true;


            els.analyzeBtn.classList.add(
                "loading"
            );


            els.analyzeBtn.innerHTML =
                `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Analyzing with AI...
                `;

        } else {

            els.analyzeBtn.disabled =
                !state.selectedFile;


            els.analyzeBtn.classList.remove(
                "loading"
            );


            els.analyzeBtn.textContent =
                els.analyzeBtn.dataset.originalText ||
                "Analyze Face";

        }

    }


    /* ======================================================
       PARSE JSON RESPONSE
    ====================================================== */

    async function parseJSONResponse(
        response
    ) {

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            return await response.json();

        }


        /*
         * Backend should return JSON.
         * If it doesn't, preserve the
         * actual server text for debugging.
         */
        const text =
            await response.text();


        return {

            success:
                false,

            message:
                text ||
                "Server returned an empty response."

        };

    }


    /* ======================================================
       GET ANALYSIS OBJECT
    ====================================================== */

    function getAnalysisObject(
        data
    ) {

        if (
            !data ||
            typeof data !==
                "object"
        ) {

            return {};

        }


        return (
            data.analysis ||
            data.result ||
            data.data ||
            data
        );

    }


    /* ======================================================
       FIND NUMERIC VALUE
    ====================================================== */

    function findNumericValue(
        object,
        keys
    ) {

        if (
            !object ||
            typeof object !==
                "object"
        ) {

            return null;

        }


        /*
         * Current level.
         */
        for (
            const key of keys
        ) {

            if (
                Object.prototype.hasOwnProperty.call(
                    object,
                    key
                )
            ) {

                const value =
                    Number(
                        object[key]
                    );


                if (
                    Number.isFinite(
                        value
                    )
                ) {

                    return value;

                }

            }

        }


        /*
         * Nested search.
         */
        for (
            const value of Object.values(
                object
            )
        ) {

            if (
                value &&
                typeof value ===
                    "object" &&
                !Array.isArray(
                    value
                )
            ) {

                const nested =
                    findNumericValue(
                        value,
                        keys
                    );


                if (
                    nested !== null
                ) {

                    return nested;

                }

            }

        }


        return null;

    }


    /* ======================================================
       FIND CONFIDENCE
    ====================================================== */

    function findConfidence(
        data
    ) {

        const value =
            findNumericValue(
                data,
                [
                    "confidence",
                    "confidence_score",
                    "confidenceScore"
                ]
            );


        if (
            value === null
        ) {

            return null;

        }


        /*
         * Backend may return:
         *
         * 0.94
         *
         * or
         *
         * 94
         */
        if (
            value > 1
        ) {

            return (
                value /
                100
            );

        }


        return Math.max(
            0,
            Math.min(
                1,
                value
            )
        );

    }


    /* ======================================================
       FIRST AVAILABLE VALUE
    ====================================================== */

    function firstValue(
        ...values
    ) {

        for (
            const value of values
        ) {

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {

                continue;

            }


            if (
                typeof value ===
                    "object"
            ) {

                const nested =
                    extractObjectValue(
                        value
                    );


                if (
                    nested !== null &&
                    nested !== undefined &&
                    nested !== ""
                ) {

                    return nested;

                }


                continue;

            }


            return value;

        }


        return null;

    }


    /* ======================================================
       EXTRACT OBJECT VALUE
    ====================================================== */

    function extractObjectValue(
        value
    ) {

        if (
            !value ||
            typeof value !==
                "object"
        ) {

            return value;

        }


        const keys = [

            "value",

            "label",

            "name",

            "result",

            "level",

            "category",

            "status",

            "text"

        ];


        for (
            const key of keys
        ) {

            if (
                value[key] !==
                    undefined &&
                value[key] !==
                    null &&
                value[key] !==
                    ""
            ) {

                return value[key];

            }

        }


        return null;

    }


    /* ======================================================
       FORMAT BACKEND VALUE
    ====================================================== */

    function formatBackendValue(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        if (
            typeof value ===
                "string" ||
            typeof value ===
                "number" ||
            typeof value ===
                "boolean"
        ) {

            return String(
                value
            );

        }


        if (
            Array.isArray(
                value
            )
        ) {

            return value
                .map(
                    item =>
                        formatBackendValue(
                            item
                        )
                )
                .filter(
                    Boolean
                )
                .join(
                    ", "
                );

        }


        const preferred =
            extractObjectValue(
                value
            );


        if (
            preferred !== null
        ) {

            return String(
                preferred
            );

        }


        /*
         * Don't expose [object Object].
         */
        return Object.entries(
            value
        )
        .map(
            ([key, item]) =>
                `${humanize(
                    key
                )}: ${formatBackendValue(
                    item
                )}`
        )
        .join(
            " • "
        );

    }


    /* ======================================================
       NUMERIC TEXT
    ====================================================== */

    function setNumericText(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            element.textContent =
                "--";

            return;

        }


        const number =
            Number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
        ) {

            element.textContent =
                "--";

            return;

        }


        element.textContent =
            `${Math.round(
                number
            )}%`;

    }


    /* ======================================================
       SET TEXT
    ====================================================== */

    function setText(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        const display =
            extractObjectValue(
                value
            );


        element.textContent =
            display === null ||
            display === undefined ||
            display === ""
                ? "--"
                : String(
                    display
                );

    }


    /* ======================================================
       ANIMATE NUMBER
    ====================================================== */

    function animateNumber(
        element,
        target,
        suffix = ""
    ) {

        if (!element) {
            return;
        }


        const finalValue =
            Math.round(
                Number(
                    target
                )
            );


        if (
            !Number.isFinite(
                finalValue
            )
        ) {

            return;

        }


        /*
         * Cancel previous animation.
         */
        if (
            element._animationTimer
        ) {

            clearInterval(
                element._animationTimer
            );

        }


        let current =
            0;


        element.textContent =
            `0${suffix}`;


        element._animationTimer =
            setInterval(
                () => {

                    current +=
                        Math.max(
                            1,
                            Math.ceil(
                                (
                                    finalValue -
                                    current
                                ) / 8
                            )
                        );


                    if (
                        current >=
                        finalValue
                    ) {

                        current =
                            finalValue;


                        clearInterval(
                            element._animationTimer
                        );


                        element._animationTimer =
                            null;

                    }


                    element.textContent =
                        `${current}${suffix}`;

                },
                20
            );

    }


    /* ======================================================
       NUMERIC OR ZERO
    ====================================================== */

    function numericOrZero(
        value
    ) {

        const number =
            Number(
                value
            );


        return Number.isFinite(
            number
        )
            ? number
            : 0;

    }


    /* ======================================================
       CREATE UNIQUE ID
    ====================================================== */

    function createID() {

        if (
            typeof crypto !==
                "undefined" &&
            typeof crypto.randomUUID ===
                "function"
        ) {

            return crypto.randomUUID();

        }


        return (
            Date.now().toString(
                36
            ) +
            Math.random()
                .toString(
                    36
                )
                .slice(
                    2
                )
        );

    }


    /* ======================================================
       FORMAT DATE
    ====================================================== */

    function formatDate(
        value
    ) {

        try {

            const date =
                new Date(
                    value
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return "--";

            }


            return date.toLocaleString(
                undefined,
                {
                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"
                }
            );

        } catch (_) {

            return "--";

        }

    }


    /* ======================================================
       HUMANIZE TEXT
    ====================================================== */

    function humanize(
        value
    ) {

        return String(
            value || ""
        )
        .replace(
            /[_-]+/g,
            " "
        )
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

    }


    /* ======================================================
       CAPITALIZE
    ====================================================== */

    function capitalize(
        value
    ) {

        const text =
            String(
                value || ""
            );


        return (
            text.charAt(
                0
            ).toUpperCase() +
            text.slice(
                1
            )
        );

    }


    /* ======================================================
       FIND ELEMENTS BY IDs
    ====================================================== */

    function findElementsByIDs(
        ids
    ) {

        return ids
            .map(
                id => $(id)
            )
            .filter(
                Boolean
            );

    }


    /* ======================================================
       ESCAPE HTML
    ====================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ??
            ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* ======================================================
       LOCAL STORAGE READ
    ====================================================== */

    function readStorageArray(
        key
    ) {

        try {

            const raw =
                localStorage.getItem(
                    key
                );


            if (!raw) {

                return [];

            }


            const parsed =
                JSON.parse(
                    raw
                );


            return Array.isArray(
                parsed
            )
                ? parsed
                : [];

        } catch (error) {

            console.warn(
                "Storage read failed:",
                error
            );


            return [];

        }

    }


    /* ======================================================
       LOCAL STORAGE WRITE
    ====================================================== */

    function writeStorage(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(
                    value
                )
            );


            return true;

        } catch (error) {

            console.warn(
                "Storage write failed:",
                error
            );


            return false;

        }

    }


    /* ======================================================
       DOWNLOAD HTML FILE
    ====================================================== */

    function downloadHTMLFile(
        filename,
        content
    ) {

        const blob =
            new Blob(
                [
                    String(
                        content ||
                        ""
                    )
                ],
                {
                    type:
                        "text/html;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.download =
            filename;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        setTimeout(
            () =>
                URL.revokeObjectURL(
                    url
                ),
            1000
        );

    }


    /* ======================================================
       DOWNLOAD TEXT FILE
    ====================================================== */

    function downloadTextFile(
        filename,
        content
    ) {

        const blob =
            new Blob(
                [
                    String(
                        content ||
                        ""
                    )
                ],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            filename;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }


    /* ======================================================
       DOWNLOAD JSON
    ====================================================== */

    function downloadJSON(
        filename,
        data
    ) {

        const content =
            JSON.stringify(
                data,
                null,
                2
            );


        const blob =
            new Blob(
                [content],
                {
                    type:
                        "application/json;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            filename;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }


    /* ======================================================
       FRIENDLY ERROR
    ====================================================== */

    function getFriendlyError(
        error
    ) {

        const message =
            String(
                error?.message ||
                ""
            );


        const lower =
            message.toLowerCase();


        /*
         * Network error.
         */
        if (
            lower.includes(
                "failed to fetch"
            ) ||
            lower.includes(
                "networkerror"
            ) ||
            lower.includes(
                "network error"
            )
        ) {

            return (
                "AI backend is not reachable. " +
                "Start Flask on http://127.0.0.1:5000 and make sure the page is using the correct backend URL."
            );

        }


        /*
         * Timeout.
         */
        if (
            lower.includes(
                "timeout"
            ) ||
            lower.includes(
                "aborted"
            )
        ) {

            return (
                "The AI server took too long to respond. Check the Flask terminal and AI model loading."
            );

        }


        /*
         * Real AI verification.
         */
        if (
            lower.includes(
                "not marked as a verified real-ai"
            )
        ) {

            return (
                "The backend did not return a verified REAL_AI result. No fake prediction was displayed."
            );

        }


        /*
         * No facial analysis.
         */
        if (
            lower.includes(
                "does not contain facial analysis"
            )
        ) {

            return (
                "The AI backend did not detect enough facial analysis data. Please upload a clear, front-facing face image."
            );

        }


        /*
         * Camera.
         */
        if (
            lower.includes(
                "camera"
            )
        ) {

            return message;

        }


        return (
            message ||
            "Something went wrong while processing the request."
        );

    }


    /* ======================================================
       TOAST SYSTEM
    ====================================================== */

    function showToast(
        message,
        type = "info"
    ) {

        /*
         * Persist meaningful success/error/warning events in the
         * real notification center. "info" toasts remain transient.
         */
        if (
            type === "success" ||
            type === "error" ||
            type === "warning"
        ) {
            addNotification(
                "AI Makeup Analysis",
                String(message || ""),
                type
            );
        }


        const container =
            getToastContainer();


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `ai-toast ai-toast-${type}`;


        toast.setAttribute(
            "role",
            "status"
        );


        const icon =
            type === "success"
                ? "fa-circle-check"

                : type === "error"
                    ? "fa-circle-exclamation"

                    : type === "warning"
                        ? "fa-triangle-exclamation"

                        : "fa-circle-info";


        toast.innerHTML =
            `
                <div class="ai-toast-icon">
                    <i class="fa-solid ${icon}"></i>
                </div>

                <div class="ai-toast-message">
                    ${escapeHTML(
                        message
                    )}
                </div>

                <button
                    type="button"
                    class="ai-toast-close"
                    aria-label="Close notification"
                >
                    ×
                </button>
            `;


        container.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "show"
                );

            }
        );


        const remove =
            () => {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    () => {

                        toast.remove();

                    },
                    250
                );

            };


        toast
            .querySelector(
                ".ai-toast-close"
            )
            ?.addEventListener(
                "click",
                remove
            );


        setTimeout(
            remove,
            5000
        );

    }


    /* ======================================================
       GET TOAST CONTAINER
    ====================================================== */

    function getToastContainer() {

        let container =
            $("aiToastContainer");


        if (container) {

            return container;

        }


        container =
            document.createElement(
                "div"
            );


        container.id =
            "aiToastContainer";


        container.className =
            "ai-toast-container";


        document.body.appendChild(
            container
        );


        return container;

    }


    /* ======================================================
       RUNTIME STYLES
    ====================================================== */

    function ensureRuntimeStyles() {

        if (
            $("aiMakeupRuntimeStyles")
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "aiMakeupRuntimeStyles";


        style.textContent = `

            /* ==========================================
               TOAST
            ========================================== */

            .ai-toast-container {

                position: fixed;

                top: 24px;

                right: 24px;

                z-index: 99999;

                display: flex;

                flex-direction: column;

                gap: 12px;

                max-width: 380px;

                pointer-events: none;

            }


            .ai-toast {

                display: flex;

                align-items: center;

                gap: 12px;

                min-width: 300px;

                max-width: 380px;

                padding: 14px 16px;

                border-radius: 14px;

                background: #ffffff;

                color: #222222;

                box-shadow:
                    0 14px 40px
                    rgba(
                        0,
                        0,
                        0,
                        0.18
                    );

                opacity: 0;

                transform:
                    translateY(-10px)
                    translateX(20px);

                transition:
                    opacity .25s ease,
                    transform .25s ease;

                pointer-events: auto;

            }


            .ai-toast.show {

                opacity: 1;

                transform:
                    translateY(0)
                    translateX(0);

            }


            .ai-toast-icon {

                font-size: 20px;

            }


            .ai-toast-message {

                flex: 1;

                line-height: 1.4;

                font-size: 14px;

            }


            .ai-toast-close {

                border: 0;

                background: transparent;

                cursor: pointer;

                font-size: 20px;

                color: inherit;

            }


            /* ==========================================
               DRAG & DROP
            ========================================== */

            .upload-area.dragover,
            .upload-area.dragging,
            #dropArea.dragover,
            #dropArea.dragging {

                border-color:
                    #a855f7 !important;

                background:
                    rgba(
                        168,
                        85,
                        247,
                        0.08
                    ) !important;

                transform:
                    scale(1.01);

            }


            /* ==========================================
               CAMERA
            ========================================== */

            .live-camera-modal {

                position: fixed;

                inset: 0;

                z-index: 100000;

            }


            .live-camera-backdrop {

                width: 100%;

                height: 100%;

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                background:
                    rgba(
                        0,
                        0,
                        0,
                        0.82
                    );

            }


            .live-camera-container {

                width: min(
                    760px,
                    100%
                );

                overflow: hidden;

                border-radius: 22px;

                background:
                    #ffffff;

                box-shadow:
                    0 30px 80px
                    rgba(
                        0,
                        0,
                        0,
                        0.35
                    );

            }


            .live-camera-header {

                display: flex;

                justify-content:
                    space-between;

                align-items:
                    center;

                padding:
                    18px 20px;

            }


            .live-camera-header h2 {

                margin:
                    0 0 4px;

            }


            .live-camera-header p {

                margin: 0;

                color:
                    #777777;

                font-size:
                    13px;

            }


            .live-camera-close {

                width: 42px;

                height: 42px;

                border: 0;

                border-radius: 50%;

                cursor: pointer;

                background:
                    #f2f2f2;

                font-size:
                    18px;

            }


            .live-camera-preview {

                position: relative;

                width: 100%;

                aspect-ratio:
                    16 / 10;

                overflow: hidden;

                background:
                    #000000;

            }


            .live-camera-preview video {

                width: 100%;

                height: 100%;

                object-fit: cover;

            }


            .camera-face-guide {

                position: absolute;

                left: 50%;

                top: 50%;

                width: 42%;

                height: 72%;

                transform:
                    translate(
                        -50%,
                        -50%
                    );

                border:
                    2px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.85
                    );

                border-radius:
                    48%;

                pointer-events:
                    none;

            }


            .live-camera-controls {

                display: flex;

                justify-content:
                    center;

                gap: 12px;

                padding: 18px;

            }


            .camera-capture-btn,
            .camera-cancel-btn {

                border: 0;

                border-radius: 12px;

                padding:
                    12px 20px;

                cursor: pointer;

                font-weight:
                    600;

            }


            .camera-capture-btn {

                background:
                    #8b5cf6;

                color:
                    #ffffff;

            }


            .camera-cancel-btn {

                background:
                    #eeeeee;

                color:
                    #333333;

            }


            /* ==========================================
               DARK MODE FALLBACK
            ========================================== */

            body.dark-mode {

                background:
                    #111318;

                color:
                    #f5f5f5;

            }


            body.dark-mode
            .ai-toast {

                background:
                    #20232a;

                color:
                    #ffffff;

            }


            body.dark-mode
            .camera-cancel-btn {

                background:
                    #30343c;

                color:
                    #ffffff;

            }


            body.dark-mode
            .live-camera-container {

                background:
                    #181b21;

                color:
                    #ffffff;

            }


            body.dark-mode
            .live-camera-header p {

                color:
                    #b7b7b7;

            }


            body.dark-mode
            .live-camera-close {

                background:
                    #30343c;

                color:
                    #ffffff;

            }


            /* ==========================================
               NOTIFICATION PANEL
            ========================================== */

            .notification-panel {

                position: fixed;

                top: 78px;

                right: 24px;

                width: min(
                    390px,
                    calc(
                        100vw - 32px
                    )
                );

                max-height:
                    70vh;

                overflow: hidden;

                z-index:
                    99990;

                border-radius:
                    18px;

                background:
                    #ffffff;

                color:
                    #222222;

                box-shadow:
                    0 20px 60px
                    rgba(
                        0,
                        0,
                        0,
                        0.2
                    );

            }


            .notification-header {

                display: flex;

                align-items:
                    center;

                justify-content:
                    space-between;

                padding:
                    16px 18px;

                border-bottom:
                    1px solid
                    #eeeeee;

            }


            .notification-close {

                border: 0;

                background:
                    transparent;

                cursor:
                    pointer;

                font-size:
                    20px;

            }


            .notification-list {

                max-height:
                    52vh;

                overflow-y:
                    auto;

            }


            .notification-item {

                display: flex;

                gap: 12px;

                padding:
                    14px 16px;

                border-bottom:
                    1px solid
                    #eeeeee;

            }


            .notification-item.unread {

                background:
                    rgba(
                        139,
                        92,
                        246,
                        0.07
                    );

            }


            .notification-icon {

                width: 34px;

                height: 34px;

                display: flex;

                align-items:
                    center;

                justify-content:
                    center;

                border-radius:
                    50%;

                background:
                    #eee7ff;

                color:
                    #7c3aed;

                flex-shrink: 0;

            }


            .notification-content {

                min-width:
                    0;

            }


            .notification-content strong {

                display:
                    block;

                margin-bottom:
                    3px;

            }


            .notification-content p {

                margin:
                    0 0 5px;

                font-size:
                    13px;

                line-height:
                    1.4;

            }


            .notification-content small {

                color:
                    #888888;

                font-size:
                    11px;

            }


            .notification-footer {

                padding:
                    12px 16px;

            }


            .notification-footer button {

                width:
                    100%;

                padding:
                    9px;

                border:
                    0;

                border-radius:
                    9px;

                cursor:
                    pointer;

            }


            body.dark-mode
            .notification-panel {

                background:
                    #1c1f26;

                color:
                    #ffffff;

            }


            body.dark-mode
            .notification-header,

            body.dark-mode
            .notification-item {

                border-color:
                    #30343c;

            }


            body.dark-mode
            .notification-footer button {

                background:
                    #30343c;

                color:
                    #ffffff;

            }


            /* ==========================================
               MOBILE
            ========================================== */

            @media (
                max-width: 600px
            ) {

                .ai-toast-container {

                    top: 14px;

                    right: 14px;

                    left: 14px;

                    max-width: none;

                }


                .ai-toast {

                    min-width: 0;

                    width: 100%;

                }


                .live-camera-backdrop {

                    padding: 10px;

                }


                .live-camera-container {

                    border-radius:
                        16px;

                }


                .live-camera-controls {

                    flex-direction:
                        column;

                }


                .camera-capture-btn,
                .camera-cancel-btn {

                    width: 100%;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* ======================================================
       GLOBAL EVENTS
    ====================================================== */

    function initializeGlobalEvents() {

        /*
         * Escape closes camera and
         * notification panel.
         */
        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLiveCamera();


                    const panel =
                        $("notificationPanel");


                    if (panel) {

                        panel.hidden =
                            true;

                    }

                }

            }
        );


        /*
         * Close notification panel
         * when clicking outside.
         */
        document.addEventListener(
            "click",
            (event) => {

                const panel =
                    $("notificationPanel");


                if (
                    !panel ||
                    panel.hidden
                ) {

                    return;

                }


                const clickedNotificationButton =
                    els.notificationBtn &&
                    els.notificationBtn.contains(
                        event.target
                    );


                if (
                    clickedNotificationButton
                ) {

                    return;

                }


                if (
                    !panel.contains(
                        event.target
                    )
                ) {

                    panel.hidden =
                        true;

                }

            }
        );

    }


    /* ======================================================
       INITIALIZE GLOBAL EVENTS
    ====================================================== */

    initializeGlobalEvents();


    /* ======================================================
       START APPLICATION
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    } else {

        start();

    }


    /* ======================================================
       PUBLIC API
    ====================================================== */

    /*
     * Expose only useful functions.
     * Other code can call these without
     * accessing internal state.
     */

    window.MakeupAnalysis = {

        analyze:
            analyzeImage,

        reset:
            () => resetResults(true),

        openCamera:
            openLiveCamera,

        closeCamera:
            closeLiveCamera,

        toggleTheme:
            toggleTheme,

        addNotification:
            addNotification,

        getResult:
            () =>
                state.analysisResult,

        getSelectedFile:
            () =>
                state.selectedFile

    };


    /* ======================================================
       CLEANUP
    ====================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            /*
             * Stop camera.
             */
            closeLiveCamera();


            /*
             * Revoke main image.
             */
            revokePreviewURL();


            /*
             * Revoke makeup image.
             */
            if (
                state.makeupPreviewURL
            ) {

                URL.revokeObjectURL(
                    state.makeupPreviewURL
                );


                state.makeupPreviewURL =
                    null;

            }


            /*
             * Stop number animations.
             */
            document
                .querySelectorAll(
                    "[_animationTimer]"
                )
                .forEach(
                    element => {

                        if (
                            element._animationTimer
                        ) {

                            clearInterval(
                                element._animationTimer
                            );

                        }

                    }
                );

        }
    );

})();
