/* =========================================================
   AI MAKEUP ANALYSIS GUIDE
   PROFILE PAGE CONTROLLER
   Professional Frontend JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();
    initializeNotifications();
    initializeSearch();
    initializeProfileImage();
    initializeProfileForm();
    initializeBeautyPreferences();
    initializeBeautyChart();
    initializeProgressBars();
    initializeProductButtons();
    initializeNewsletter();
    initializePremiumButton();
    initializeScrollAnimations();
    initializeSmoothScroll();
    initializePageLoader();

    updateFooterYear();

    console.log("AI Makeup Profile loaded successfully.");

});


/* =========================================================
   UTILITY — TOAST MESSAGE
   ========================================================= */

function showToast(message, type = "success") {

    const existingToast = document.querySelector(".profile-toast");

    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = `profile-toast ${type}`;

    toast.textContent = message;

    Object.assign(toast.style, {
        position: "fixed",
        right: "25px",
        bottom: "25px",
        zIndex: "9999",
        padding: "13px 18px",
        borderRadius: "10px",
        color: "#ffffff",
        background:
            type === "error"
                ? "#dc2626"
                : "linear-gradient(135deg, #ec4899, #7c3aed)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        fontFamily: "Poppins, sans-serif",
        fontSize: "13px",
        fontWeight: "500",
        opacity: "0",
        transform: "translateY(15px)",
        transition: "all 0.3s ease"
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";

    });

    setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);
}


/* =========================================================
   THEME
   ========================================================= */

function initializeTheme() {

    const themeButton =
        document.querySelector(".theme-btn");

    if (!themeButton) {
        return;
    }

    const savedTheme =
        localStorage.getItem("profile-theme");

    if (
        savedTheme === "dark" ||
        (
            savedTheme === null &&
            localStorage.getItem("theme") === "dark"
        )
    ) {

        document.body.classList.add("dark-mode");

        updateThemeIcon(true);

    }

    themeButton.addEventListener("click", (event) => {

        /*
         * Prevent duplicate theme handlers from common.js.
         */

        event.stopImmediatePropagation();

        const isDark =
            document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "profile-theme",
            isDark ? "dark" : "light"
        );

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon(isDark);

        showToast(
            isDark
                ? "Dark mode enabled"
                : "Light mode enabled"
        );

    });

}


function updateThemeIcon(isDark) {

    const icon =
        document.querySelector(".theme-btn i");

    if (!icon) {
        return;
    }

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
   NOTIFICATIONS
   ========================================================= */

function initializeNotifications() {

    const notificationButton =
        document.querySelector(".notification-btn");

    if (!notificationButton) {
        return;
    }

    notificationButton.addEventListener(
        "click",
        (event) => {

            event.stopImmediatePropagation();

            showToast("No new notifications.");

        }
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector(".search-box input");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", () => {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        const sections =
            document.querySelectorAll(
                ".main-content > section"
            );

        sections.forEach((section) => {

            const text =
                section.textContent.toLowerCase();

            if (
                keyword === "" ||
                text.includes(keyword)
            ) {

                section.style.display = "";

            } else {

                section.style.display = "none";

            }

        });

    });

}


/* =========================================================
   PROFILE IMAGE
   ========================================================= */

function initializeProfileImage() {

    const cameraButton =
        document.querySelector(".camera-btn");

    const profileImage =
        document.querySelector(".profile-image img");

    const profileAvatar =
        document.querySelector(".profile-avatar");

    if (!cameraButton || !profileImage) {
        return;
    }

    const imageInput =
        document.createElement("input");

    imageInput.type = "file";
    imageInput.accept = "image/jpeg,image/png,image/webp";
    imageInput.style.display = "none";

    document.body.appendChild(imageInput);

    cameraButton.addEventListener("click", () => {

        imageInput.click();

    });

    imageInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                showToast(
                    "Please select a valid image.",
                    "error"
                );

                return;
            }

            const reader =
                new FileReader();

            reader.onload = (e) => {

                const imageURL =
                    e.target.result;

                profileImage.src =
                    imageURL;

                if (profileAvatar) {

                    profileAvatar.src =
                        imageURL;

                }

                try {

                    localStorage.setItem(
                        "profile-image",
                        imageURL
                    );

                } catch (error) {

                    console.warn(
                        "Image could not be stored locally.",
                        error
                    );

                }

                showToast(
                    "Profile picture updated successfully."
                );

            };

            reader.readAsDataURL(file);

        }
    );

    const savedImage =
        localStorage.getItem("profile-image");

    if (savedImage) {

        profileImage.src =
            savedImage;

        if (profileAvatar) {

            profileAvatar.src =
                savedImage;

        }

    }

}


/* =========================================================
   PROFILE FORM
   ========================================================= */

function initializeProfileForm() {

    const form =
        document.querySelector(".profile-form");

    if (!form) {
        return;
    }

    loadProfileData(form);

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const formData =
            new FormData(form);

        const profileData = {};

        formData.forEach(
            (value, key) => {

                profileData[key] =
                    value;

            }
        );

        localStorage.setItem(
            "profile-data",
            JSON.stringify(profileData)
        );

        updateProfileHeader(
            profileData
        );

        showToast(
            "Profile saved successfully."
        );

    });

}


function loadProfileData(form) {

    const savedData =
        localStorage.getItem("profile-data");

    if (!savedData) {
        return;
    }

    try {

        const profileData =
            JSON.parse(savedData);

        Object.entries(profileData)
            .forEach(
                ([key, value]) => {

                    const field =
                        form.elements[key];

                    if (field) {

                        field.value =
                            value;

                    }

                }
            );

        updateProfileHeader(
            profileData
        );

    } catch (error) {

        console.error(
            "Unable to load profile data:",
            error
        );

    }

}


function updateProfileHeader(data) {

    const profileName =
        document.querySelector(
            ".profile-info h1"
        );

    if (!profileName) {
        return;
    }

    const firstName =
        data.firstName || "";

    const lastName =
        data.lastName || "";

    const fullName =
        `${firstName} ${lastName}`
            .trim();

    if (fullName) {

        profileName.textContent =
            fullName;

    }

}


/* =========================================================
   BEAUTY PREFERENCES
   ========================================================= */

function initializeBeautyPreferences() {

    const preferenceFields = [
        "makeupStyle",
        "skinType",
        "colorPalette"
    ];

    preferenceFields.forEach((fieldID) => {

        const field =
            document.getElementById(fieldID);

        if (!field) {
            return;
        }

        const storageKey =
            `beauty-${fieldID}`;

        const savedValue =
            localStorage.getItem(storageKey);

        if (savedValue) {

            field.value =
                savedValue;

        }

        field.addEventListener(
            "change",
            () => {

                localStorage.setItem(
                    storageKey,
                    field.value
                );

                showToast(
                    `${field.options[field.selectedIndex].text} selected.`
                );

            }
        );

    });

}


/* =========================================================
   BEAUTY CHART
   ========================================================= */

function initializeBeautyChart() {

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

    new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul"
            ],

            datasets: [
                {

                    label: "Beauty Score",

                    data: [
                        78,
                        82,
                        84,
                        88,
                        91,
                        93,
                        95
                    ],

                    borderColor: "#ec4899",

                    backgroundColor:
                        "rgba(236, 72, 153, 0.12)",

                    borderWidth: 3,

                    pointBackgroundColor:
                        "#7c3aed",

                    pointBorderColor:
                        "#ffffff",

                    pointBorderWidth: 2,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    fill: true,

                    tension: 0.4

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

                        font: {

                            family: "Poppins",

                            size: 11

                        }

                    }

                },

                tooltip: {

                    backgroundColor:
                        "#18181b",

                    padding: 10,

                    cornerRadius: 8

                }

            },

            scales: {

                y: {

                    min: 0,

                    max: 100,

                    ticks: {

                        stepSize: 20,

                        font: {

                            family: "Poppins",

                            size: 10

                        }

                    },

                    grid: {

                        color:
                            "rgba(0,0,0,0.06)"

                    }

                },

                x: {

                    ticks: {

                        font: {

                            family: "Poppins",

                            size: 10

                        }

                    },

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}


/* =========================================================
   PROGRESS BARS
   ========================================================= */

function initializeProgressBars() {

    const progressBars =
        document.querySelectorAll(
            ".progress-fill"
        );

    if (!progressBars.length) {
        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }

                        const bar =
                            entry.target;

                        const classes =
                            Array.from(
                                bar.classList
                            );

                        let percentage =
                            0;

                        classes.forEach(
                            (className) => {

                                if (
                                    className.startsWith(
                                        "progress-"
                                    )
                                ) {

                                    const value =
                                        parseInt(
                                            className.replace(
                                                "progress-",
                                                ""
                                            ),
                                            10
                                        );

                                    if (
                                        !Number.isNaN(
                                            value
                                        )
                                    ) {

                                        percentage =
                                            value;

                                    }

                                }

                            }
                        );

                        bar.style.width = "0%";

                        requestAnimationFrame(
                            () => {

                                setTimeout(
                                    () => {

                                        bar.style.width =
                                            `${percentage}%`;

                                    },
                                    150
                                );

                            }
                        );

                        observerInstance.unobserve(
                            bar
                        );

                    }
                );

            },
            {
                threshold: 0.4
            }
        );

    progressBars.forEach(
        (bar) => {

            observer.observe(bar);

        }
    );

}


/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

function initializeProductButtons() {

    const buttons =
        document.querySelectorAll(
            ".product-btn"
        );

    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(
                            ".product-card"
                        );

                    const productName =
                        card?.querySelector(
                            "h3"
                        )?.textContent
                        || "Product";

                    showToast(
                        `${productName} selected.`
                    );

                }
            );

        }
    );

}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function initializeNewsletter() {

    const form =
        document.querySelector(
            ".newsletter-form"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const emailInput =
                document.getElementById(
                    "newsletterEmail"
                );

            if (!emailInput) {
                return;
            }

            const email =
                emailInput.value.trim();

            if (!email) {

                showToast(
                    "Please enter your email.",
                    "error"
                );

                return;
            }

            if (!emailInput.checkValidity()) {

                showToast(
                    "Please enter a valid email.",
                    "error"
                );

                return;
            }

            localStorage.setItem(
                "newsletter-email",
                email
            );

            showToast(
                "Successfully subscribed to AI beauty updates."
            );

            form.reset();

        }
    );

}


/* =========================================================
   PREMIUM BUTTON
   ========================================================= */

function initializePremiumButton() {

    const premiumButton =
        document.querySelector(
            ".premium-btn"
        );

    if (!premiumButton) {
        return;
    }

    premiumButton.addEventListener(
        "click",
        () => {

            showToast(
                "Premium upgrade is coming soon."
            );

        }
    );

}


/* =========================================================
   SCROLL ANIMATIONS
   ========================================================= */

function initializeScrollAnimations() {

    const elements =
        document.querySelectorAll(
            ".stat-card, " +
            ".achievement-card, " +
            ".product-card, " +
            ".recommendation-item, " +
            ".timeline-item"
        );

    if (!elements.length) {
        return;
    }

    elements.forEach(
        (element) => {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(20px)";

            element.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

        }
    );

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            (element) => {

                element.style.opacity = "1";

                element.style.transform =
                    "translateY(0)";

            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(
        (element) => {

            observer.observe(element);

        }
    );

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function initializeSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetID =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetID ||
                        targetID === "#"
                    ) {

                        return;

                    }

                    const target =
                        document.querySelector(
                            targetID
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

        }
    );

}


/* =========================================================
   PAGE LOADER
   ========================================================= */

function initializePageLoader() {

    window.addEventListener(
        "load",
        () => {

            document.body.classList.add(
                "page-loaded"
            );

        }
    );

}


/* =========================================================
   FOOTER YEAR
   ========================================================= */

function updateFooterYear() {

    const copyright =
        document.querySelector(
            ".copyright"
        );

    if (!copyright) {
        return;
    }

    const currentYear =
        new Date().getFullYear();

    copyright.textContent =
        `© ${currentYear} AI Makeup Analysis Guide. All Rights Reserved.`;

}