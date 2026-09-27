//==================================================
//          AI MAKEUP RECOMMENDATIONS
//==================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeSearch();

    initializeFilters();

});

//==================================================
//          SELECT ELEMENTS
//==================================================

const searchInput = document.querySelector(".search-box input");

const filterButtons = document.querySelectorAll(".filter-buttons button");

const productCards = document.querySelectorAll(".product-card");

//==================================================
//          PRODUCT SEARCH
//==================================================

function initializeSearch() {

    if (!searchInput) return;

    searchInput.addEventListener("keyup", filterProducts);

}

function filterProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    productCards.forEach(card => {

        const productName = card
            .querySelector("h3")
            .textContent
            .toLowerCase();

        const description = card
            .querySelector("p")
            .textContent
            .toLowerCase();

        if (
            productName.includes(searchValue) ||
            description.includes(searchValue)
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}

//==================================================
//          CATEGORY FILTER
//==================================================

function initializeFilters() {

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            filterCategory(button.textContent.trim());

        });

    });

}

function filterCategory(category) {

    if (category === "All") {

        productCards.forEach(card => {

            card.style.display = "block";

        });

        return;

    }

    productCards.forEach(card => {

        const productName = card
            .querySelector("h3")
            .textContent
            .toLowerCase();

        if (productName.includes(category.toLowerCase())) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}

/*========================================
        PART 2 STARTS HERE
========================================*/
//==================================================
//          WISHLIST
//==================================================

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

initializeWishlist();

function initializeWishlist() {

    wishlistButtons.forEach((button, index) => {

        if (wishlist.includes(index)) {

            button.classList.add("active");

            button.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

        }

        button.addEventListener("click", () => {

            toggleWishlist(button, index);

        });

    });

}

function toggleWishlist(button, index) {

    if (wishlist.includes(index)) {

        wishlist = wishlist.filter(item => item !== index);

        button.classList.remove("active");

        button.innerHTML =
            '<i class="fa-regular fa-heart"></i>';

    }

    else {

        wishlist.push(index);

        button.classList.add("active");

        button.innerHTML =
            '<i class="fa-solid fa-heart"></i>';

    }

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

}

//==================================================
//          PRODUCT DETAILS MODAL
//==================================================

const detailButtons = document.querySelectorAll(".details-btn");

detailButtons.forEach(button => {

    button.addEventListener("click", showProductDetails);

});

function showProductDetails(event) {

    const card = event.target.closest(".product-card");

    const title = card.querySelector("h3").textContent;

    const description = card.querySelector("p").textContent;

    const image = card.querySelector("img").src;

    const price = card.querySelector(".price-row h2").textContent;

    const modal = document.createElement("div");

    modal.className = "product-modal";

    modal.innerHTML = `

        <div class="modal-content">

            <span class="close-modal">&times;</span>

            <img src="${image}" alt="${title}">

            <h2>${title}</h2>

            <p>${description}</p>

            <h3>${price}</h3>

            <button class="buy-btn">

                Buy Now

            </button>

        </div>

    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-modal")
        .addEventListener("click", () => {

            modal.remove();

        });

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.remove();

        }

    });

}

//==================================================
//          PRODUCT CARD EFFECT
//==================================================

productCards.forEach(card => {

    card.addEventListener("mousemove", () => {

        card.style.transform = "translateY(-10px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

/*========================================
        PART 3 STARTS HERE
========================================*/
//==================================================
//          AI RECOMMENDED PRODUCTS
//==================================================

highlightRecommendedProducts();

function highlightRecommendedProducts() {

    productCards.forEach(card => {

        const badge = card.querySelector(".badge");

        if (!badge) return;

        if (
            badge.textContent.includes("Best Match") ||
            badge.textContent.includes("Recommended")
        ) {

            card.style.border = "3px solid #ff4f87";

            card.style.boxShadow =
                "0 20px 40px rgba(255,79,135,.25)";

        }

    });

}

//==================================================
//          PRODUCT SORTING
//==================================================

function sortProducts(type) {

    const productGrid = document.querySelector(".product-grid");

    const cards = Array.from(productCards);

    cards.sort((a, b) => {

        const priceA = Number(
            a.querySelector(".price-row h2")
                .textContent
                .replace(/[₹,]/g, "")
        );

        const priceB = Number(
            b.querySelector(".price-row h2")
                .textContent
                .replace(/[₹,]/g, "")
        );

        if (type === "low") {

            return priceA - priceB;

        }

        if (type === "high") {

            return priceB - priceA;

        }

        return 0;

    });

    cards.forEach(card => {

        productGrid.appendChild(card);

    });

}

//==================================================
//          SCROLL ANIMATION
//==================================================

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    },

    {

        threshold:0.2

    }

);

productCards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform = "translateY(40px)";

    card.style.transition = ".6s ease";

    observer.observe(card);

});

//==================================================
//          TOAST MESSAGE
//==================================================

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast-message";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    },100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        },300);

    },2500);

}

//==================================================
//      WISHLIST SUCCESS MESSAGE
//==================================================

wishlistButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (button.classList.contains("active")) {

            showToast("❤️ Added to Wishlist");

        }

        else {

            showToast("❌ Removed from Wishlist");

        }

    });

});

/*========================================
        PART 4 STARTS HERE
========================================*/
//==================================================
//          RESET FILTERS
//==================================================

function resetFilters() {

    if (searchInput) {

        searchInput.value = "";

    }

    filterButtons.forEach(button => {

        button.classList.remove("active");

    });

    if (filterButtons.length > 0) {

        filterButtons[0].classList.add("active");

    }

    productCards.forEach(card => {

        card.style.display = "block";

    });

}

//==================================================
//          KEYBOARD SHORTCUTS
//==================================================

document.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key.toLowerCase() === "f") {

        event.preventDefault();

        if (searchInput) {

            searchInput.focus();

        }

    }

    if (event.key === "Escape") {

        const modal = document.querySelector(".product-modal");

        if (modal) {

            modal.remove();

        }

    }

});

//==================================================
//          SAVE USER PREFERENCES
//==================================================

function savePreferences() {

    const preferences = {

        searchText: searchInput ? searchInput.value : "",

        activeFilter:

            document.querySelector(".filter-buttons .active")
            ?.textContent || "All"

    };

    localStorage.setItem(

        "recommendationPreferences",

        JSON.stringify(preferences)

    );

}

function loadPreferences() {

    const saved = JSON.parse(

        localStorage.getItem("recommendationPreferences")

    );

    if (!saved) return;

    if (searchInput) {

        searchInput.value = saved.searchText;

        filterProducts();

    }

    filterButtons.forEach(button => {

        button.classList.remove("active");

        if (button.textContent === saved.activeFilter) {

            button.classList.add("active");

            filterCategory(saved.activeFilter);

        }

    });

}

window.addEventListener("beforeunload", savePreferences);

loadPreferences();

//==================================================
//          BUY NOW BUTTON
//==================================================

document.addEventListener("click", (event) => {

    if (event.target.classList.contains("buy-btn")) {

        showToast("🛍️ Redirecting to Checkout...");

        setTimeout(() => {

            alert("Payment Gateway Integration Coming Soon!");

        }, 800);

    }

});

//==================================================
//          PERFORMANCE
//==================================================

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});

//==================================================
//          MOBILE MENU
//==================================================

const sidebar = document.querySelector(".sidebar");

const menuButton = document.querySelector(".menu-toggle");

if (menuButton && sidebar) {

    menuButton.addEventListener("click", () => {

        sidebar.classList.toggle("show");

    });

}

//==================================================
//          INITIALIZATION
//==================================================

console.log("Recommendation Page Loaded Successfully");

console.log("AI Recommendation Engine Ready");

console.log("Wishlist Ready");

console.log("Search Ready");

console.log("Filters Ready");

console.log("Local Storage Ready");

console.log("Animations Ready");

console.log("Responsive Mode Ready");