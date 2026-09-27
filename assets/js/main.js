/* =========================================================
   AI MAKEUP ANALYSIS GUIDE
   Professional Landing Page Controller
   File: assets/js/main.js
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeLoader();
    initializeStickyHeader();
    initializeMobileMenu();
    initializeNavigation();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeContactForm();
    initializeFooterLinks();
    initializeUtilityLinks();
    initializeContactDetails();

});


/* =========================================================
   PAGE LOADER
========================================================= */

function initializeLoader() {

    const loader = document.querySelector(".loader");

    if (!loader) {
        return;
    }

    function hideLoader() {

        loader.classList.add("loader-hide");

        window.setTimeout(function () {

            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }

        }, 600);

    }

    if (document.readyState === "complete") {

        window.setTimeout(hideLoader, 300);

    } else {

        window.addEventListener("load", function () {

            window.setTimeout(hideLoader, 300);

        }, { once: true });

    }

}


/* =========================================================
   STICKY HEADER
========================================================= */

function initializeStickyHeader() {

    const header = document.querySelector("header");

    if (!header) {
        return;
    }

    function updateHeader() {

        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const menuButton = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuButton || !navMenu) {
        return;
    }

    menuButton.setAttribute("role", "button");
    menuButton.setAttribute("tabindex", "0");
    menuButton.setAttribute("aria-expanded", "false");

    function toggleMenu(forceState) {

        const shouldOpen =
            typeof forceState === "boolean"
                ? forceState
                : !navMenu.classList.contains("mobile-open");

        navMenu.classList.toggle("mobile-open", shouldOpen);
        menuButton.classList.toggle("active", shouldOpen);
        menuButton.setAttribute(
            "aria-expanded",
            shouldOpen ? "true" : "false"
        );

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !shouldOpen);
            icon.classList.toggle("fa-xmark", shouldOpen);
        }
    }

    menuButton.addEventListener("click", function () {
        toggleMenu();
    });

    menuButton.addEventListener("keydown", function (event) {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMenu();
        }
    });

    navMenu.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            toggleMenu(false);
        });

    });

    document.addEventListener("click", function (event) {

        if (
            !navMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            toggleMenu(false);
        }
    });

    window.addEventListener("resize", function () {

        if (window.innerWidth > 900) {
            toggleMenu(false);
        }
    });

}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

    const navLinks = document.querySelectorAll(
        ".nav-menu a[href^='#']"
    );

    if (!navLinks.length) {
        return;
    }

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });

    updateActiveNavigation();

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

}


/* =========================================================
   ACTIVE NAVIGATION ON SCROLL
========================================================= */

function updateActiveNavigation() {

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const links = document.querySelectorAll(
        ".nav-menu a[href^='#']"
    );

    if (!sections.length || !links.length) {
        return;
    }

    const scrollPosition =
        window.scrollY + 140;

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });

    links.forEach(function (link) {

        const href =
            link.getAttribute("href");

        link.classList.toggle(
            "active",
            href === "#" + currentSection
        );

    });

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function initializeSmoothScroll() {

    const links = document.querySelectorAll(
        "a[href^='#']"
    );

    if (!links.length) {
        return;
    }

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {

                event.preventDefault();
                return;

            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}


/* =========================================================
   SCROLL ANIMATIONS
========================================================= */

function initializeScrollAnimations() {

    const elements = document.querySelectorAll(
        ".feature-card, .work-card, .testimonial-card, .about-wrapper, .contact-wrapper"
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
            element.classList.add("show");
        });

        return;
    }

    if (!("IntersectionObserver" in window)) {

        elements.forEach(function (element) {
            element.classList.add("show");
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observerInstance.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

    elements.forEach(function (element) {

        element.classList.add("animate");

        observer.observe(element);

    });

}


/* =========================================================
   API CONFIGURATION
   Supports:
   - Flask frontend: http://127.0.0.1:5000
   - VS Code Live Server: http://127.0.0.1:5500 (or another port)
   - Local file: file://...
========================================================= */

function getApiBaseUrl() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;

    // When this page is opened through Flask itself, use the same origin.
    if (
        (hostname === "127.0.0.1" || hostname === "localhost") &&
        port === "5000"
    ) {
        return window.location.origin;
    }

    // When the page is opened through Live Server or another local server,
    // send API requests to the Flask backend.
    if (
        hostname === "127.0.0.1" ||
        hostname === "localhost" ||
        protocol === "file:"
    ) {
        return "http://127.0.0.1:5000";
    }

    // For a deployed frontend, keep same-origin API behavior.
    return "";
}


const API_BASE_URL = getApiBaseUrl();

console.log(
    "AI Makeup API:",
    API_BASE_URL || "same-origin"
);


/* =========================================================
   CONTACT FORM
   Real submission to the Flask backend.
   Backend endpoint: POST /send-message
========================================================= */

function initializeContactForm() {

    const form = document.querySelector(".contact-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const messageInput = form.querySelector("textarea");
        const submitButton = form.querySelector('button[type="submit"]');

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        if (!name) {
            showNotification("Please enter your name.", "error");
            if (nameInput) nameInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showNotification("Please enter a valid email address.", "error");
            if (emailInput) emailInput.focus();
            return;
        }

        if (!message) {
            showNotification("Please enter your message.", "error");
            if (messageInput) messageInput.focus();
            return;
        }

        if (message.length < 5) {
            showNotification("Please enter a little more detail.", "error");
            if (messageInput) messageInput.focus();
            return;
        }

        const originalButtonHTML = submitButton
            ? submitButton.innerHTML
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.setAttribute("aria-busy", "true");
            submitButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        }

        try {

            const controller = new AbortController();
            const timeoutId = window.setTimeout(
                function () {
                    controller.abort();
                },
                15000
            );

            const response = await fetch(`${API_BASE_URL}/send-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                }),
                signal: controller.signal
            });

            window.clearTimeout(timeoutId);

            let result = {};

            try {
                result = await response.json();
            } catch (jsonError) {
                result = {};
            }

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message ||
                    "The server could not send your message."
                );
            }

            showNotification(
                result.message ||
                "Your message has been sent successfully!",
                "success"
            );

            form.reset();

        } catch (error) {

            console.error("Contact form error:", error);

            if (error.name === "AbortError") {
                showNotification(
                    "Request timed out. Please try again.",
                    "error"
                );
            } else if (error instanceof TypeError) {
                showNotification(
                    "Cannot connect to the Flask server. "
                    + "Make sure python app.py is running on port 5000.",
                    "error"
                );
            } else {
                showNotification(
                    error.message ||
                    "Unable to send your message. Please try again.",
                    "error"
                );
            }

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.removeAttribute("aria-busy");
                submitButton.innerHTML =
                    originalButtonHTML || "Send Message";
            }
        }
    });
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailPattern.test(email);
}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(
    message,
    type
) {

    const existingToast =
        document.querySelector(".site-toast");

    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.className =
        "site-toast " +
        (type || "success");


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: "100000",
            maxWidth: "360px",
            padding: "14px 18px",
            borderRadius: "12px",
            color: "#ffffff",
            background:
                type === "error"
                    ? "#dc2626"
                    : "linear-gradient(135deg, #ec4899, #7c3aed)",
            boxShadow:
                "0 12px 30px rgba(17, 24, 39, 0.18)",
            fontFamily:
                '"Poppins", sans-serif',
            fontSize: "13px",
            fontWeight: "500",
            lineHeight: "1.5",
            opacity: "0",
            transform: "translateY(12px)",
            transition:
                "opacity 0.25s ease, transform 0.25s ease"
        }
    );


    document.body.appendChild(toast);


    window.requestAnimationFrame(function () {

        toast.style.opacity = "1";

        toast.style.transform =
            "translateY(0)";

    });


    window.setTimeout(function () {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateY(12px)";

        window.setTimeout(function () {

            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

        }, 300);

    }, 2800);

}


/* =========================================================
   FOOTER LINKS
========================================================= */

function initializeFooterLinks() {

    const placeholderLinks =
        document.querySelectorAll(
            ".footer-social a[href='#'], .footer-social a[href='']"
        );

    placeholderLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            showNotification(
                "Add your official social-media URL to this button.",
                "error"
            );
        });
    });
}


/* =========================================================
   UTILITY LINKS
========================================================= */

function initializeUtilityLinks() {

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {

        link.addEventListener("click", function () {
            console.log("Opening email client:", link.href);
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {

        link.addEventListener("click", function () {
            console.log("Opening phone dialer:", link.href);
        });
    });
}


/* =========================================================
   CONTACT DETAILS
   Converts plain email/phone text into useful links when possible.
========================================================= */

function initializeContactDetails() {

    const contactInfo = document.querySelector(".contact-info");

    if (!contactInfo) {
        return;
    }

    contactInfo.querySelectorAll("p").forEach(function (paragraph) {

        const text = paragraph.textContent.trim();

        if (text.includes("@") && !paragraph.querySelector("a")) {

            const icon = paragraph.querySelector("i");
            const email = text.replace(icon ? icon.textContent : "", "").trim();

            if (isValidEmail(email)) {

                const link = document.createElement("a");
                link.href = "mailto:" + email;
                link.textContent = email;
                link.style.color = "inherit";
                link.style.textDecoration = "none";

                paragraph.innerHTML = "";

                if (icon) {
                    paragraph.appendChild(icon);
                }

                paragraph.appendChild(link);
            }
        }

        if (
            /\+?\d[\d\s-]{8,}/.test(text) &&
            !paragraph.querySelector("a")
        ) {

            const phoneMatch = text.match(/\+?\d[\d\s-]{8,}/);

            if (phoneMatch) {

                const phone = phoneMatch[0].trim();
                const cleanPhone = phone.replace(/[^\d+]/g, "");
                const icon = paragraph.querySelector("i");

                const link = document.createElement("a");
                link.href = "tel:" + cleanPhone;
                link.textContent = phone;
                link.style.color = "inherit";
                link.style.textDecoration = "none";

                paragraph.innerHTML = "";

                if (icon) {
                    paragraph.appendChild(icon);
                }

                paragraph.appendChild(link);
            }
        }
    });
}


/* =========================================================
   START ANALYSIS BUTTON
========================================================= */

const startAnalysisButton =
    document.getElementById("startAnalysisBtn");

if (startAnalysisButton) {

    startAnalysisButton.addEventListener("click", function () {

        console.log(
            "Opening the real AI Makeup Analysis Dashboard..."
        );

    });
}


/* =========================================================
   AUTH BUTTONS
========================================================= */

const loginButton =
    document.getElementById("loginBtn");

const signupButton =
    document.getElementById("signupBtn");

if (loginButton) {

    loginButton.addEventListener("click", function () {

        console.log("Opening Login page...");

    });
}

if (signupButton) {

    signupButton.addEventListener("click", function () {

        console.log("Opening Signup page...");

    });
}


window.addEventListener(
    "error",
    function (event) {

        console.error(
            "AI Makeup Guide Error:",
            event.error || event.message
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    function (event) {
        console.error(
            "AI Makeup Guide Promise Error:",
            event.reason
        );
    }
);


/* =========================================================
   APPLICATION READY
========================================================= */

console.log(
    "%cAI Makeup Analysis Guide",
    "color:#ec4899;font-size:18px;font-weight:700;"
);

console.log(
    "%cFrontend loaded successfully.",
    "color:#7c3aed;font-size:13px;font-weight:600;"
);
