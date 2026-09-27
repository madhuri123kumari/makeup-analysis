/*==================================================
            COMMON.JS
            AI Makeup Analysis Guide
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==========================================
            ACTIVE SIDEBAR LINK
    ==========================================*/

    const currentPage = window.location.pathname.split("/").pop();

    const navLinks = document.querySelectorAll(".sidebar-menu a");

    navLinks.forEach((link) => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.parentElement.classList.add("active");

        } else {

            link.parentElement.classList.remove("active");

        }

    });

    /*==========================================
            CURRENT YEAR
    ==========================================*/

    const year = document.getElementById("currentYear");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

    /*==========================================
            PAGE LOADER
    ==========================================*/

    window.addEventListener("load", () => {

        const loader = document.querySelector(".loader");

        if (loader) {

            loader.classList.add("loader-hidden");

            setTimeout(() => {

                loader.remove();

            }, 500);

        }

    });

    /*==========================================
            BACK TO TOP
    ==========================================*/

    const topButton = document.getElementById("backToTop");

    if (topButton) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 300) {

                topButton.classList.add("show");

            } else {

                topButton.classList.remove("show");

            }

        });

        topButton.addEventListener("click", () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    }

    /*==========================================
            LOGOUT
    ==========================================*/

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", (event) => {

            event.preventDefault();

            const confirmLogout = confirm("Do you want to logout?");

            if (confirmLogout) {

                localStorage.removeItem("loggedInUser");

                window.location.href = "login.html";

            }

        });

    }

    /*==========================================
            BUTTON RIPPLE EFFECT
    ==========================================*/

    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            button.style.transform = "scale(0.96)";

            setTimeout(() => {

                button.style.transform = "";

            }, 120);

        });

    });

    /*==========================================
            SEARCH INPUT ENTER
    ==========================================*/

    const searchInput = document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

            }

        });

    }

    /*==========================================
            TOOLTIP
    ==========================================*/

    const tooltips = document.querySelectorAll("[data-tooltip]");

    tooltips.forEach((item) => {

        item.setAttribute("title", item.dataset.tooltip);

    });

    /*==========================================
            IMAGE PREVIEW
    ==========================================*/

    const imageInput = document.getElementById("profileImage");

    const previewImage = document.getElementById("previewImage");

    if (imageInput && previewImage) {

        imageInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            previewImage.src = URL.createObjectURL(file);

        });

    }

    /*==========================================
            CONSOLE MESSAGE
    ==========================================*/

    console.log("AI Makeup Analysis Guide Loaded Successfully");

})