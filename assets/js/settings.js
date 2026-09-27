document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const body = document.body;

    const themeButton = document.getElementById("themeButton");
    const notificationButton = document.getElementById("notificationButton");
    const supportButton = document.getElementById("supportButton");
    const searchInput = document.getElementById("siteSearch");

    const modalButtons = document.querySelectorAll("[data-modal]");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-button");

    const SUPPORT_EMAIL = "support@aimakeupguide.com";

    /* =========================
       Theme Management
    ========================= */

    function setTheme(theme) {
        const isDark = theme === "dark";

        body.classList.toggle("dark", isDark);

        if (themeButton) {
            themeButton.innerHTML = isDark
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';

            themeButton.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );
        }

        localStorage.setItem("aiMakeupTheme", theme);
    }

    const savedTheme = localStorage.getItem("aiMakeupTheme");

    setTheme(savedTheme === "dark" ? "dark" : "light");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const newTheme = body.classList.contains("dark")
                ? "light"
                : "dark";

            setTheme(newTheme);
        });
    }

    /* =========================
       Modal Management
    ========================= */

    function openModal(modalId) {
        const modal = document.getElementById(modalId);

        if (!modal) {
            return;
        }

        modal.classList.add("show");
        document.body.style.overflow = "hidden";

        const closeButton = modal.querySelector(".close-button");

        if (closeButton) {
            closeButton.focus();
        }
    }

    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove("show");

        if (!document.querySelector(".modal.show")) {
            document.body.style.overflow = "";
        }
    }

    modalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");

            if (modalId) {
                openModal(modalId);
            }
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeModal(button.closest(".modal"));
        });
    });

    modals.forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const activeModal = document.querySelector(".modal.show");

            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    /* =========================
       Contact Support
    ========================= */

    if (supportButton) {
        supportButton.addEventListener("click", () => {
            const subject = encodeURIComponent(
                "AI Makeup Analysis Guide - Support Request"
            );

            const message = encodeURIComponent(
                "Hello AI Makeup Support Team,\n\n" +
                "I need help with:\n\n"
            );

            const gmailUrl =
                "https://mail.google.com/mail/?view=cm" +
                "&fs=1" +
                "&to=" + encodeURIComponent(SUPPORT_EMAIL) +
                "&su=" + subject +
                "&body=" + message;

            window.open(
                gmailUrl,
                "_blank",
                "noopener,noreferrer"
            );
        });
    }

    /* =========================
       Notifications
    ========================= */

    if (notificationButton) {
        notificationButton.addEventListener("click", () => {
            const notificationDot =
                notificationButton.querySelector(".notification-dot");

            if (notificationDot) {
                notificationDot.remove();
            }

            notificationButton.setAttribute(
                "aria-label",
                "No new notifications"
            );

            alert("You have no new notifications.");
        });
    }

    /* =========================
       Settings Search
    ========================= */

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value
                .trim()
                .toLowerCase();

            const resourceButtons =
                document.querySelectorAll(".resource-button");

            resourceButtons.forEach((button) => {
                const text = button.textContent.toLowerCase();

                button.style.display =
                    query === "" || text.includes(query)
                        ? ""
                        : "none";
            });
        });
    }

    /* =========================
       Prevent Background Scroll
    ========================= */

    window.addEventListener("beforeunload", () => {
        document.body.style.overflow = "";
    });
});