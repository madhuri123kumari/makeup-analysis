/* =========================================================
   AI MAKEUP ANALYSIS GUIDE
   HISTORY PAGE CONTROLLER
   Professional History Management
   ========================================================= */

"use strict";

const HISTORY_STORAGE_KEY = "makeupAnalysisHistory";

/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();
    initializeSearch();
    initializeExport();
    initializeHistory();
    initializeComparison();
    initializeChart();
    initializeModal();
    initializeNotifications();
    initializeProfileImage();
    initializeKeyboardSupport();

    console.log("History page initialized successfully.");

});


/* =========================================================
   GET HISTORY DATA
   ========================================================= */

function getHistoryData() {

    try {

        const storedHistory =
            localStorage.getItem(HISTORY_STORAGE_KEY);

        if (!storedHistory) {
            return [];
        }

        const parsedHistory = JSON.parse(storedHistory);

        return Array.isArray(parsedHistory)
            ? parsedHistory
            : [];

    } catch (error) {

        console.error(
            "Unable to read analysis history:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE HISTORY DATA
   ========================================================= */

function saveHistoryData(history) {

    try {

        localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(history)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save analysis history:",
            error
        );

        showToast(
            "Unable to save analysis history."
        );

        return false;

    }

}


/* =========================================================
   THEME MANAGEMENT
   ========================================================= */

function initializeTheme() {

    const themeButton =
        document.querySelector(".theme-toggle");

    if (!themeButton) {
        return;
    }

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeIcon();

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();

        showToast(
            isDark
                ? "Dark mode enabled"
                : "Light mode enabled"
        );

    });

}


/* =========================================================
   THEME ICON
   ========================================================= */

function updateThemeIcon() {

    const icon =
        document.querySelector(".theme-toggle i");

    if (!icon) {
        return;
    }

    const isDark =
        document.body.classList.contains("dark-mode");

    icon.classList.toggle(
        "fa-moon",
        !isDark
    );

    icon.classList.toggle(
        "fa-sun",
        isDark
    );

}


/* =========================================================
   HISTORY INITIALIZATION
   ========================================================= */

function initializeHistory() {

    renderHistory();

}


/* =========================================================
   RENDER HISTORY
   ========================================================= */

function renderHistory() {

    const historyGrid =
        document.querySelector(".history-grid");

    if (!historyGrid) {
        return;
    }

    const history =
        getHistoryData();

    historyGrid.innerHTML = "";

    if (!history.length) {

        renderEmptyHistory(historyGrid);

        updateStatistics([]);

        updateComparison([]);

        updateChart([]);

        return;

    }

    history.forEach((item, index) => {

        const card =
            createHistoryCard(item, index);

        historyGrid.appendChild(card);

    });

    updateStatistics(history);

    updateComparison(history);

    updateChart(history);

    initializeSearch();

}


/* =========================================================
   EMPTY HISTORY
   ========================================================= */

function renderEmptyHistory(container) {

    const emptyState =
        document.createElement("div");

    emptyState.className =
        "history-empty-state";

    emptyState.innerHTML = `
        <div class="empty-icon">
            <i class="fa-solid fa-clock-rotate-left"></i>
        </div>

        <h3>No Analysis History Yet</h3>

        <p>
            Your completed AI makeup analyses will appear here
            after you upload and analyze a photo.
        </p>

        <a href="analysis.html" class="primary-btn">
            <i class="fa-solid fa-camera"></i>
            Start New Analysis
        </a>
    `;

    container.appendChild(emptyState);

}


/* =========================================================
   CREATE HISTORY CARD
   ========================================================= */

function createHistoryCard(item, index) {

    const card =
        document.createElement("article");

    card.className =
        "history-card";

    card.dataset.historyIndex =
        String(index);

    const title =
        escapeHTML(
            item.title ||
            item.name ||
            "AI Makeup Analysis"
        );

    const description =
        escapeHTML(
            item.description ||
            "AI analysis completed successfully."
        );

    const score =
        escapeHTML(
            formatScore(item.score)
        );

    const date =
        escapeHTML(
            item.date ||
            formatDate(item.createdAt)
        );

    const time =
        escapeHTML(
            item.time ||
            formatTime(item.createdAt)
        );

    const skinTone =
        escapeHTML(
            item.skinTone ||
            item.skin ||
            "Not specified"
        );

    const confidence =
        escapeHTML(
            item.confidence ||
            item.aiConfidence ||
            "Not available"
        );

    const imageSource =
        getImageSource(item);

    card.innerHTML = `

        <div class="history-image">

            ${
                imageSource
                    ? `
                        <img
                            class="analysis-image"
                            src="${escapeAttribute(imageSource)}"
                            alt="${title}"
                            loading="lazy"
                            decoding="async"
                        >
                    `
                    : `
                        <div class="image-fallback">
                            <i class="fa-regular fa-image"></i>
                            <span>Analysis image unavailable</span>
                        </div>
                    `
            }

            <span class="beauty-score">
                ⭐ ${score}
            </span>

        </div>


        <div class="history-content">

            <h3>${title}</h3>

            <p>${description}</p>


            <div class="history-details">

                <span>
                    <i class="fa-solid fa-calendar-days"></i>
                    ${date}
                </span>

                <span>
                    <i class="fa-solid fa-clock"></i>
                    ${time}
                </span>

            </div>


            <div class="analysis-info">

                <span>
                    <i class="fa-solid fa-palette"></i>
                    ${skinTone}
                </span>

                <span>
                    <i class="fa-solid fa-brain"></i>
                    AI Confidence: ${confidence}
                </span>

            </div>


            <div class="card-buttons">

                <button
                    class="view-btn"
                    type="button"
                >
                    <i class="fa-solid fa-eye"></i>
                    View
                </button>


                <button
                    class="download-btn"
                    type="button"
                >
                    <i class="fa-solid fa-download"></i>
                    Download
                </button>


                <button
                    class="delete-btn"
                    type="button"
                    aria-label="Delete Analysis"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        </div>

    `;


    const viewButton =
        card.querySelector(".view-btn");

    const downloadButton =
        card.querySelector(".download-btn");

    const deleteButton =
        card.querySelector(".delete-btn");


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                showAnalysisDetails(
                    item
                );

            }
        );

    }


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                downloadAnalysisReport(
                    item
                );

            }
        );

    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                deleteHistoryItem(
                    item,
                    index
                );

            }
        );

    }


    const image =
        card.querySelector(".analysis-image");

    if (image) {

        image.addEventListener(
            "error",
            () => {

                const wrapper =
                    image.closest(".history-image");

                if (!wrapper) {
                    return;
                }

                image.remove();

                wrapper.classList.add(
                    "image-missing"
                );

                if (
                    !wrapper.querySelector(
                        ".image-fallback"
                    )
                ) {

                    const fallback =
                        document.createElement("div");

                    fallback.className =
                        "image-fallback";

                    fallback.innerHTML = `
                        <i class="fa-regular fa-image"></i>
                        <span>Analysis image unavailable</span>
                    `;

                    wrapper.appendChild(
                        fallback
                    );

                }

            }
        );

    }


    return card;

}


/* =========================================================
   IMAGE SOURCE
   ========================================================= */

function getImageSource(item) {

    if (!item) {
        return "";
    }

    return (
        item.image ||
        item.imageData ||
        item.imageUrl ||
        item.photo ||
        item.photoUrl ||
        item.uploadedImage ||
        ""
    );

}


/* =========================================================
   SEARCH HISTORY
   ========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector(
            ".search-box input"
        );

    if (!searchInput) {
        return;
    }

    if (
        searchInput.dataset.historySearchInitialized
        === "true"
    ) {
        return;
    }

    searchInput.dataset.historySearchInitialized =
        "true";


    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const cards =
                document.querySelectorAll(
                    ".history-card"
                );

            let visibleCards = 0;


            cards.forEach((card) => {

                const text =
                    card.textContent
                        .toLowerCase();

                const matches =
                    text.includes(keyword);

                card.style.display =
                    matches ? "" : "none";

                if (matches) {
                    visibleCards++;
                }

            });


            updateSearchMessage(
                visibleCards,
                keyword
            );

        }
    );

}


/* =========================================================
   SEARCH MESSAGE
   ========================================================= */

function updateSearchMessage(
    visibleCards,
    keyword
) {

    let message =
        document.getElementById(
            "historySearchMessage"
        );


    if (!keyword) {

        if (message) {
            message.remove();
        }

        return;

    }


    if (!message) {

        message =
            document.createElement("div");

        message.id =
            "historySearchMessage";

        message.style.cssText = `
            max-width: 1200px;
            margin: 0 auto 20px;
            padding: 12px 35px;
            color: #71717a;
            font-size: 12px;
            text-align: center;
        `;


        const historyGrid =
            document.querySelector(
                ".history-grid"
            );

        if (historyGrid) {
            historyGrid.before(message);
        }

    }


    message.textContent =
        visibleCards === 0
            ? `No analysis found for "${keyword}".`
            : `${visibleCards} analysis result${
                visibleCards > 1 ? "s" : ""
            } found.`;

}


/* =========================================================
   EXPORT HISTORY
   ========================================================= */

function initializeExport() {

    const exportButton =
        document.querySelector(
            ".export-btn"
        );

    if (!exportButton) {
        return;
    }


    exportButton.addEventListener(
        "click",
        () => {

            const history =
                getHistoryData();


            if (!history.length) {

                showToast(
                    "No analysis history available."
                );

                return;

            }


            const exportData =
                history.map((item) => ({

                    id:
                        item.id || null,

                    title:
                        item.title ||
                        "AI Makeup Analysis",

                    score:
                        item.score ||
                        null,

                    description:
                        item.description ||
                        "",

                    date:
                        item.date ||
                        formatDate(item.createdAt),

                    time:
                        item.time ||
                        formatTime(item.createdAt),

                    skinTone:
                        item.skinTone ||
                        item.skin ||
                        "",

                    confidence:
                        item.confidence ||
                        item.aiConfidence ||
                        "",

                    createdAt:
                        item.createdAt ||
                        null

                }));


            const fileContent =
                JSON.stringify(
                    exportData,
                    null,
                    2
                );


            downloadFile(
                fileContent,
                "ai-makeup-analysis-history.json",
                "application/json"
            );


            showToast(
                "Analysis history exported successfully."
            );

        }
    );

}


/* =========================================================
   VIEW ANALYSIS DETAILS
   ========================================================= */

function showAnalysisDetails(item) {

    const modal =
        document.getElementById(
            "clearHistoryModal"
        );


    if (!modal) {

        alert(
            buildAnalysisText(item)
        );

        return;

    }


    const modalTitle =
        modal.querySelector("h2");

    const modalText =
        modal.querySelector(
            ".modal-content > p"
        );

    const icon =
        modal.querySelector(
            ".modal-icon i"
        );

    const buttons =
        modal.querySelector(
            ".modal-buttons"
        );


    if (modalTitle) {

        modalTitle.textContent =
            item.title ||
            "Analysis Details";

    }


    if (modalText) {

        modalText.textContent =
            buildAnalysisText(item);

    }


    if (icon) {

        icon.className =
            "fa-solid fa-eye";

    }


    if (buttons) {

        buttons.style.display =
            "flex";

    }


    modal.classList.add(
        "active"
    );


    const confirmButton =
        modal.querySelector(
            ".confirm-btn"
        );

    if (confirmButton) {

        confirmButton.style.display =
            "none";

    }


    let closeButton =
        modal.querySelector(
            ".view-close-btn"
        );


    if (!closeButton) {

        closeButton =
            document.createElement(
                "button"
            );

        closeButton.className =
            "cancel-btn view-close-btn";

        closeButton.type =
            "button";

        closeButton.textContent =
            "Close";


        closeButton.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "active"
                );

            }
        );


        if (buttons) {

            buttons.appendChild(
                closeButton
            );

        }

    }

}


/* =========================================================
   BUILD ANALYSIS DETAILS
   ========================================================= */

function buildAnalysisText(item) {

    const score =
        formatScore(item.score);

    const description =
        item.description ||
        "No description available.";

    const skinTone =
        item.skinTone ||
        item.skin ||
        "Not specified";

    const confidence =
        item.confidence ||
        item.aiConfidence ||
        "Not available";


    return `
Beauty Score: ${score}

${description}

Skin Tone: ${skinTone}

AI Confidence: ${confidence}
`.trim();

}


/* =========================================================
   DOWNLOAD ANALYSIS REPORT
   ========================================================= */

function downloadAnalysisReport(item) {

    const title =
        item.title ||
        "AI Makeup Analysis Report";

    const score =
        formatScore(item.score);

    const description =
        item.description ||
        "No description available.";

    const skinTone =
        item.skinTone ||
        item.skin ||
        "Not specified";

    const confidence =
        item.confidence ||
        item.aiConfidence ||
        "Not available";

    const date =
        item.date ||
        formatDate(item.createdAt);

    const time =
        item.time ||
        formatTime(item.createdAt);


    const report = `
AI MAKEUP ANALYSIS GUIDE
========================

Analysis:
${title}

Beauty Score:
${score}

Description:
${description}

Analysis Date:
${date}

Analysis Time:
${time}

Skin Tone:
${skinTone}

AI Confidence:
${confidence}

Generated:
${new Date().toLocaleString()}
`.trim();


    const filename =
        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        || "analysis-report";


    downloadFile(
        report,
        `${filename}.txt`,
        "text/plain"
    );


    showToast(
        "Analysis report downloaded."
    );

}


/* =========================================================
   DELETE HISTORY ITEM
   ========================================================= */

function deleteHistoryItem(
    item,
    index
) {

    const title =
        item.title ||
        "this analysis";


    const confirmed =
        window.confirm(
            `Delete "${title}" from your history?`
        );


    if (!confirmed) {
        return;
    }


    const history =
        getHistoryData();


    if (
        index < 0 ||
        index >= history.length
    ) {

        showToast(
            "Unable to delete this analysis."
        );

        return;

    }


    history.splice(
        index,
        1
    );


    if (
        saveHistoryData(history)
    ) {

        renderHistory();

        showToast(
            "Analysis deleted successfully."
        );

    }

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics(
    history = getHistoryData()
) {

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    if (!statCards.length) {
        return;
    }


    const total =
        history.length;


    const scores =
        history
            .map(
                item =>
                    parseScore(item.score)
            )
            .filter(
                score =>
                    Number.isFinite(score)
            );


    const highest =
        scores.length
            ? Math.max(...scores)
            : 0;


    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();


    const thisMonth =
        history.filter(
            item => {

                if (!item.createdAt) {
                    return false;
                }

                const date =
                    new Date(item.createdAt);

                return (
                    date.getMonth()
                    === currentMonth
                    &&
                    date.getFullYear()
                    === currentYear
                );

            }
        ).length;


    let improvement = 0;


    if (scores.length >= 2) {

        const oldest =
            scores[scores.length - 1];

        const latest =
            scores[0];

        if (oldest > 0) {

            improvement =
                ((latest - oldest) /
                    oldest) *
                100;

        }

    }


    const totalElement =
        statCards[0]?.querySelector("h2");

    const highestElement =
        statCards[1]?.querySelector("h2");

    const monthElement =
        statCards[2]?.querySelector("h2");

    const improvementElement =
        statCards[3]?.querySelector("h2");


    if (totalElement) {
        totalElement.textContent =
            total;
    }


    if (highestElement) {

        highestElement.textContent =
            highest
                ? `${highest}%`
                : "—";

    }


    if (monthElement) {

        monthElement.textContent =
            thisMonth;

    }


    if (improvementElement) {

        if (
            Number.isFinite(improvement)
        ) {

            const rounded =
                Math.round(
                    improvement
                );

            improvementElement.textContent =
                `${rounded >= 0 ? "+" : ""}${rounded}%`;

        } else {

            improvementElement.textContent =
                "—";

        }

    }

}


/* =========================================================
   COMPARISON
   ========================================================= */

function initializeComparison() {

    const compareButton =
        document.querySelector(
            ".compare-btn"
        );


    const comparisonSection =
        document.querySelector(
            ".comparison-section"
        );


    if (
        !compareButton ||
        !comparisonSection
    ) {

        return;

    }


    compareButton.addEventListener(
        "click",
        () => {

            comparisonSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            showToast(
                "Comparison section opened."
            );

        }
    );

}


/* =========================================================
   UPDATE COMPARISON
   ========================================================= */

function updateComparison(
    history = getHistoryData()
) {

    const comparisonCards =
        document.querySelectorAll(
            ".comparison-card"
        );


    if (
        comparisonCards.length < 2
    ) {

        return;

    }


    const latest =
        history[0];

    const previous =
        history[1];


    updateComparisonCard(
        comparisonCards[0],
        previous,
        "Previous Analysis"
    );


    updateComparisonCard(
        comparisonCards[1],
        latest,
        "Latest Analysis"
    );

}


/* =========================================================
   COMPARISON CARD
   ========================================================= */

function updateComparisonCard(
    card,
    item,
    label
) {

    if (!card) {
        return;
    }


    const heading =
        card.querySelector("h3");


    const image =
        card.querySelector(
            ".analysis-image"
        );


    const fallback =
        card.querySelector(
            ".image-fallback"
        );


    const score =
        card.querySelector(
            ".comparison-score h2"
        );


    if (heading) {

        heading.textContent =
            label;

    }


    if (!item) {

        if (image) {
            image.style.display =
                "none";
        }

        if (fallback) {
            fallback.style.display =
                "flex";
        }

        if (score) {
            score.textContent =
                "—";
        }

        return;

    }


    const imageSource =
        getImageSource(item);


    if (image && imageSource) {

        image.src =
            imageSource;

        image.alt =
            item.title ||
            label;

        image.style.display =
            "block";

    }


    if (fallback) {

        fallback.style.display =
            imageSource
                ? "none"
                : "flex";

    }


    if (score) {

        score.textContent =
            formatScore(item.score);

    }

}


/* =========================================================
   CHART
   ========================================================= */

let beautyChartInstance = null;


function initializeChart() {

    updateChart(
        getHistoryData()
    );

}


/* =========================================================
   UPDATE CHART
   ========================================================= */

function updateChart(history) {

    const canvas =
        document.getElementById(
            "beautyChart"
        );


    if (!canvas) {
        return;
    }


    if (
        typeof Chart ===
        "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

        return;

    }


    if (
        beautyChartInstance
    ) {

        beautyChartInstance.destroy();

    }


    const chartHistory =
        history
            .slice()
            .reverse()
            .slice(-6);


    const labels =
        chartHistory.map(
            item =>
                item.date ||
                formatDate(item.createdAt)
        );


    const values =
        chartHistory.map(
            item =>
                parseScore(item.score)
        );


    beautyChartInstance =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {
                            label:
                                "Beauty Score",

                            data:
                                values,

                            borderColor:
                                "#ec4899",

                            backgroundColor:
                                "rgba(236, 72, 153, 0.12)",

                            borderWidth: 3,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            tension: 0.4,

                            fill: true
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },

                    plugins: {

                        legend: {

                            display: true,

                            labels: {

                                usePointStyle: true,

                                padding: 18

                            }

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    (context) => {

                                        return ` Beauty Score: ${context.raw}%`;

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: false,

                            min: 0,

                            max: 100,

                            ticks: {

                                callback:
                                    (value) => {

                                        return `${value}%`;

                                    }

                            }

                        },

                        x: {

                            grid: {

                                display: false

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   MODAL
   ========================================================= */

function initializeModal() {

    const modal =
        document.getElementById(
            "clearHistoryModal"
        );


    if (!modal) {
        return;
    }


    const cancelButton =
        modal.querySelector(
            ".cancel-btn"
        );


    const confirmButton =
        modal.querySelector(
            ".confirm-btn"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "active"
                );

            }
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            () => {

                const history =
                    getHistoryData();


                if (!history.length) {

                    modal.classList.remove(
                        "active"
                    );

                    showToast(
                        "Analysis history is already empty."
                    );

                    return;

                }


                localStorage.removeItem(
                    HISTORY_STORAGE_KEY
                );


                modal.classList.remove(
                    "active"
                );


                renderHistory();


                showToast(
                    "Analysis history cleared."
                );

            }
        );

    }


    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function initializeNotifications() {

    const notificationButton =
        document.querySelector(
            ".notification-btn"
        );


    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        () => {

            showToast(
                "No new notifications."
            );

        }
    );

}


/* =========================================================
   PROFILE IMAGE
   ========================================================= */

function initializeProfileImage() {

    const profileImage =
        document.querySelector(
            ".top-icons img"
        );


    if (!profileImage) {
        return;
    }


    profileImage.addEventListener(
        "error",
        () => {

            if (
                !profileImage.dataset.fallbackApplied
            ) {

                profileImage.dataset.fallbackApplied =
                    "true";

                profileImage.src =
                    "assets/images/profile.jpg";

            }

        }
    );

}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

function initializeKeyboardSupport() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                const modal =
                    document.querySelector(
                        ".modal.active"
                    );


                if (modal) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }

        }
    );

}


/* =========================================================
   DOWNLOAD FILE HELPER
   ========================================================= */

function downloadFile(
    content,
    filename,
    mimeType
) {

    const blob =
        new Blob(
            [content],
            {
                type: mimeType
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
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        100
    );

}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(message) {

    const existingToast =
        document.querySelector(
            ".history-toast"
        );


    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "history-toast";


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {

            position: "fixed",

            right: "25px",

            bottom: "25px",

            zIndex: "3000",

            padding: "12px 18px",

            color: "#ffffff",

            background:
                "linear-gradient(135deg, #ec4899, #7c3aed)",

            borderRadius: "10px",

            fontFamily:
                "Poppins, sans-serif",

            fontSize: "12px",

            fontWeight: "600",

            boxShadow:
                "0 12px 30px rgba(124, 58, 237, 0.25)",

            opacity: "0",

            transform:
                "translateY(15px)",

            transition:
                "opacity 0.25s ease, transform 0.25s ease"

        }
    );


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateY(0)";

        }
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(15px)";


            setTimeout(
                () => {

                    toast.remove();

                },
                250
            );

        },
        2500
    );

}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function formatDate(value) {

    if (!value) {
        return "Date unavailable";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   TIME HELPERS
   ========================================================= */

function formatTime(value) {

    if (!value) {
        return "Time unavailable";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Time unavailable";

    }


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );

}


/* =========================================================
   SCORE HELPERS
   ========================================================= */

function parseScore(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return NaN;

    }


    const numeric =
        parseFloat(
            String(value)
                .replace("%", "")
        );


    return Number.isFinite(numeric)
        ? numeric
        : NaN;

}


function formatScore(value) {

    const score =
        parseScore(value);


    if (
        !Number.isFinite(score)
    ) {

        return "N/A";

    }


    return `${Math.round(score)}%`;

}


/* =========================================================
   HTML SAFETY HELPERS
   ========================================================= */

function escapeHTML(value) {

    return String(value)
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


function escapeAttribute(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   FINAL STATUS
   ========================================================= */

console.log(
    "AI Makeup Analysis Guide | History Controller Ready"
);