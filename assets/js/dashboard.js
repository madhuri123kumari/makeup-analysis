"use strict";

/*
 * AI Makeup Analysis Guide
 * Professional dashboard controller
 *
 * Requirements:
 *   - Flask backend running at http://127.0.0.1:5000
 *   - POST /api/analysis/              -> facial analysis
 *   - GET  /api/analysis/health        -> health check
 *
 * This file never invents analysis values or product recommendations.
 * All analysis/recommendation data comes from the backend response.
 */

(() => {
    "use strict";

    const CONFIG = Object.freeze({
        API_BASE_URL:
            window.MAKEUP_API_BASE_URL ||
            "http://127.0.0.1:5000/api/analysis/",
        MAX_IMAGE_SIZE: 10 * 1024 * 1024,
        ALLOWED_TYPES: Object.freeze([
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/bmp"
        ]),
        THEME_KEY: "makeup-dashboard-theme"
    });

    const state = {
        selectedFile: null,
        previewURL: null,
        analysisResult: null,
        isAnalyzing: false,
        beautyChart: null,
        initialized: false
    };

    const $ = (id) => document.getElementById(id);

    const els = {
        uploadBox: $("uploadBox"),
        imageInput: $("imageInput"),
        previewImage: $("previewImage"),
        analyzeBtn: $("analyzeBtn"),
        startAnalysisBtn: $("startAnalysisBtn"),

        skinType: $("skinType"),
        skinTone: $("skinTone"),
        undertone: $("undertone"),
        faceShape: $("faceShape"),
        acneLevel: $("acneLevel"),
        darkCircles: $("darkCircles"),
        eyeShape: $("eyeShape"),
        eyeColor: $("eyeColor"),
        lipShape: $("lipShape"),
        lipColor: $("lipColor"),
        confidence: $("confidence"),
        aiMethod: $("aiMethod"),

        beautyScore: $("beautyScore"),
        dashboardBeautyScore: $("dashboardBeautyScore"),
        dashboardSkinType: $("dashboardSkinType"),
        totalAnalysis: $("totalAnalysis"),

        progressFill: $("progressFill"),
        progressText: $("progressText"),
        progressCircle: $("progressCircle"),
        processingStatus: $("processingStatus"),

        beautyProgressScore: $("beautyProgressScore"),
        beautyProgressGrade: $("beautyProgressGrade"),
        beautySkinScore: $("beautySkinScore"),
        beautyEyesScore: $("beautyEyesScore"),
        beautyFaceScore: $("beautyFaceScore"),
        beautyLipsScore: $("beautyLipsScore"),
        beautyChart: $("beautyChart"),

        search: $("dashboardSearch"),
        notificationBtn: $("notificationBtn"),
        darkModeBtn: $("darkModeBtn"),
        resetBtn: $("resetBtn") || $("resetButton"),
        backendStatus: $("backendStatus"),
        history: $("analysisHistoryList") || $("historyList")
    };

    const PRODUCT_CARD_IDS = Object.freeze({
        cleanser: ["product-cleanser", "cleanser"],
        toner: ["product-toner", "toner"],
        moisturizer: ["product-moisturizer", "moisturizer"],
        sunscreen: ["product-sunscreen", "sunscreen"],
        primer: ["product-primer", "primer"],
        foundation: ["product-foundation", "foundation"],
        concealer: ["product-concealer", "concealer"],
        blush: ["product-blush", "blush"],
        contour: ["product-contour", "contour"],
        highlighter: ["product-highlighter", "highlighter"],
        eyeshadow: ["product-eyeshadow", "eyeshadow"],
        eyeliner: ["product-eyeliner", "eyeliner"],
        mascara: ["product-mascara", "mascara"],
        lipstick: ["product-lipstick", "lipstick"],
        setting_spray: [
            "product-setting_spray",
            "product-setting-spray",
            "setting_spray"
        ]
    });

    const LOCAL_PRODUCT_IMAGES = Object.freeze({
        cleanser: "assets/images/products/cleanser.jpg",
        toner: "assets/images/products/toner.jpg",
        moisturizer: "assets/images/products/moisturizer.jpg",
        sunscreen: "assets/images/products/sunscreen.jpg",
        primer: "assets/images/products/primer.jpg",
        foundation: "assets/images/products/foundation.jpg",
        concealer: "assets/images/products/concealer.jpg",
        blush: "assets/images/products/blush.jpg",
        contour: "assets/images/products/contour.jpg",
        highlighter: "assets/images/products/highlighter.jpg",
        eyeshadow: "assets/images/products/eyeshadow.jpg",
        eyeliner: "assets/images/products/eyeliner.jpg",
        mascara: "assets/images/products/mascara.jpg",
        lipstick: "assets/images/products/lipstick.jpg",
        setting_spray: "assets/images/products/setting_spray.jpg"
    });

    function start() {
        if (state.initialized) return;

        state.initialized = true;

        initializeUpload();
        initializeAnalysis();
        initializeTheme();
        initializeSearch();
        initializeNotifications();
        initializeReset();
        initializeNavigation();
        initializeChart();
        checkBackendHealth();

        updateProcessing(
            0,
            "Ready",
            "Upload a clear face image to start real AI analysis."
        );
    }

    function initializeUpload() {
        if (els.imageInput) {
            els.imageInput.addEventListener("change", (event) => {
                const file = event.target.files?.[0];

                if (file) {
                    handleImage(file);
                }
            });
        }

        if (!els.uploadBox) return;

        ["dragenter", "dragover"].forEach((eventName) => {
            els.uploadBox.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();

                els.uploadBox.classList.add("dragover");
            });
        });

        ["dragleave", "drop"].forEach((eventName) => {
            els.uploadBox.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();

                els.uploadBox.classList.remove("dragover");
            });
        });

        els.uploadBox.addEventListener("drop", (event) => {
            const file = event.dataTransfer?.files?.[0];

            if (file) {
                handleImage(file);
            }
        });
    }

    function handleImage(file) {
        if (!file) return;

        if (!CONFIG.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
            resetFileInput();

            showToast(
                "Please select a JPG, PNG, WEBP or BMP image.",
                "error"
            );

            return;
        }

        if (file.size > CONFIG.MAX_IMAGE_SIZE) {
            resetFileInput();

            showToast(
                "Image size must be less than 10 MB.",
                "error"
            );

            return;
        }

        state.selectedFile = file;
        state.analysisResult = null;

        revokePreviewURL();

        state.previewURL = URL.createObjectURL(file);

        setImage(
            els.previewImage,
            state.previewURL,
            "Uploaded face image"
        );

        if (els.uploadBox) {
            els.uploadBox.classList.add("has-image");
        }

        if (els.analyzeBtn) {
            els.analyzeBtn.disabled = false;
        }

        resetResults(false);

        updateProcessing(
            0,
            "Image Ready",
            "Your image is ready for real AI analysis."
        );

        showToast(
            "Image uploaded successfully.",
            "success"
        );
    }

    function setImage(image, src, alt) {
        if (!image) return;

        image.src = src;
        image.alt = alt;
        image.hidden = false;
        image.style.display = "block";
        image.style.visibility = "visible";
        image.style.opacity = "1";
    }

    function resetFileInput() {
        if (els.imageInput) {
            els.imageInput.value = "";
        }

        state.selectedFile = null;
        state.analysisResult = null;
    }

    function revokePreviewURL() {
        if (state.previewURL) {
            URL.revokeObjectURL(state.previewURL);
            state.previewURL = null;
        }
    }

    function initializeAnalysis() {
        if (!els.analyzeBtn) return;

        els.analyzeBtn.disabled = !state.selectedFile;

        els.analyzeBtn.addEventListener(
            "click",
            analyzeImage
        );

        if (els.startAnalysisBtn) {
            els.startAnalysisBtn.addEventListener(
                "click",
                () => {
                    els.uploadBox?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    setTimeout(
                        () => els.imageInput?.click(),
                        250
                    );
                }
            );
        }
    }

    async function analyzeImage() {
        if (!state.selectedFile) {
            showToast(
                "Please upload an image first.",
                "warning"
            );

            return;
        }

        if (state.isAnalyzing) return;

        state.isAnalyzing = true;

        setAnalyzing(true);

        try {
            const formData = new FormData();

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

            const response = await fetch(
                CONFIG.API_BASE_URL,
                {
                    method: "POST",
                    body: formData,
                    cache: "no-store"
                }
            );

            updateProcessing(
                45,
                "AI Processing",
                "Analyzing facial features and skin characteristics."
            );

            const data = await parseJSONResponse(
                response
            );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    `AI server returned HTTP ${response.status}.`
                );
            }

            if (data?.success === false) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Real AI analysis failed."
                );
            }

            validateAnalysisResponse(data);

            state.analysisResult = data;

            displayAnalysisResult(data);
            displayRecommendations(data);
            displayProducts(data);
            updateBeautyProgress(data);
            updateDashboardStats(data);
            updateAnalysisHistory(data);

            updateProcessing(
                100,
                "Analysis Completed",
                "Real AI facial analysis completed successfully."
            );

            showToast(
                "Real AI analysis completed successfully.",
                "success"
            );

            console.log(
                "REAL AI ANALYSIS RESULT:",
                data
            );

        } catch (error) {
            console.error(
                "REAL AI ANALYSIS ERROR:",
                error
            );

            const message = getFriendlyError(error);

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
            state.isAnalyzing = false;

            setAnalyzing(false);
        }
    }

    function validateAnalysisResponse(data) {
        if (!data || typeof data !== "object") {
            throw new Error(
                "The AI backend returned an empty response."
            );
        }

        const analysis = getAnalysisObject(data);

        const hasAnalysis = Boolean(
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

    function displayAnalysisResult(data) {
        const analysis = getAnalysisObject(data);

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
            analysis.eyes ||
            data.eye_analysis ||
            data.eyes ||
            {};

        const lips =
            analysis.lip_analysis ||
            analysis.lips ||
            data.lip_analysis ||
            data.lips ||
            {};

        setText(
            els.skinType,
            firstValue(
                skin.skin_type,
                skin.type,
                analysis.skin_type
            )
        );

        setText(
            els.skinTone,
            firstValue(
                skin.skin_tone,
                skin.tone,
                analysis.skin_tone
            )
        );

        setText(
            els.undertone,
            firstValue(
                skin.undertone,
                analysis.undertone
            )
        );

        setText(
            els.faceShape,
            firstValue(
                face.face_shape,
                face.shape,
                face.label,
                analysis.face_shape
            )
        );

        setText(
            els.acneLevel,
            firstValue(
                skin.acne_level,
                skin.acne,
                analysis.acne_level
            )
        );

        setText(
            els.darkCircles,
            firstValue(
                skin.dark_circles,
                eyes.dark_circles,
                analysis.dark_circles
            )
        );

        setText(
            els.eyeShape,
            firstValue(
                eyes.eye_shape,
                eyes.shape,
                eyes.eyeShape
            )
        );

        setText(
            els.eyeColor,
            firstValue(
                eyes.eye_color,
                eyes.color
            )
        );

        setText(
            els.lipShape,
            firstValue(
                lips.lip_shape,
                lips.shape
            )
        );

        setText(
            els.lipColor,
            firstValue(
                lips.lip_color,
                lips.color
            )
        );

        const confidence =
            findConfidence(data);

        if (els.confidence) {
            els.confidence.textContent =
                confidence === null
                    ? "--"
                    : `${Math.round(confidence * 100)}%`;
        }

        setText(
            els.aiMethod,
            firstValue(
                data.ai_method,
                data.method,
                data.model,
                analysis.ai_method
            )
        );

        const realAI =
            data.real_ai === true ||
            data.real_ai_analysis === true ||
            data.health_flags?.real_ai === true;

        document
            .querySelectorAll(
                "#aiStatus, #realAIStatus, .real-ai-status"
            )
            .forEach((element) => {
                element.textContent = realAI
                    ? "Real AI analysis verified"
                    : "AI analysis completed";

                element.classList.toggle(
                    "ai-verified",
                    realAI
                );
            });
    }

    function displayRecommendations(data) {
        const recommendations =
            data.recommendations ||
            data.personalized_recommendations ||
            data.recommendation_result ||
            data.analysis?.recommendations ||
            {};

        if (
            !recommendations ||
            typeof recommendations !== "object"
        ) {
            return;
        }

        const categories =
            Object.keys(PRODUCT_CARD_IDS);

        let displayed = 0;

        categories.forEach((category) => {
            const value =
                recommendations[category] ??
                recommendations[
                    category.replaceAll("_", "")
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

            elements.forEach((element) => {
                element.textContent =
                    formatBackendValue(value);
            });

            if (elements.length) {
                displayed += 1;
            }
        });

        const general =
            recommendations.general ||
            recommendations.summary ||
            recommendations.overview;

        if (general) {
            findElementsByIDs([
                "generalRecommendation",
                "makeupRecommendation",
                "aiMakeupRecommendation",
                "makeupRecommended"
            ]).forEach((element) => {
                element.textContent =
                    formatBackendValue(general);
            });
        }

        const section =
            $("aiMakeupRecommended") ||
            $("aiMakeupRecommendations") ||
            $("makeupRecommendations") ||
            document.querySelector(
                ".recommendations-section"
            );

        if (section) {
            section.hidden = displayed === 0;

            section.dataset.aiRecommendationCount =
                String(displayed);
        }
    }

    function findRecommendationElements(category) {
        return findElementsByIDs([
            `${category}Recommendation`,
            `${category}-recommendation`,
            `recommendation${capitalize(category)}`,
            `recommendation-${category}`
        ]);
    }

    function displayProducts(data) {
        const catalog =
            data.product_catalog ||
            data.product_recommendations ||
            data.products ||
            data.data?.product_catalog;

        if (
            !catalog ||
            typeof catalog !== "object"
        ) {
            return;
        }

        const products =
            catalog.products ||
            catalog;

        if (
            !products ||
            typeof products !== "object"
        ) {
            return;
        }

        let displayed = 0;

        Object.entries(
            PRODUCT_CARD_IDS
        ).forEach(([category, ids]) => {
            const product =
                products[category];

            if (
                !product ||
                typeof product !== "object"
            ) {
                return;
            }

            const card =
                findProductCard(
                    category,
                    ids
                );

            if (!card) return;

            renderProductCard(
                card,
                product,
                category
            );

            displayed += 1;
        });

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
            section.hidden = false;
            section.style.display = "";
        }
    }

    function findProductCard(
        category,
        ids
    ) {
        for (const id of ids) {
            const element = $(id);

            if (element) {
                return (
                    element.closest(
                        ".product-card"
                    ) ||
                    element
                );
            }
        }

        return [
            ...document.querySelectorAll(
                ".product-card"
            )
        ].find((card) => {
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

            return value === category;
        }) || null;
    }

    function renderProductCard(
        card,
        product,
        category
    ) {
        card.hidden = false;
        card.style.display = "";

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

        const heading =
            card.querySelector(
                "h3, h4, .product-name"
            );

        if (heading) {
            heading.textContent = name;
        }

        const paragraph =
            card.querySelector(
                "p, .product-description"
            );

        const parts = [
            brand
                ? `${brand} — ${name}`
                : name
        ];

        if (reason) {
            parts.push(reason);
        }

        const numericScore =
            Number(score);

        if (Number.isFinite(numericScore)) {
            parts.push(
                `AI compatibility: ${Math.round(
                    numericScore
                )}%`
            );
        }

        if (paragraph) {
            paragraph.textContent =
                parts.join("\n");
        } else {
            const description =
                document.createElement("p");

            description.className =
                "product-description";

            description.textContent =
                parts.join("\n");

            card.appendChild(description);
        }

        const imageURL =
            getVerifiedImageURL(product) ||
            LOCAL_PRODUCT_IMAGES[category] ||
            null;

        if (imageURL) {
            renderProductImage(
                card,
                imageURL,
                name,
                category
            );
        }

        const productURL =
            getVerifiedProductURL(product);

        if (productURL) {
            let link =
                card.querySelector(
                    ".product-action"
                );

            if (!link) {
                link =
                    document.createElement("a");

                link.className =
                    "product-action";

                link.target = "_blank";
                link.rel =
                    "noopener noreferrer";

                link.textContent =
                    "View Product";

                card.appendChild(link);
            }

            link.href = productURL;
            link.hidden = false;
        }

        card.dataset.aiRecommended =
            "true";

        card.dataset.productCategory =
            category;
    }

    function renderProductImage(
        card,
        imageURL,
        name,
        category
    ) {
        let wrapper =
            card.querySelector(
                ".ai-product-image-wrapper"
            );

        if (!wrapper) {
            wrapper =
                document.createElement("div");

            wrapper.className =
                "ai-product-image-wrapper";

            const heading =
                card.querySelector(
                    "h3, h4, .product-name"
                );

            if (heading) {
                heading.parentNode.insertBefore(
                    wrapper,
                    heading
                );
            } else {
                card.prepend(wrapper);
            }
        }

        wrapper.replaceChildren();

        const image =
            document.createElement("img");

        image.className =
            "ai-product-image";

        image.src = imageURL;

        image.alt =
            `${name} — ${category} product`;

        image.loading = "lazy";

        image.addEventListener(
            "error",
            () => wrapper.remove(),
            { once: true }
        );

        wrapper.appendChild(image);
    }

    function getVerifiedImageURL(product) {
        if (
            !product ||
            typeof product !== "object"
        ) {
            return null;
        }

        const candidates = [
            product.image_url,
            product.image,
            product.imageUrl,
            product.product_image_url,
            product.productImageUrl
        ];

        for (const candidate of candidates) {
            if (typeof candidate !== "string") {
                continue;
            }

            const url = candidate.trim();

            if (
                /^https?:\/\//i.test(url) ||
                /^data:image\//i.test(url)
            ) {
                return url;
            }

            if (
                /^assets\/images\/products\//i.test(
                    url
                )
            ) {
                return url;
            }
        }

        return null;
    }

    function getVerifiedProductURL(product) {
        if (
            !product ||
            typeof product !== "object"
        ) {
            return null;
        }

        const candidates = [
            product.official_url,
            product.product_url,
            product.productUrl,
            product.url,
            product.link,
            product.purchase_url
        ];

        for (const candidate of candidates) {
            if (typeof candidate !== "string") {
                continue;
            }

            const url = candidate.trim();

            if (/^https?:\/\//i.test(url)) {
                return url;
            }
        }

        return null;
    }

    function updateBeautyProgress(data) {
        const beauty =
            data.beauty_score ||
            data.beautyScore ||
            data.beauty_metrics ||
            data.analysis?.beauty_score;

        if (
            !beauty ||
            typeof beauty !== "object"
        ) {
            return;
        }

        const score =
            getBeautyScore(data);

        if (score !== null) {
            if (els.beautyProgressScore) {
                els.beautyProgressScore.textContent =
                    Math.round(score);
            }

            if (els.beautyScore) {
                els.beautyScore.textContent =
                    `${Math.round(score)}%`;
            }

            if (els.dashboardBeautyScore) {
                els.dashboardBeautyScore.textContent =
                    Math.round(score);
            }
        }

        if (els.beautyProgressGrade) {
            els.beautyProgressGrade.textContent =
                beauty.grade ||
                beauty.beauty_level ||
                (
                    score === null
                        ? "Waiting for AI"
                        : getBeautyGrade(score)
                );
        }

        const skin =
            getNumericScore([
                beauty.skin_score,
                beauty.scores?.skin,
                beauty.skin
            ]);

        const eyes =
            getNumericScore([
                beauty.eye_score,
                beauty.eyes_score,
                beauty.scores?.eyes,
                beauty.eyes
            ]);

        const face =
            getNumericScore([
                beauty.face_shape_score,
                beauty.face_score,
                beauty.scores?.face,
                beauty.face
            ]);

        const lips =
            getNumericScore([
                beauty.lip_score,
                beauty.lips_score,
                beauty.scores?.lips,
                beauty.lips
            ]);

        setScoreElement(
            els.beautySkinScore,
            skin
        );

        setScoreElement(
            els.beautyEyesScore,
            eyes
        );

        setScoreElement(
            els.beautyFaceScore,
            face
        );

        setScoreElement(
            els.beautyLipsScore,
            lips
        );

        updateProgressCircle(
            score ?? 0
        );

        updateBeautyChart(
            skin,
            face,
            eyes,
            lips
        );
    }

    function getBeautyScore(data) {
        const candidates = [
            data.beauty_score?.overall_score,
            data.beautyScore?.overall_score,
            data.beauty_score,
            data.beautyScore,
            data.beauty_metrics?.overall_score,
            data.beauty_metrics?.beauty_score,
            data.analysis?.beauty_score?.overall_score
        ];

        return getNumericScore(
            candidates
        );
    }

    function getNumericScore(candidates) {
        for (const value of candidates) {
            const number = Number(value);

            if (
                Number.isFinite(number) &&
                number >= 0 &&
                number <= 100
            ) {
                return number;
            }
        }

        return null;
    }

    function setScoreElement(
        element,
        value
    ) {
        if (!element) return;

        element.textContent =
            value === null
                ? "--"
                : Math.round(value);
    }

    function getBeautyGrade(score) {
        if (score >= 90) {
            return "Excellent";
        }

        if (score >= 75) {
            return "Very Good";
        }

        if (score >= 60) {
            return "Good";
        }

        if (score >= 40) {
            return "Fair";
        }

        return "Needs Attention";
    }

    function updateProgressCircle(score) {
        if (!els.progressCircle) {
            return;
        }

        const radius =
            Number(
                els.progressCircle.getAttribute("r")
            ) || 72;

        const circumference =
            2 * Math.PI * radius;

        const safeScore =
            clamp(score, 0, 100);

        const offset =
            circumference -
            (safeScore / 100) *
            circumference;

        els.progressCircle.style.strokeDasharray =
            String(circumference);

        els.progressCircle.style.strokeDashoffset =
            String(offset);
    }

    function initializeChart() {
        if (
            !els.beautyChart ||
            typeof window.Chart === "undefined"
        ) {
            return;
        }

        const context =
            els.beautyChart.getContext("2d");

        if (!context) return;

        state.beautyChart =
            new window.Chart(
                context,
                {
                    type: "radar",

                    data: {
                        labels: [
                            "Skin",
                            "Face",
                            "Eyes",
                            "Lips"
                        ],

                        datasets: [
                            {
                                label: "AI Analysis",
                                data: [
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                borderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                fill: true
                            }
                        ]
                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: false
                            }
                        },

                        scales: {
                            r: {
                                beginAtZero: true,
                                min: 0,
                                max: 100,

                                ticks: {
                                    display: false
                                }
                            }
                        }
                    }
                }
            );
    }

    function updateBeautyChart(
        skin,
        face,
        eyes,
        lips
    ) {
        if (!state.beautyChart) {
            return;
        }

        state.beautyChart.data.datasets[0].data = [
            skin ?? 0,
            face ?? 0,
            eyes ?? 0,
            lips ?? 0
        ];

        state.beautyChart.update();
    }

    function updateDashboardStats(data) {
        const score =
            getBeautyScore(data);

        if (
            els.dashboardBeautyScore &&
            score !== null
        ) {
            els.dashboardBeautyScore.textContent =
                Math.round(score);
        }

        const analysis =
            getAnalysisObject(data);

        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};

        setText(
            els.dashboardSkinType,
            firstValue(
                skin.skin_type,
                skin.type
            )
        );

        if (els.totalAnalysis) {
            const current =
                Number.parseInt(
                    els.totalAnalysis.textContent,
                    10
                );

            els.totalAnalysis.textContent =
                String(
                    Number.isFinite(current)
                        ? current + 1
                        : 1
                );
        }
    }

    function initializeTheme() {
        const savedTheme =
            safeStorageGet(
                CONFIG.THEME_KEY
            );

        if (savedTheme === "dark") {
            document.body.classList.add(
                "dark-mode"
            );
        }

        updateThemeIcon();

        if (els.darkModeBtn) {
            els.darkModeBtn.addEventListener(
                "click",
                () => {
                    document.body.classList.toggle(
                        "dark-mode"
                    );

                    const dark =
                        document.body.classList.contains(
                            "dark-mode"
                        );

                    safeStorageSet(
                        CONFIG.THEME_KEY,
                        dark ? "dark" : "light"
                    );

                    updateThemeIcon();
                }
            );
        }
    }

    function updateThemeIcon() {
        if (!els.darkModeBtn) {
            return;
        }

        const icon =
            els.darkModeBtn.querySelector(
                "i"
            );

        if (!icon) return;

        const dark =
            document.body.classList.contains(
                "dark-mode"
            );

        icon.className =
            dark
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
    }

    function initializeSearch() {
        if (!els.search) return;

        els.search.addEventListener(
            "input",
            () => {
                const query =
                    els.search.value
                        .trim()
                        .toLowerCase();

                document
                    .querySelectorAll(
                        ".card, .product-card, .result-item"
                    )
                    .forEach((element) => {
                        const text =
                            element.textContent
                                .toLowerCase();

                        element.hidden =
                            Boolean(
                                query &&
                                !text.includes(
                                    query
                                )
                            );
                    });
            }
        );
    }

    function initializeNotifications() {
        if (!els.notificationBtn) {
            return;
        }

        els.notificationBtn.addEventListener(
            "click",
            () => {
                showToast(
                    "No new notifications.",
                    "info"
                );
            }
        );
    }

    function initializeReset() {
        if (!els.resetBtn) return;

        els.resetBtn.addEventListener(
            "click",
            () => {
                resetDashboard();
            }
        );
    }

    function resetDashboard() {
        resetFileInput();

        revokePreviewURL();

        if (els.previewImage) {
            els.previewImage.removeAttribute(
                "src"
            );

            els.previewImage.hidden = true;

            els.previewImage.style.display =
                "none";
        }

        if (els.uploadBox) {
            els.uploadBox.classList.remove(
                "has-image"
            );
        }

        if (els.analyzeBtn) {
            els.analyzeBtn.disabled = true;
        }

        resetResults(true);

        showToast(
            "Dashboard has been reset.",
            "success"
        );
    }

    function resetResults(resetProgress = true) {
        const elements = [
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

        elements.forEach((element) => {
            if (element) {
                element.textContent = "--";
            }
        });

        if (els.beautyScore) {
            els.beautyScore.textContent = "--";
        }

        if (els.dashboardBeautyScore) {
            els.dashboardBeautyScore.textContent = "--";
        }

        if (els.dashboardSkinType) {
            els.dashboardSkinType.textContent = "--";
        }

        if (els.beautyProgressGrade) {
            els.beautyProgressGrade.textContent =
                "Waiting for AI";
        }

        if (resetProgress) {
            updateProcessing(
                0,
                "Ready",
                "Upload a clear face image to start real AI analysis."
            );
        }

        updateProgressCircle(0);

        updateBeautyChart(
            0,
            0,
            0,
            0
        );
    }

    function initializeNavigation() {
        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach((link) => {
                link.addEventListener(
                    "click",
                    (event) => {
                        const id =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !id ||
                            id === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                id
                            );

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                );
            });
    }

    function updateProcessing(
        percent,
        title,
        message
    ) {
        const value =
            clamp(
                percent,
                0,
                100
            );

        if (els.progressFill) {
            els.progressFill.style.width =
                `${value}%`;
        }

        if (els.progressText) {
            els.progressText.textContent =
                `${Math.round(value)}%`;
        }

        if (!els.processingStatus) {
            return;
        }

        const titleElement =
            els.processingStatus.querySelector(
                ".processing-title"
            );

        const messageElement =
            els.processingStatus.querySelector(
                ".processing-message"
            );

        if (titleElement) {
            titleElement.textContent =
                title || "Processing";
        }

        if (messageElement) {
            messageElement.textContent =
                message || "";
        }

        if (
            !titleElement &&
            !messageElement
        ) {
            els.processingStatus.textContent =
                [title, message]
                    .filter(Boolean)
                    .join(" — ");
        }
    }

    function setAnalyzing(active) {
        if (!els.analyzeBtn) {
            return;
        }

        els.analyzeBtn.disabled =
            active ||
            !state.selectedFile;

        if (active) {
            if (
                !els.analyzeBtn.dataset
                    .originalHTML
            ) {
                els.analyzeBtn.dataset
                    .originalHTML =
                    els.analyzeBtn.innerHTML;
            }

            els.analyzeBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        } else if (
            els.analyzeBtn.dataset
                .originalHTML
        ) {
            els.analyzeBtn.innerHTML =
                els.analyzeBtn.dataset
                    .originalHTML;
        }
    }

    function updateAnalysisHistory(data) {
        if (!els.history) {
            return;
        }

        const analysis =
            getAnalysisObject(data);

        const skin =
            analysis.skin_analysis ||
            data.skin_analysis ||
            {};

        const face =
            analysis.face_shape ||
            data.face_shape ||
            {};

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "history-item";

        const date =
            new Date().toLocaleString();

        const skinValue =
            formatBackendValue(
                skin.skin_type ||
                skin.type ||
                "Not available"
            );

        const faceValue =
            formatBackendValue(
                face.face_shape ||
                face.shape ||
                "Not available"
            );

        const title =
            document.createElement(
                "strong"
            );

        title.textContent =
            "AI Face Analysis";

        const details =
            document.createElement(
                "span"
            );

        details.textContent =
            `${date} • Skin: ${skinValue} • Face: ${faceValue}`;

        item.append(
            title,
            details
        );

        els.history.prepend(item);

        const items =
            els.history.querySelectorAll(
                ".history-item"
            );

        items.forEach(
            (historyItem, index) => {
                if (index >= 10) {
                    historyItem.remove();
                }
            }
        );
    }

    async function checkBackendHealth() {
        try {
            const response =
                await fetch(
                    `${CONFIG.API_BASE_URL.replace(
                        /\/$/,
                        ""
                    )}/health`,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

            const data =
                await parseJSONResponse(
                    response
                );

            setBackendStatus(
                response.ok &&
                data?.success !== false
            );

        } catch {
            setBackendStatus(false);
        }
    }

    function setBackendStatus(online) {
        document
            .querySelectorAll(
                "#backendStatus, .backend-status"
            )
            .forEach((element) => {
                element.textContent =
                    online
                        ? "AI Backend Online"
                        : "AI Backend Offline";

                element.classList.toggle(
                    "online",
                    online
                );

                element.classList.toggle(
                    "offline",
                    !online
                );
            });
    }

    function showToast(
        message,
        type = "info"
    ) {
        if (!message) return;

        let container =
            $("toastContainer");

        if (!container) {
            container =
                document.createElement(
                    "div"
                );

            container.id =
                "toastContainer";

            container.className =
                "toast-container";

            document.body.appendChild(
                container
            );
        }

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `toast toast-${type}`;

        toast.setAttribute(
            "role",
            "status"
        );

        toast.textContent =
            String(message);

        container.appendChild(toast);

        requestAnimationFrame(
            () =>
                toast.classList.add(
                    "show"
                )
        );

        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );

                setTimeout(
                    () =>
                        toast.remove(),
                    250
                );
            },
            4200
        );
    }

    async function parseJSONResponse(
        response
    ) {
        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        if (
            contentType
                .toLowerCase()
                .includes(
                    "application/json"
                )
        ) {
            return response.json();
        }

        const text =
            await response.text();

        if (!text) {
            return {};
        }

        try {
            return JSON.parse(text);
        } catch {
            return {
                success: false,
                error: text
            };
        }
    }

    function getAnalysisObject(data) {
        if (
            !data ||
            typeof data !== "object"
        ) {
            return {};
        }

        return (
            data.analysis ||
            data.ai_analysis ||
            data.results ||
            data
        );
    }

    function setText(
        element,
        value
    ) {
        if (!element) return;

        const text =
            extractValue(value);

        element.textContent =
            text === "Not available"
                ? "--"
                : text;
    }

    function extractValue(value) {
        if (
            value === null ||
            value === undefined
        ) {
            return "Not available";
        }

        if (
            [
                "string",
                "number",
                "boolean"
            ].includes(
                typeof value
            )
        ) {
            return String(value);
        }

        if (Array.isArray(value)) {
            return value
                .map(extractValue)
                .join(", ");
        }

        if (
            typeof value === "object"
        ) {
            const preferred = [
                "value",
                "label",
                "name",
                "type",
                "result",
                "score",
                "level"
            ];

            for (
                const key of preferred
            ) {
                if (
                    value[key] !==
                        undefined &&
                    value[key] !== null
                ) {
                    return extractValue(
                        value[key]
                    );
                }
            }

            return Object.entries(
                value
            )
                .map(
                    ([key, item]) =>
                        `${key}: ${extractValue(
                            item
                        )}`
                )
                .join(" • ");
        }

        return String(value);
    }

    function formatBackendValue(
        value
    ) {
        if (
            value === null ||
            value === undefined
        ) {
            return "Not available";
        }

        if (
            typeof value === "string"
        ) {
            return (
                value.trim() ||
                "Not available"
            );
        }

        if (
            typeof value === "number"
        ) {
            return Number.isFinite(
                value
            )
                ? String(value)
                : "Not available";
        }

        if (
            typeof value === "boolean"
        ) {
            return value
                ? "Yes"
                : "No";
        }

        if (Array.isArray(value)) {
            return value
                .map(
                    formatBackendValue
                )
                .join(", ");
        }

        if (
            typeof value === "object"
        ) {
            const preferred = [
                "recommendation",
                "recommended",
                "product",
                "name",
                "value",
                "description",
                "reason",
                "shade",
                "finish"
            ];

            for (
                const key of preferred
            ) {
                if (
                    value[key] !==
                        undefined &&
                    value[key] !== null
                ) {
                    return formatBackendValue(
                        value[key]
                    );
                }
            }

            return Object.entries(
                value
            )
                .map(
                    ([key, item]) =>
                        `${key}: ${formatBackendValue(
                            item
                        )}`
                )
                .join(" • ");
        }

        return String(value);
    }

    function findElementsByIDs(
        ids
    ) {
        const result = [];

        ids.forEach((id) => {
            const element = $(id);

            if (
                element &&
                !result.includes(
                    element
                )
            ) {
                result.push(element);
            }
        });

        return result;
    }

    function findConfidence(data) {
        const values = [
            data.confidence,
            data.overall_confidence,
            data.analysis_confidence,
            data.face_detection?.confidence,
            data.skin_analysis?.confidence,
            data.analysis?.confidence
        ];

        for (
            const value of values
        ) {
            const number =
                Number(value);

            if (
                Number.isFinite(number)
            ) {
                return number > 1
                    ? number / 100
                    : number;
            }
        }

        return null;
    }

    function firstValue(
        ...values
    ) {
        return values.find(
            (value) =>
                value !==
                    undefined &&
                value !== null &&
                value !== ""
        );
    }

    function clamp(
        value,
        min,
        max
    ) {
        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {
            return min;
        }

        return Math.min(
            max,
            Math.max(
                min,
                number
            )
        );
    }

    function capitalize(
        value
    ) {
        return String(
            value || ""
        )
            .replace(
                /_/g,
                " "
            )
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    }

    function getFriendlyError(
        error
    ) {
        const message =
            error?.message ||
            "Unknown error occurred.";

        if (
            /failed to fetch|networkerror|load failed/i.test(
                message
            )
        ) {
            return "AI backend is not reachable. Start app.py and make sure Flask is running on port 5000.";
        }

        return message;
    }

    function safeStorageGet(
        key
    ) {
        try {
            return window.localStorage.getItem(
                key
            );
        } catch {
            return null;
        }
    }

    function safeStorageSet(
        key,
        value
    ) {
        try {
            window.localStorage.setItem(
                key,
                value
            );
        } catch {
            // Storage can be unavailable in private/restricted browser contexts.
        }
    }

    window.addEventListener(
        "beforeunload",
        revokePreviewURL
    );

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            start,
            { once: true }
        );
    } else {
        start();
    }
})();