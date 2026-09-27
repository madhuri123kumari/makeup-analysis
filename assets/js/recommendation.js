"use strict";

/* ============================================================
   AI MAKEUP ANALYSIS GUIDE
   PROFESSIONAL E-COMMERCE RECOMMENDATION ENGINE
   ============================================================ */

/* ============================================================
   PRODUCT IMAGE FALLBACK
   IMPORTANT:
   Never use any personal image as a product image or fallback.
   ============================================================ */

const PRODUCT_IMAGE_FALLBACK =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="600"
             height="600"
             viewBox="0 0 600 600">

            <defs>
                <linearGradient id="productGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1">
                    <stop offset="0%" stop-color="#fff1f8"/>
                    <stop offset="100%" stop-color="#f1e9ff"/>
                </linearGradient>
            </defs>

            <rect
                width="600"
                height="600"
                rx="36"
                fill="url(#productGradient)"
            />

            <circle
                cx="300"
                cy="255"
                r="105"
                fill="#ffffff"
                stroke="#d83b9b"
                stroke-width="8"
            />

            <rect
                x="225"
                y="175"
                width="150"
                height="220"
                rx="28"
                fill="#ffffff"
                stroke="#7d3be8"
                stroke-width="8"
            />

            <circle
                cx="300"
                cy="255"
                r="52"
                fill="#f5d8e9"
            />

            <text
                x="300"
                y="455"
                text-anchor="middle"
                font-family="Arial,sans-serif"
                font-size="28"
                font-weight="700"
                fill="#6f35cf">
                PRODUCT IMAGE
            </text>

        </svg>
    `);


/* ============================================================
   PRODUCT CATALOG
   20 PRODUCTS PER CATEGORY
   ============================================================ */

const SHOP_PRODUCTS = [

    /* ========================================================
       FOUNDATION - 20
       ======================================================== */

    {
        id: "foundation-01",
        category: "foundation",
        brand: "Maybelline",
        name: "Fit Me Matte + Poreless Foundation",
        price: 699,
        oldPrice: 799,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Popular"
    },

    {
        id: "foundation-02",
        category: "foundation",
        brand: "L'Oréal",
        name: "True Match Foundation",
        price: 899,
        oldPrice: 1099,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Recommended"
    },

    {
        id: "foundation-03",
        category: "foundation",
        brand: "Maybelline",
        name: "Super Stay Active Wear Foundation",
        price: 799,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Trending"
    },

    {
        id: "foundation-04",
        category: "foundation",
        brand: "Estée Lauder",
        name: "Double Wear Stay-in-Place Makeup",
        price: 4200,
        oldPrice: 4500,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Premium"
    },

    {
        id: "foundation-05",
        category: "foundation",
        brand: "MAC",
        name: "Studio Fix Fluid Foundation",
        price: 3300,
        oldPrice: 3500,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Best Match"
    },

    {
        id: "foundation-06",
        category: "foundation",
        brand: "NARS",
        name: "Light Reflecting Foundation",
        price: 4700,
        oldPrice: 4999,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Popular"
    },

    {
        id: "foundation-07",
        category: "foundation",
        brand: "Fenty Beauty",
        name: "Pro Filt'r Soft Matte Foundation",
        price: 3600,
        oldPrice: 3900,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Recommended"
    },

    {
        id: "foundation-08",
        category: "foundation",
        brand: "Huda Beauty",
        name: "#FauxFilter Foundation",
        price: 3400,
        oldPrice: 3700,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Trending"
    },

    {
        id: "foundation-09",
        category: "foundation",
        brand: "L.A. Girl",
        name: "Pro Coverage HD Foundation",
        price: 899,
        oldPrice: 1099,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Premium"
    },

    {
        id: "foundation-10",
        category: "foundation",
        brand: "Nykaa Cosmetics",
        name: "SKINgenius Foundation",
        price: 799,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Best Match"
    },

    {
        id: "foundation-11",
        category: "foundation",
        brand: "Lakmé",
        name: "Absolute Skin Dew Serum Foundation",
        price: 799,
        oldPrice: 950,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Popular"
    },

    {
        id: "foundation-12",
        category: "foundation",
        brand: "Kay Beauty",
        name: "Hydrating Foundation",
        price: 999,
        oldPrice: 1200,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Recommended"
    },

    {
        id: "foundation-13",
        category: "foundation",
        brand: "Bobbi Brown",
        name: "Skin Long-Wear Foundation",
        price: 4700,
        oldPrice: 5000,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Trending"
    },

    {
        id: "foundation-14",
        category: "foundation",
        brand: "Clinique",
        name: "Even Better Makeup SPF",
        price: 3800,
        oldPrice: 4100,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Premium"
    },

    {
        id: "foundation-15",
        category: "foundation",
        brand: "Revlon",
        name: "ColorStay Foundation",
        price: 1199,
        oldPrice: 1399,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Best Match"
    },

    {
        id: "foundation-16",
        category: "foundation",
        brand: "Too Faced",
        name: "Born This Way Foundation",
        price: 3900,
        oldPrice: 4200,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Popular"
    },

    {
        id: "foundation-17",
        category: "foundation",
        brand: "Charlotte Tilbury",
        name: "Airbrush Flawless Foundation",
        price: 4900,
        oldPrice: 5200,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Recommended"
    },

    {
        id: "foundation-18",
        category: "foundation",
        brand: "Milani",
        name: "Conceal + Perfect Foundation",
        price: 1499,
        oldPrice: 1699,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Trending"
    },

    {
        id: "foundation-19",
        category: "foundation",
        brand: "L'Oréal",
        name: "Infallible 24H Fresh Wear Foundation",
        price: 1199,
        oldPrice: 1399,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Premium"
    },

    {
        id: "foundation-20",
        category: "foundation",
        brand: "e.l.f.",
        name: "Flawless Finish Foundation",
        price: 899,
        oldPrice: 1099,
        rating: 4.2,
        image: "assets/images/foundation.jpg",
        badge: "Best Match"
    },


    /* ========================================================
       LIPSTICK - 20
       ======================================================== */

    {
        id: "lipstick-01",
        category: "lipstick",
        brand: "MAC",
        name: "Velvet Teddy Lipstick",
        price: 2450,
        oldPrice: 2700,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Popular"
    },

    {
        id: "lipstick-02",
        category: "lipstick",
        brand: "Maybelline",
        name: "Super Stay Matte Ink",
        price: 699,
        oldPrice: 799,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Recommended"
    },

    {
        id: "lipstick-03",
        category: "lipstick",
        brand: "L'Oréal",
        name: "Color Riche Intense Volume",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Trending"
    },

    {
        id: "lipstick-04",
        category: "lipstick",
        brand: "Fenty Beauty",
        name: "Icon Velvet Liquid Lipstick",
        price: 2500,
        oldPrice: 2800,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Premium"
    },

    {
        id: "lipstick-05",
        category: "lipstick",
        brand: "Huda Beauty",
        name: "Liquid Matte Lipstick",
        price: 2200,
        oldPrice: 2500,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Best Match"
    },

    {
        id: "lipstick-06",
        category: "lipstick",
        brand: "Rare Beauty",
        name: "Kind Words Matte Lipstick",
        price: 2100,
        oldPrice: 2300,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Popular"
    },

    {
        id: "lipstick-07",
        category: "lipstick",
        brand: "Nykaa Cosmetics",
        name: "Matte To Last Liquid Lipstick",
        price: 599,
        oldPrice: 699,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Recommended"
    },

    {
        id: "lipstick-08",
        category: "lipstick",
        brand: "Lakmé",
        name: "Forever Matte Liquid Lip Colour",
        price: 599,
        oldPrice: 699,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Trending"
    },

    {
        id: "lipstick-09",
        category: "lipstick",
        brand: "Kay Beauty",
        name: "Matte Drama Long Stay Lipstick",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Premium"
    },

    {
        id: "lipstick-10",
        category: "lipstick",
        brand: "Revlon",
        name: "Super Lustrous Lipstick",
        price: 799,
        oldPrice: 899,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Best Match"
    },

    {
        id: "lipstick-11",
        category: "lipstick",
        brand: "Clinique",
        name: "Pop Lip Colour",
        price: 2200,
        oldPrice: 2400,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Popular"
    },

    {
        id: "lipstick-12",
        category: "lipstick",
        brand: "Bobbi Brown",
        name: "Crushed Lip Color",
        price: 2600,
        oldPrice: 2900,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Recommended"
    },

    {
        id: "lipstick-13",
        category: "lipstick",
        brand: "Charlotte Tilbury",
        name: "Matte Revolution Lipstick",
        price: 3200,
        oldPrice: 3500,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Trending"
    },

    {
        id: "lipstick-14",
        category: "lipstick",
        brand: "NARS",
        name: "Afterglow Sensual Shine Lipstick",
        price: 3000,
        oldPrice: 3300,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Premium"
    },

    {
        id: "lipstick-15",
        category: "lipstick",
        brand: "Milani",
        name: "Color Fetish Matte Lipstick",
        price: 1100,
        oldPrice: 1300,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Best Match"
    },

    {
        id: "lipstick-16",
        category: "lipstick",
        brand: "e.l.f.",
        name: "O Face Satin Lipstick",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Popular"
    },

    {
        id: "lipstick-17",
        category: "lipstick",
        brand: "Smashbox",
        name: "Always On Matte Lipstick",
        price: 2300,
        oldPrice: 2500,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Recommended"
    },

    {
        id: "lipstick-18",
        category: "lipstick",
        brand: "Sugar Cosmetics",
        name: "Matte As Hell Crayon Lipstick",
        price: 899,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Trending"
    },

    {
        id: "lipstick-19",
        category: "lipstick",
        brand: "Faces Canada",
        name: "Comfy Matte Lip Color",
        price: 699,
        oldPrice: 799,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Premium"
    },

    {
        id: "lipstick-20",
        category: "lipstick",
        brand: "Colorbar",
        name: "Sinful Matte Lipcolor",
        price: 799,
        oldPrice: 899,
        rating: 4.2,
        image: "assets/images/lipstick.jpg",
        badge: "Best Match"
    },


    /* ========================================================
       EYESHADOW - 20
       ======================================================== */

    {
        id: "eyeshadow-01",
        category: "eyeshadow",
        brand: "Huda Beauty",
        name: "Nude Obsessions Eyeshadow Palette",
        price: 2800,
        oldPrice: 3100,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Popular"
    },

    {
        id: "eyeshadow-02",
        category: "eyeshadow",
        brand: "MAC",
        name: "Connect In Colour Eyeshadow Palette",
        price: 3500,
        oldPrice: 3800,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Recommended"
    },

    {
        id: "eyeshadow-03",
        category: "eyeshadow",
        brand: "Maybelline",
        name: "The Nudes Eyeshadow Palette",
        price: 799,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Trending"
    },

    {
        id: "eyeshadow-04",
        category: "eyeshadow",
        brand: "e.l.f.",
        name: "Bite Size Eyeshadow Palette",
        price: 399,
        oldPrice: 499,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Premium"
    },

    {
        id: "eyeshadow-05",
        category: "eyeshadow",
        brand: "Morphe",
        name: "35O Supernatural Glow Palette",
        price: 3200,
        oldPrice: 3500,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Best Match"
    },

    {
        id: "eyeshadow-06",
        category: "eyeshadow",
        brand: "NARS",
        name: "Quad Eyeshadow Palette",
        price: 3500,
        oldPrice: 3800,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Popular"
    },

    {
        id: "eyeshadow-07",
        category: "eyeshadow",
        brand: "Rare Beauty",
        name: "Eyeshadow Palette",
        price: 2700,
        oldPrice: 3000,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Recommended"
    },

    {
        id: "eyeshadow-08",
        category: "eyeshadow",
        brand: "Too Faced",
        name: "Born This Way The Natural Nudes",
        price: 4200,
        oldPrice: 4500,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Trending"
    },

    {
        id: "eyeshadow-09",
        category: "eyeshadow",
        brand: "Charlotte Tilbury",
        name: "Luxury Eyeshadow Palette",
        price: 4800,
        oldPrice: 5200,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Premium"
    },

    {
        id: "eyeshadow-10",
        category: "eyeshadow",
        brand: "Makeup Revolution",
        name: "Reloaded Eyeshadow Palette",
        price: 899,
        oldPrice: 1099,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Best Match"
    },

    {
        id: "eyeshadow-11",
        category: "eyeshadow",
        brand: "Kay Beauty",
        name: "Eyeshadow Palette",
        price: 1499,
        oldPrice: 1699,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Popular"
    },

    {
        id: "eyeshadow-12",
        category: "eyeshadow",
        brand: "Nykaa Cosmetics",
        name: "Eyes On Me Eyeshadow Palette",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Recommended"
    },

    {
        id: "eyeshadow-13",
        category: "eyeshadow",
        brand: "Lakmé",
        name: "Absolute Spotlight Eyeshadow Palette",
        price: 1200,
        oldPrice: 1400,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Trending"
    },

    {
        id: "eyeshadow-14",
        category: "eyeshadow",
        brand: "Milani",
        name: "Gilded Mini Eyeshadow Palette",
        price: 1200,
        oldPrice: 1400,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Premium"
    },

    {
        id: "eyeshadow-15",
        category: "eyeshadow",
        brand: "ColourPop",
        name: "Going Coconuts Eyeshadow Palette",
        price: 1800,
        oldPrice: 2000,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Best Match"
    },

    {
        id: "eyeshadow-16",
        category: "eyeshadow",
        brand: "Smashbox",
        name: "Cover Shot Eyeshadow Palette",
        price: 2600,
        oldPrice: 2900,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Popular"
    },

    {
        id: "eyeshadow-17",
        category: "eyeshadow",
        brand: "Urban Decay",
        name: "Naked Eyeshadow Palette",
        price: 5200,
        oldPrice: 5500,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Recommended"
    },

    {
        id: "eyeshadow-18",
        category: "eyeshadow",
        brand: "Revolution Pro",
        name: "New Neutral Eyeshadow Palette",
        price: 1400,
        oldPrice: 1600,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Trending"
    },

    {
        id: "eyeshadow-19",
        category: "eyeshadow",
        brand: "Wet n Wild",
        name: "Color Icon Eyeshadow Palette",
        price: 699,
        oldPrice: 799,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Premium"
    },

    {
        id: "eyeshadow-20",
        category: "eyeshadow",
        brand: "Faces Canada",
        name: "Berry Blush Eyeshadow Palette",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/eyeshadow.jpg",
        badge: "Best Match"
    },


    /* ========================================================
       BLUSH - 20
       ======================================================== */

    {
        id: "blush-01",
        category: "blush",
        brand: "Milani",
        name: "Baked Blush",
        price: 1099,
        oldPrice: 1299,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Popular"
    },

    {
        id: "blush-02",
        category: "blush",
        brand: "Rare Beauty",
        name: "Soft Pinch Liquid Blush",
        price: 2700,
        oldPrice: 3000,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Recommended"
    },

    {
        id: "blush-03",
        category: "blush",
        brand: "MAC",
        name: "Powder Blush",
        price: 2450,
        oldPrice: 2700,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Trending"
    },

    {
        id: "blush-04",
        category: "blush",
        brand: "NARS",
        name: "Blush",
        price: 3400,
        oldPrice: 3700,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Premium"
    },

    {
        id: "blush-05",
        category: "blush",
        brand: "e.l.f.",
        name: "Putty Blush",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Best Match"
    },

    {
        id: "blush-06",
        category: "blush",
        brand: "Maybelline",
        name: "Fit Me Blush",
        price: 499,
        oldPrice: 599,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Popular"
    },

    {
        id: "blush-07",
        category: "blush",
        brand: "L'Oréal",
        name: "Le Blush",
        price: 899,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Recommended"
    },

    {
        id: "blush-08",
        category: "blush",
        brand: "Fenty Beauty",
        name: "Cheeks Out Freestyle Cream Blush",
        price: 2900,
        oldPrice: 3200,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Trending"
    },

    {
        id: "blush-09",
        category: "blush",
        brand: "Huda Beauty",
        name: "Blush Filter Liquid Blush",
        price: 2500,
        oldPrice: 2800,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Premium"
    },

    {
        id: "blush-10",
        category: "blush",
        brand: "Charlotte Tilbury",
        name: "Cheek to Chic Blush",
        price: 4200,
        oldPrice: 4500,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Best Match"
    },

    {
        id: "blush-11",
        category: "blush",
        brand: "Kay Beauty",
        name: "Matte Blush",
        price: 899,
        oldPrice: 1099,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Popular"
    },

    {
        id: "blush-12",
        category: "blush",
        brand: "Nykaa Cosmetics",
        name: "Matte To Last Blush",
        price: 799,
        oldPrice: 899,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Recommended"
    },

    {
        id: "blush-13",
        category: "blush",
        brand: "Lakmé",
        name: "Absolute Face Stylist Blush",
        price: 850,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Trending"
    },

    {
        id: "blush-14",
        category: "blush",
        brand: "Revlon",
        name: "Powder Blush",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Premium"
    },

    {
        id: "blush-15",
        category: "blush",
        brand: "Clinique",
        name: "Cheek Pop Blush",
        price: 2800,
        oldPrice: 3100,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Best Match"
    },

    {
        id: "blush-16",
        category: "blush",
        brand: "Bobbi Brown",
        name: "Pot Rouge",
        price: 2900,
        oldPrice: 3200,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Popular"
    },

    {
        id: "blush-17",
        category: "blush",
        brand: "Smashbox",
        name: "Halo Cream Blush",
        price: 2300,
        oldPrice: 2500,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Recommended"
    },

    {
        id: "blush-18",
        category: "blush",
        brand: "Milani",
        name: "Cheek Kiss Cream Blush",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Trending"
    },

    {
        id: "blush-19",
        category: "blush",
        brand: "Sugar Cosmetics",
        name: "Ace Of Face Blush",
        price: 799,
        oldPrice: 899,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Premium"
    },

    {
        id: "blush-20",
        category: "blush",
        brand: "Faces Canada",
        name: "Weightless Matte Blush",
        price: 699,
        oldPrice: 799,
        rating: 4.2,
        image: "assets/images/blush.jpg",
        badge: "Best Match"
    },


    /* ========================================================
       SKINCARE - 20
       ======================================================== */

    {
        id: "skincare-01",
        category: "skincare",
        brand: "CeraVe",
        name: "Foaming Facial Cleanser",
        price: 1299,
        oldPrice: 1499,
        rating: 4.2,
        image: "assets/images/cleanser.jpg",
        badge: "Popular"
    },

    {
        id: "skincare-02",
        category: "skincare",
        brand: "CeraVe",
        name: "Hydrating Facial Cleanser",
        price: 1399,
        oldPrice: 1599,
        rating: 4.2,
        image: "assets/images/cleanser.jpg",
        badge: "Recommended"
    },

    {
        id: "skincare-03",
        category: "skincare",
        brand: "La Roche-Posay",
        name: "Toleriane Hydrating Cleanser",
        price: 1599,
        oldPrice: 1799,
        rating: 4.2,
        image: "assets/images/cleanser.jpg",
        badge: "Trending"
    },

    {
        id: "skincare-04",
        category: "skincare",
        brand: "Thayers",
        name: "Alcohol-Free Facial Toner",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/toner.jpg",
        badge: "Premium"
    },

    {
        id: "skincare-05",
        category: "skincare",
        brand: "Klairs",
        name: "Supple Preparation Toner",
        price: 1499,
        oldPrice: 1699,
        rating: 4.2,
        image: "assets/images/toner.jpg",
        badge: "Best Match"
    },

    {
        id: "skincare-06",
        category: "skincare",
        brand: "CeraVe",
        name: "PM Facial Moisturizing Lotion",
        price: 1599,
        oldPrice: 1799,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Popular"
    },

    {
        id: "skincare-07",
        category: "skincare",
        brand: "CeraVe",
        name: "Moisturizing Cream",
        price: 1299,
        oldPrice: 1499,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Recommended"
    },

    {
        id: "skincare-08",
        category: "skincare",
        brand: "La Roche-Posay",
        name: "Toleriane Double Repair Moisturizer",
        price: 1999,
        oldPrice: 2299,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Trending"
    },

    {
        id: "skincare-09",
        category: "skincare",
        brand: "La Roche-Posay",
        name: "Anthelios UVMune 400 SPF 50+",
        price: 1899,
        oldPrice: 2199,
        rating: 4.2,
        image: "assets/images/sunscreen.jpg",
        badge: "Premium"
    },

    {
        id: "skincare-10",
        category: "skincare",
        brand: "Neutrogena",
        name: "Hydro Boost SPF 50",
        price: 1099,
        oldPrice: 1299,
        rating: 4.2,
        image: "assets/images/sunscreen.jpg",
        badge: "Best Match"
    },

    {
        id: "skincare-11",
        category: "skincare",
        brand: "The Ordinary",
        name: "Niacinamide 10% + Zinc 1%",
        price: 799,
        oldPrice: 899,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Popular"
    },

    {
        id: "skincare-12",
        category: "skincare",
        brand: "The Ordinary",
        name: "Hyaluronic Acid 2% + B5",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Recommended"
    },

    {
        id: "skincare-13",
        category: "skincare",
        brand: "Minimalist",
        name: "2% Salicylic Acid Face Serum",
        price: 599,
        oldPrice: 699,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Trending"
    },

    {
        id: "skincare-14",
        category: "skincare",
        brand: "Minimalist",
        name: "10% Vitamin B5 Moisturizer",
        price: 399,
        oldPrice: 499,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Premium"
    },

    {
        id: "skincare-15",
        category: "skincare",
        brand: "Cetaphil",
        name: "Gentle Skin Cleanser",
        price: 799,
        oldPrice: 899,
        rating: 4.2,
        image: "assets/images/cleanser.jpg",
        badge: "Best Match"
    },

    {
        id: "skincare-16",
        category: "skincare",
        brand: "Cetaphil",
        name: "Moisturising Cream",
        price: 899,
        oldPrice: 999,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Popular"
    },

    {
        id: "skincare-17",
        category: "skincare",
        brand: "COSRX",
        name: "Advanced Snail 96 Mucin Power Essence",
        price: 1499,
        oldPrice: 1699,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Recommended"
    },

    {
        id: "skincare-18",
        category: "skincare",
        brand: "COSRX",
        name: "Low pH Good Morning Gel Cleanser",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/cleanser.jpg",
        badge: "Trending"
    },

    {
        id: "skincare-19",
        category: "skincare",
        brand: "Neutrogena",
        name: "Hydro Boost Water Gel",
        price: 999,
        oldPrice: 1199,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Premium"
    },

    {
        id: "skincare-20",
        category: "skincare",
        brand: "e.l.f.",
        name: "Holy Hydration Face Cream",
        price: 1299,
        oldPrice: 1499,
        rating: 4.2,
        image: "assets/images/moisturizer.jpg",
        badge: "Best Match"
    }
];


/* ============================================================
   CART STATE
   ============================================================ */


/* ============================================================
   SAFE PRODUCT VISUALS
   Never use profile.jpg or any personal image for products.
   These are category illustrations used when real product assets
   are not available in the project.
   ============================================================ */

function productVisual(category) {
    const visuals = {
        foundation: `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1f8"/><stop offset="1" stop-color="#eee5ff"/></linearGradient></defs>
                <rect width="600" height="600" rx="40" fill="url(#g)"/>
                <rect x="190" y="150" width="220" height="300" rx="34" fill="#f8e4d8" stroke="#7d3be8" stroke-width="8"/>
                <rect x="225" y="105" width="150" height="65" rx="16" fill="#d9c2b6" stroke="#6d35c8" stroke-width="8"/>
                <rect x="225" y="250" width="150" height="78" rx="12" fill="#fff" opacity=".88"/>
                <text x="300" y="286" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#7d3be8">FOUNDATION</text>
                <text x="300" y="520" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#6b5a75">MAKEUP</text>
            </svg>`,
        lipstick: `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1f8"/><stop offset="1" stop-color="#eee5ff"/></linearGradient></defs>
                <rect width="600" height="600" rx="40" fill="url(#g)"/>
                <rect x="215" y="260" width="170" height="210" rx="22" fill="#4d4058"/>
                <rect x="230" y="205" width="140" height="75" rx="18" fill="#d9368d"/>
                <path d="M230 205 L255 130 Q300 95 345 130 L370 205 Z" fill="#c92d80" stroke="#7d3be8" stroke-width="7"/>
                <rect x="230" y="340" width="140" height="55" rx="8" fill="#fff" opacity=".9"/>
                <text x="300" y="376" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#7d3be8">LIP COLOR</text>
                <text x="300" y="520" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#6b5a75">LIPSTICK</text>
            </svg>`,
        eyeshadow: `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1f8"/><stop offset="1" stop-color="#eee5ff"/></linearGradient></defs>
                <rect width="600" height="600" rx="40" fill="url(#g)"/>
                <rect x="120" y="160" width="360" height="250" rx="28" fill="#30283d" stroke="#7d3be8" stroke-width="8"/>
                <g stroke="#fff" stroke-opacity=".3" stroke-width="4"><circle cx="190" cy="225" r="35" fill="#d6a58d"/><circle cx="285" cy="225" r="35" fill="#8d6b62"/><circle cx="380" cy="225" r="35" fill="#c78b9b"/><circle cx="190" cy="330" r="35" fill="#a88b70"/><circle cx="285" cy="330" r="35" fill="#b9a08d"/><circle cx="380" cy="330" r="35" fill="#705b7e"/></g>
                <text x="300" y="490" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#6b5a75">EYESHADOW</text>
            </svg>`,
        blush: `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1f8"/><stop offset="1" stop-color="#eee5ff"/></linearGradient></defs>
                <rect width="600" height="600" rx="40" fill="url(#g)"/>
                <ellipse cx="300" cy="290" rx="180" ry="120" fill="#f7f3fa" stroke="#7d3be8" stroke-width="8"/>
                <ellipse cx="300" cy="290" rx="125" ry="78" fill="#e99ab3"/>
                <ellipse cx="270" cy="270" rx="60" ry="35" fill="#f5bdcd" opacity=".75"/>
                <text x="300" y="485" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#6b5a75">BLUSH</text>
            </svg>`,
        skincare: `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff1f8"/><stop offset="1" stop-color="#eee5ff"/></linearGradient></defs>
                <rect width="600" height="600" rx="40" fill="url(#g)"/>
                <rect x="205" y="155" width="190" height="285" rx="38" fill="#ffffff" stroke="#7d3be8" stroke-width="8"/>
                <rect x="240" y="105" width="120" height="70" rx="15" fill="#d8d0df" stroke="#7d3be8" stroke-width="7"/>
                <rect x="235" y="255" width="130" height="82" rx="12" fill="#f3d8e8"/>
                <text x="300" y="288" text-anchor="middle" font-family="Arial" font-size="20" font-weight="700" fill="#7d3be8">SKINCARE</text>
                <text x="300" y="520" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#6b5a75">BEAUTY CARE</text>
            </svg>`
    };
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(visuals[category] || visuals.skincare);
}

/* Use safe product visuals for every catalog item. */
SHOP_PRODUCTS.forEach(product => {
    product.image = productVisual(product.category);
});

const CART_KEY = "ai_makeup_cart";

let cart = loadCart();
let activeCategory = "all";
let searchText = "";
let sortMode = "featured";


/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const grid = document.getElementById("productGrid");
const countLabel = document.getElementById("productCount");

const productSearch =
    document.getElementById("productSearch");

const topSearch =
    document.getElementById("topProductSearch");

const sortSelect =
    document.getElementById("sortProducts");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartItemsLabel =
    document.getElementById("cartItemsLabel");

const cartSubtotal =
    document.getElementById("cartSubtotal");


/* ============================================================
   CART LOAD
   ============================================================ */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(CART_KEY);

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Cart load error:",
            error
        );

        return [];
    }
}


/* ============================================================
   SAVE CART
   ============================================================ */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartUI();
}


/* ============================================================
   PRICE FORMAT
   ============================================================ */

function formatPrice(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);
}


/* ============================================================
   HTML SECURITY
   ============================================================ */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ============================================================
   CATEGORY LABEL
   ============================================================ */

function categoryLabel(category) {

    const labels = {

        foundation: "Foundation",

        lipstick: "Lipstick",

        eyeshadow: "Eyes",

        blush: "Blush",

        skincare: "Skincare"
    };

    return labels[category] || category;
}


/* ============================================================
   PRODUCT FILTER
   ============================================================ */

function visibleProducts() {

    let list =
        SHOP_PRODUCTS.filter(product => {

            const categoryMatch =
                activeCategory === "all" ||
                product.category === activeCategory;

            if (!searchText) {
                return categoryMatch;
            }

            const searchable = [

                product.name,

                product.brand,

                product.category

            ]
                .join(" ")
                .toLowerCase();

            return (
                categoryMatch &&
                searchable.includes(
                    searchText.toLowerCase()
                )
            );
        });


    /* ========================================================
       SORT
       ======================================================== */

    if (sortMode === "price-low") {

        list.sort(
            (a, b) =>
                a.price - b.price
        );
    }


    if (sortMode === "price-high") {

        list.sort(
            (a, b) =>
                b.price - a.price
        );
    }


    if (sortMode === "rating") {

        list.sort(
            (a, b) =>
                b.rating - a.rating
        );
    }


    if (sortMode === "name") {

        list.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }


    return list;
}


/* ============================================================
   RENDER PRODUCTS
   ============================================================ */

function renderProducts() {

    if (!grid || !countLabel) {
        return;
    }

    const products =
        visibleProducts();


    countLabel.textContent =
        `${products.length} products available`;


    /* ========================================================
       EMPTY STATE
       ======================================================== */

    if (!products.length) {

        grid.innerHTML = `

            <div class="ecom-empty">

                <i class="fa-solid fa-magnifying-glass"></i>

                <h3>
                    No products found
                </h3>

                <p>
                    Try another product name or category.
                </p>

            </div>
        `;

        return;
    }


    /* ========================================================
       PRODUCT CARDS
       ======================================================== */

    grid.innerHTML = products
        .map(product => {

            const discount =
                product.oldPrice > product.price

                    ? Math.round(
                        (
                            (
                                product.oldPrice -
                                product.price
                            ) /
                            product.oldPrice
                        ) * 100
                    )

                    : 0;


            const wishlisted =
                localStorage.getItem(
                    `wishlist:${product.id}`
                ) === "true";


            const stars =
                "★".repeat(
                    Math.floor(product.rating)
                );


            return `

                <article
                    class="ecom-product-card"
                    data-product-id="${escapeHTML(product.id)}"
                >

                    <div class="ecom-image">

                        <span class="ecom-badge">

                            ${escapeHTML(product.badge)}

                        </span>


                        <button
                            class="ecom-wishlist"
                            type="button"
                            data-action="wishlist"
                            data-id="${escapeHTML(product.id)}"
                            aria-label="Wishlist"
                        >

                            <i class="${
                                wishlisted
                                    ? "fa-solid"
                                    : "fa-regular"
                            } fa-heart"></i>

                        </button>


                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                            loading="lazy"
                            data-product-image="true"
                        >

                    </div>


                    <div class="ecom-info">

                        <div class="ecom-brand">

                            ${escapeHTML(product.brand)}

                            ·

                            ${escapeHTML(
                                categoryLabel(
                                    product.category
                                )
                            )}

                        </div>


                        <h3 class="ecom-name">

                            ${escapeHTML(product.name)}

                        </h3>


                        <p class="ecom-description">

                            Professional catalog product
                            available for shopping.

                        </p>


                        <div class="ecom-rating">

                            <span class="ecom-stars">

                                ${stars}

                            </span>

                            <span>

                                ${product.rating.toFixed(1)}

                            </span>

                        </div>


                        <div class="ecom-price">

                            <span class="ecom-current">

                                ${formatPrice(product.price)}

                            </span>


                            <span class="ecom-old">

                                ${formatPrice(
                                    product.oldPrice
                                )}

                            </span>


                            <span class="ecom-discount">

                                ${discount}% OFF

                            </span>

                        </div>


                        <div class="ecom-actions">


                            <button
                                class="ecom-add"
                                type="button"
                                data-action="cart"
                                data-id="${escapeHTML(product.id)}"
                            >

                                <i
                                    class="fa-solid fa-cart-plus"
                                ></i>

                                Add to Cart

                            </button>


                            <button
                                class="ecom-buy"
                                type="button"
                                data-action="buy"
                                data-id="${escapeHTML(product.id)}"
                            >

                                <i
                                    class="fa-solid fa-bag-shopping"
                                ></i>

                                Buy Now

                            </button>


                            <button
                                class="ecom-details"
                                type="button"
                                data-action="details"
                                data-id="${escapeHTML(product.id)}"
                            >

                                <i
                                    class="fa-solid fa-circle-info"
                                ></i>

                                View Details

                            </button>


                        </div>

                    </div>

                </article>

            `;

        })
        .join("");


    bindProductActions();

    bindProductImageFallbacks();
}


/* ============================================================
   PRODUCT IMAGE FALLBACK
   ============================================================ */

function bindProductImageFallbacks() {

    grid
        .querySelectorAll(
            'img[data-product-image="true"]'
        )
        .forEach(image => {

            image.addEventListener(
                "error",
                function handleImageError() {

                    this.removeEventListener(
                        "error",
                        handleImageError
                    );

                    this.src =
                        PRODUCT_IMAGE_FALLBACK;

                    this.alt =
                        "Product image unavailable";

                    this.classList.add(
                        "product-image-fallback"
                    );
                }
            );

        });
}


/* ============================================================
   PRODUCT ACTIONS
   ============================================================ */

function bindProductActions() {

    grid
        .querySelectorAll("[data-action]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const product =
                        SHOP_PRODUCTS.find(
                            item =>
                                item.id ===
                                button.dataset.id
                        );


                    if (!product) {
                        return;
                    }


                    const action =
                        button.dataset.action;


                    if (action === "cart") {

                        addToCart(product);

                    }


                    if (action === "buy") {

                        buyNow(product);

                    }


                    if (action === "wishlist") {

                        toggleWishlist(
                            product,
                            button
                        );

                    }


                    if (action === "details") {

                        showDetails(product);

                    }

                }
            );

        });
}


/* ============================================================
   ADD TO CART
   ============================================================ */

function addToCart(product) {

    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            brand: product.brand,

            price: product.price,

            image: product.image,

            quantity: 1

        });
    }


    saveCart();

    showToast(
        `${product.name} added to cart.`
    );

    openCart();
}


/* ============================================================
   REMOVE FROM CART
   ============================================================ */

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );

    saveCart();

    renderCart();
}


/* ============================================================
   CHANGE QUANTITY
   ============================================================ */

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;
    }


    saveCart();

    renderCart();
}


/* ============================================================
   CART COUNT
   ============================================================ */

function cartItemCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}


/* ============================================================
   CART TOTAL
   ============================================================ */

function cartTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            item.price *
            item.quantity,
        0
    );
}


/* ============================================================
   UPDATE CART UI
   ============================================================ */

function updateCartUI() {

    if (!cartCount) {
        return;
    }


    const totalItems =
        cartItemCount();


    cartCount.textContent =
        totalItems;


    if (cartItemsLabel) {

        cartItemsLabel.textContent =
            `${totalItems} ${
                totalItems === 1
                    ? "item"
                    : "items"
            }`;
    }


    if (cartSubtotal) {

        cartSubtotal.textContent =
            formatPrice(
                cartTotal()
            );
    }


    renderCart();
}


/* ============================================================
   RENDER CART
   ============================================================ */

function renderCart() {

    if (!cartItems) {
        return;
    }


    if (!cart.length) {

        cartItems.innerHTML = `

            <div class="shop-empty-cart">

                <i
                    class="fa-solid fa-bag-shopping"
                ></i>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to continue shopping.
                </p>

            </div>

        `;

        return;
    }


    cartItems.innerHTML =
        cart
            .map(
                item => `

                <div class="shop-cart-item">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                        data-cart-image="true"
                    >


                    <div class="shop-cart-main">

                        <h4>

                            ${escapeHTML(item.name)}

                        </h4>


                        <strong>

                            ${formatPrice(item.price)}

                        </strong>


                        <div class="shop-qty">

                            <button
                                type="button"
                                data-cart-action="decrease"
                                data-id="${escapeHTML(item.id)}"
                            >
                                −
                            </button>


                            <span>

                                ${item.quantity}

                            </span>


                            <button
                                type="button"
                                data-cart-action="increase"
                                data-id="${escapeHTML(item.id)}"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="shop-remove"
                        data-cart-action="remove"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Remove item"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>

                </div>

            `
            )
            .join("");


    /* ========================================================
       CART IMAGE FALLBACK
       ======================================================== */

    cartItems
        .querySelectorAll(
            'img[data-cart-image="true"]'
        )
        .forEach(image => {

            image.addEventListener(
                "error",
                function handleCartImageError() {

                    this.removeEventListener(
                        "error",
                        handleCartImageError
                    );

                    this.src =
                        PRODUCT_IMAGE_FALLBACK;

                    this.alt =
                        "Product image unavailable";
                }
            );

        });


    /* ========================================================
       CART ACTIONS
       ======================================================== */

    cartItems
        .querySelectorAll(
            "[data-cart-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    const action =
                        button.dataset.cartAction;


                    if (
                        action ===
                        "increase"
                    ) {

                        changeQuantity(
                            id,
                            1
                        );

                    }


                    if (
                        action ===
                        "decrease"
                    ) {

                        changeQuantity(
                            id,
                            -1
                        );

                    }


                    if (
                        action ===
                        "remove"
                    ) {

                        removeFromCart(id);

                    }

                }
            );

        });
}


/* ============================================================
   WISHLIST
   ============================================================ */

function toggleWishlist(
    product,
    button
) {

    const key =
        `wishlist:${product.id}`;


    const active =
        localStorage.getItem(key) ===
        "true";


    localStorage.setItem(
        key,
        String(!active)
    );


    const icon =
        button.querySelector("i");


    if (icon) {

        icon.className =
            `${
                !active
                    ? "fa-solid"
                    : "fa-regular"
            } fa-heart`;

    }


    showToast(

        !active

            ? `${product.name} added to wishlist.`

            : `${product.name} removed from wishlist.`

    );
}


/* ============================================================
   BUY NOW
   ============================================================ */

function buyNow(product) {

    const checkoutProduct = {

        id: product.id,

        name: product.name,

        brand: product.brand,

        price: product.price,

        image: product.image,

        quantity: 1

    };


    sessionStorage.setItem(
        "checkout_product",
        JSON.stringify(
            checkoutProduct
        )
    );


    window.location.href =
        "checkout.html";
}


/* ============================================================
   PRODUCT DETAILS
   ============================================================ */

function showDetails(product) {

    const discount =
        product.oldPrice > product.price

            ? Math.round(
                (
                    (
                        product.oldPrice -
                        product.price
                    ) /
                    product.oldPrice
                ) * 100
            )

            : 0;


    alert(

        `${product.name}\n\n` +

        `Brand: ${product.brand}\n` +

        `Category: ${
            categoryLabel(
                product.category
            )
        }\n` +

        `Price: ${
            formatPrice(
                product.price
            )
        }\n` +

        `MRP: ${
            formatPrice(
                product.oldPrice
            )
        }\n` +

        `Discount: ${discount}%\n` +

        `Rating: ${
            product.rating.toFixed(1)
        }/5`

    );
}


/* ============================================================
   OPEN CART
   ============================================================ */

function openCart() {

    if (!cartDrawer || !cartOverlay) {
        return;
    }


    cartDrawer.classList.add(
        "open"
    );

    cartOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";
}


/* ============================================================
   CLOSE CART
   ============================================================ */

function closeCart() {

    if (!cartDrawer || !cartOverlay) {
        return;
    }


    cartDrawer.classList.remove(
        "open"
    );

    cartOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";
}


/* ============================================================
   CART BUTTON
   ============================================================ */

const openCartButton =
    document.getElementById(
        "openCart"
    );


if (openCartButton) {

    openCartButton.addEventListener(
        "click",
        openCart
    );
}


/* ============================================================
   CLOSE CART BUTTON
   ============================================================ */

const closeCartButton =
    document.getElementById(
        "closeCart"
    );


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        closeCart
    );
}


/* ============================================================
   CART OVERLAY
   ============================================================ */

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );
}


/* ============================================================
   CHECKOUT BUTTON
   ============================================================ */

const checkoutButton =
    document.getElementById(
        "checkoutButton"
    );


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            if (!cart.length) {

                showToast(
                    "Your cart is empty."
                );

                return;
            }


            sessionStorage.setItem(
                "checkout_cart",
                JSON.stringify(cart)
            );


            window.location.href =
                "checkout.html";
        }
    );
}


/* ============================================================
   CATEGORY FILTER
   FIXED:
   - Works even when this JS file is loaded in <head>
   - Foundation/Lipstick/Eyes/Blush/Skincare buttons work
   - Uses the same activeCategory state as renderProducts()
   ============================================================ */

function initializeCategoryFilter() {

    const categoryButtons =
        document.querySelectorAll(
            ".filter-buttons button"
        );

    if (!categoryButtons.length) {
        console.warn(
            "Category filter buttons were not found."
        );
        return;
    }

    const categoryMap = {
        all: "all",
        foundation: "foundation",
        lipstick: "lipstick",
        eyes: "eyeshadow",
        blush: "blush",
        skincare: "skincare"
    };

    categoryButtons.forEach(button => {

        /* Prevent duplicate event listeners */
        if (
            button.dataset.categoryFilterBound ===
            "true"
        ) {
            return;
        }

        button.dataset.categoryFilterBound =
            "true";

        button.type = "button";

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });

                this.classList.add("active");

                const label =
                    this.textContent
                        .trim()
                        .toLowerCase();

                activeCategory =
                    categoryMap[label] || "all";

                renderProducts();

                /* Keep product section visible */
                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }
        );

    });

}


/* Initialize after the HTML buttons exist */
if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCategoryFilter,
        { once: true }
    );

} else {

    initializeCategoryFilter();

}


/* ============================================================
   SEARCH SYNCHRONIZATION
   ============================================================ */

function syncSearch(value) {

    searchText =
        value.trim();


    if (productSearch) {

        productSearch.value =
            value;
    }


    if (topSearch) {

        topSearch.value =
            value;
    }


    renderProducts();
}


/* ============================================================
   MAIN SEARCH
   ============================================================ */

if (productSearch) {

    productSearch.addEventListener(
        "input",
        event =>
            syncSearch(
                event.target.value
            )
    );
}


/* ============================================================
   TOP SEARCH
   ============================================================ */

if (topSearch) {

    topSearch.addEventListener(
        "input",
        event =>
            syncSearch(
                event.target.value
            )
    );
}


/* ============================================================
   CLEAR SEARCH
   ============================================================ */

const clearSearch =
    document.getElementById(
        "clearSearch"
    );


if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            if (productSearch) {

                productSearch.value =
                    "";
            }


            if (topSearch) {

                topSearch.value =
                    "";
            }


            searchText =
                "";


            renderProducts();
        }
    );
}


/* ============================================================
   SORT PRODUCTS
   ============================================================ */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        event => {

            sortMode =
                event.target.value;


            renderProducts();
        }
    );
}


/* ============================================================
   TOAST
   ============================================================ */

function showToast(message) {

    const toast =
        document.getElementById(
            "shopToast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.__shopToastTimer
    );


    window.__shopToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* ============================================================
   ESC KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeCart();

        }

    }
);


/* ============================================================
   INITIALIZE SHOP
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCategoryFilter();

        renderProducts();

        updateCartUI();

    },
    { once: true }
);


/* ============================================================
   ALSO INITIALIZE IMMEDIATELY
   For cases where script is loaded at bottom of body.
   ============================================================ */

renderProducts();

updateCartUI();