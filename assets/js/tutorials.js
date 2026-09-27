/* =========================================================
   AI MAKEUP ANALYSIS GUIDE
   Tutorials Page Controller
   File: assets/js/tutorials.js
   Theme: Pink + Purple + White
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeSearch();
    initializeCategoryFilters();
    initializeBookmarks();
    initializeTutorialButtons();
    initializeFeaturedTutorial();
    initializeNotifications();
    initializeScrollReveal();

    console.log("Tutorials page loaded successfully.");

});


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector(".search-box input");

    const cards =
        document.querySelectorAll(".tutorial-card");

    if (!searchInput || !cards.length) {
        return;
    }

    searchInput.addEventListener("input", function () {

        const keyword =
            this.value.trim().toLowerCase();

        let visibleCards = 0;

        cards.forEach(function (card) {

            const searchableText =
                card.textContent.toLowerCase();

            const matches =
                keyword === "" ||
                searchableText.includes(keyword);

            card.style.display =
                matches ? "" : "none";

            if (matches) {
                visibleCards++;
            }

        });

        updateNoResultsMessage(
            visibleCards === 0
        );

    });

}


/* =========================================================
   SEARCH EMPTY STATE
========================================================= */

function updateNoResultsMessage(show) {

    const grid =
        document.querySelector(".tutorial-grid");

    if (!grid) {
        return;
    }

    let message =
        grid.querySelector(".no-results");

    if (show) {

        if (!message) {

            message =
                document.createElement("div");

            message.className =
                "no-results";

            message.innerHTML =
                "<strong>No tutorials found</strong><br>" +
                "<span>Try another search term or category.</span>";

            grid.appendChild(message);

        }

        message.style.display = "";

    } else if (message) {

        message.style.display = "none";

    }

}


/* =========================================================
   CATEGORY FILTERS
========================================================= */

function initializeCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-buttons button"
        );

    const cards =
        document.querySelectorAll(
            ".tutorial-card"
        );

    if (!buttons.length || !cards.length) {
        return;
    }

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            buttons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const selectedCategory =
                button.textContent
                    .trim()
                    .toLowerCase();

            let visibleCards = 0;

            cards.forEach(function (card) {

                const level =
                    card.querySelector(".level");

                const category =
                    level
                        ? level.textContent
                            .trim()
                            .toLowerCase()
                        : "";

                const showCard =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                card.style.display =
                    showCard ? "" : "none";

                if (showCard) {
                    visibleCards++;
                }

            });

            updateNoResultsMessage(
                visibleCards === 0
            );

        });

    });

}


/* =========================================================
   BOOKMARKS
========================================================= */

function initializeBookmarks() {

    const buttons =
        document.querySelectorAll(
            ".bookmark-btn"
        );

    if (!buttons.length) {
        return;
    }

    buttons.forEach(function (button, index) {

        const storageKey =
            "makeupTutorialBookmark_" + index;

        const icon =
            button.querySelector("i");

        const saved =
            localStorage.getItem(storageKey);

        if (saved === "true") {

            button.classList.add("saved");

            if (icon) {
                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );
            }

        }

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const isSaved =
                    button.classList.toggle(
                        "saved"
                    );

                localStorage.setItem(
                    storageKey,
                    String(isSaved)
                );

                if (icon) {

                    icon.classList.toggle(
                        "fa-solid",
                        isSaved
                    );

                    icon.classList.toggle(
                        "fa-regular",
                        !isSaved
                    );

                }

                showToast(
                    isSaved
                        ? "Tutorial saved successfully."
                        : "Tutorial removed from saved list.",
                    "success"
                );

            }
        );

    });

}


/* =========================================================
   WATCH NOW BUTTONS
========================================================= */

function initializeTutorialButtons() {

    const buttons =
        document.querySelectorAll(
            ".watch-now"
        );

    if (!buttons.length) {
        return;
    }

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const card =
                    button.closest(
                        ".tutorial-card"
                    );

                const titleElement =
                    card
                        ? card.querySelector("h3")
                        : null;

                const title =
                    titleElement
                        ? titleElement.textContent.trim()
                        : "Tutorial";

                openTutorialMessage(title);

            }
        );

    });

}


/* =========================================================
   FEATURED TUTORIAL
========================================================= */

function initializeFeaturedTutorial() {

    const watchButton =
        document.querySelector(
            ".watch-btn"
        );

    if (!watchButton) {
        return;
    }

    watchButton.addEventListener(
        "click",
        function () {

            openTutorialMessage(
                "Complete Everyday Makeup Guide"
            );

        }
    );

}


/* =========================================================
   TUTORIAL ACTION
========================================================= */

function openTutorialMessage(title) {

    showToast(
        title + " will open when the video module is connected.",
        "info"
    );

}


/* =========================================================
   NOTIFICATION BELL
========================================================= */

function initializeNotifications() {

    const notification =
        document.querySelector(
            ".top-icons .fa-bell"
        );

    if (!notification) {
        return;
    }

    const button =
        notification.closest("i") ||
        notification.parentElement;

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            showToast(
                "You have no new notifications.",
                "info"
            );

        }
    );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initializeScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".tutorial-card, .tip-card, .progress-card, .path-step, .featured-video, .cta-section"
        );

    if (!elements.length) {
        return;
    }

    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(function (element) {
            element.classList.add("visible");
        });

        return;

    }

    if (!("IntersectionObserver" in window)) {

        elements.forEach(function (element) {
            element.classList.add("visible");
        });

        return;

    }

    const observer =
        new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.10,
                rootMargin: "0px 0px -35px 0px"
            }
        );

    elements.forEach(function (element) {

        element.classList.add(
            "js-reveal"
        );

        observer.observe(element);

    });

}


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(
    message,
    type
) {

    const existing =
        document.querySelector(
            ".tutorial-toast"
        );

    if (existing) {
        existing.remove();
    }

    const toast =
        document.createElement("div");

    toast.className =
        "tutorial-toast";

    const icon =
        type === "info"
            ? "fa-circle-info"
            : "fa-circle-check";

    toast.innerHTML =
        '<i class="fa-solid ' +
        icon +
        '"></i><span>' +
        escapeHtml(message) +
        "</span>";

    Object.assign(
        toast.style,
        {
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: "10000",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "390px",
            padding: "14px 17px",
            color: "#ffffff",
            background:
                "linear-gradient(135deg, #ec4899, #7c3aed)",
            borderRadius: "12px",
            boxShadow:
                "0 15px 35px rgba(31, 41, 55, 0.20)",
            fontFamily:
                '"Poppins", sans-serif',
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: "1.5",
            opacity: "0",
            transform: "translateY(15px)",
            transition:
                "opacity 0.25s ease, transform 0.25s ease"
        }
    );

    document.body.appendChild(toast);

    requestAnimationFrame(function () {

        toast.style.opacity = "1";
        toast.style.transform =
            "translateY(0)";

    });

    window.setTimeout(function () {

        toast.style.opacity = "0";
        toast.style.transform =
            "translateY(15px)";

        window.setTimeout(function () {

            if (toast.parentNode) {
                toast.remove();
            }

        }, 300);

    }, 2800);

}


/* =========================================================
   SAFE TEXT
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            const toast =
                document.querySelector(
                    ".tutorial-toast"
                );

            if (toast) {
                toast.remove();
            }

        }

    }
);


/* =========================================================
   PAGE READY
========================================================= */

window.addEventListener(
    "load",
    function () {

        document.body.classList.add(
            "tutorials-loaded"
        );

    }
);









/* =========================================
   FEATURED TUTORIAL VIDEO
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("featuredTutorialVideo");
    const playButton = document.getElementById("featuredPlayButton");
    const watchButton = document.getElementById("watchTutorialBtn");
    const videoBox = document.querySelector(".featured-image");

    if (!video) return;

    function toggleVideo() {

        if (video.paused) {
            video.play();

            if (videoBox) {
                videoBox.classList.add("playing");
            }

            if (playButton) {
                playButton.innerHTML =
                    '<i class="fa-solid fa-pause"></i>';
            }

        } else {
            video.pause();

            if (videoBox) {
                videoBox.classList.remove("playing");
            }

            if (playButton) {
                playButton.innerHTML =
                    '<i class="fa-solid fa-play"></i>';
            }
        }
    }

    if (playButton) {
        playButton.addEventListener("click", toggleVideo);
    }

    if (watchButton) {
        watchButton.addEventListener("click", () => {

            video.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            video.play();

            if (videoBox) {
                videoBox.classList.add("playing");
            }
        });
    }

    video.addEventListener("play", () => {
        if (videoBox) {
            videoBox.classList.add("playing");
        }
    });

    video.addEventListener("pause", () => {
        if (videoBox) {
            videoBox.classList.remove("playing");
        }
    });

    video.addEventListener("ended", () => {

        if (videoBox) {
            videoBox.classList.remove("playing");
        }

        if (playButton) {
            playButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';
        }
    });

});