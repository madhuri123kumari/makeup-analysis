"""
AI Makeup Analysis Guide
REAL AI Product Visual Generator

Provider:
    Pollinations.AI

Model:
    FLUX

Purpose:
    - Generates real AI product concept visuals.
    - Keeps API key on Flask server.
    - Caches generated images locally.
    - Existing frontend endpoint remains unchanged:
        POST /api/analysis/product-image
"""

from __future__ import annotations

import hashlib
import os
from pathlib import Path
from urllib.parse import quote

import requests
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()


# =========================================================
# BLUEPRINT
# =========================================================

product_image_bp = Blueprint(
    "product_image",
    __name__,
)


# =========================================================
# DIRECTORIES
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

GENERATED_DIR = BASE_DIR / "assets" / "images" / "generated_products"

GENERATED_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# POLLINATIONS CONFIGURATION
# =========================================================

POLLINATIONS_API_KEY = os.getenv("POLLINATIONS_API_KEY")

POLLINATIONS_IMAGE_URL = "https://gen.pollinations.ai/image/"

POLLINATIONS_MODEL = "flux"


# =========================================================
# SAFE TEXT
# =========================================================


def _safe_text(
    value: object,
    limit: int = 160,
) -> str:
    if value is None:
        return ""

    return str(value).strip()[:limit]


# =========================================================
# BUILD AI PROMPT
# =========================================================


def _build_prompt(data: dict) -> str:
    product_name = _safe_text(
        data.get("product_name"),
        140,
    )

    brand = _safe_text(
        data.get("brand"),
        80,
    )

    category = _safe_text(
        data.get("category"),
        50,
    )

    skin_type = _safe_text(
        data.get("skin_type"),
        40,
    )

    skin_tone = _safe_text(
        data.get("skin_tone"),
        60,
    )

    undertone = _safe_text(
        data.get("undertone"),
        40,
    )

    tags = data.get("tags", [])

    if not isinstance(tags, list):
        tags = []

    tags_text = ", ".join(_safe_text(tag, 30) for tag in tags[:8])

    return f"""
Create an original premium cosmetic product concept visual.

Product category:
{category}

Product name:
{product_name}

Brand reference:
{brand}

Personalization context:

Skin type:
{skin_type}

Skin tone:
{skin_tone}

Undertone:
{undertone}

Relevant product features:
{tags_text}

Visual requirements:

- One cosmetic product as the main subject.
- Professional beauty e-commerce photography.
- Premium studio lighting.
- Clean luxury background.
- Soft lavender and neutral environment.
- Product centered and upright.
- Realistic cosmetic materials.
- Realistic reflections.
- Realistic shadows.
- Square 1:1 composition.
- High detail.
- Sharp product.
- Professional commercial photography style.
- No human face.
- No hands.
- No person.
- No watermark.
- No prices.
- No fake reviews.
- No ratings.
- No promotional text.
- No medical claims.
- Do not claim this is an official manufacturer photograph.
- Do not reproduce official trademark artwork exactly.
- Do not reproduce proprietary packaging exactly.

This must be an ORIGINAL AI-GENERATED
CONCEPT VISUAL.
""".strip()


# =========================================================
# CACHE KEY
# =========================================================


def _cache_key(data: dict) -> str:
    source = "|".join(
        [
            _safe_text(
                data.get("category"),
                50,
            ),
            _safe_text(
                data.get("brand"),
                80,
            ),
            _safe_text(
                data.get("product_name"),
                140,
            ),
            _safe_text(
                data.get("skin_type"),
                40,
            ),
            _safe_text(
                data.get("skin_tone"),
                60,
            ),
            _safe_text(
                data.get("undertone"),
                40,
            ),
        ]
    )

    return hashlib.sha256(source.encode("utf-8")).hexdigest()[:32]


# =========================================================
# API ROUTE
# =========================================================


@product_image_bp.post("/api/analysis/product-image")
def generate_product_image():
    # -----------------------------------------------------
    # CHECK API KEY
    # -----------------------------------------------------

    if not POLLINATIONS_API_KEY:
        return jsonify(
            {
                "success": False,
                "error": ("POLLINATIONS_API_KEY is not configured."),
            }
        ), 500

    # -----------------------------------------------------
    # READ JSON
    # -----------------------------------------------------

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            {
                "success": False,
                "error": ("JSON request body is required."),
            }
        ), 400

    # -----------------------------------------------------
    # REQUIRED FIELDS
    # -----------------------------------------------------

    product_name = _safe_text(
        data.get("product_name"),
        140,
    )

    category = _safe_text(
        data.get("category"),
        50,
    )

    if not product_name:
        return jsonify(
            {
                "success": False,
                "error": ("product_name is required."),
            }
        ), 400

    if not category:
        return jsonify(
            {
                "success": False,
                "error": ("category is required."),
            }
        ), 400

    # -----------------------------------------------------
    # CACHE
    # -----------------------------------------------------

    key = _cache_key(data)

    image_path = GENERATED_DIR / f"{key}.jpg"

    if image_path.exists() and image_path.stat().st_size > 0:
        return jsonify(
            {
                "success": True,
                "cached": True,
                "image_url": (f"/assets/images/generated_products/{key}.jpg"),
                "visual_type": ("AI_GENERATED_CONCEPT"),
                "provider": ("Pollinations.AI"),
                "model": (POLLINATIONS_MODEL),
            }
        ), 200

    # -----------------------------------------------------
    # BUILD PROMPT
    # -----------------------------------------------------

    prompt = _build_prompt(data)

    encoded_prompt = quote(
        prompt,
        safe="",
    )

    # -----------------------------------------------------
    # GENERATION URL
    # -----------------------------------------------------

    generation_url = f"{POLLINATIONS_IMAGE_URL}{encoded_prompt}"

    # -----------------------------------------------------
    # QUERY PARAMETERS
    # -----------------------------------------------------

    params = {
        "model": POLLINATIONS_MODEL,
        "width": 1024,
        "height": 1024,
        "nologo": "true",
    }

    # -----------------------------------------------------
    # AUTHORIZATION
    # -----------------------------------------------------

    headers = {
        "Authorization": (f"Bearer {POLLINATIONS_API_KEY}"),
        "User-Agent": ("AI-Makeup-Analysis-Guide/1.0"),
    }

    # -----------------------------------------------------
    # REAL AI IMAGE GENERATION
    # -----------------------------------------------------

    try:
        response = requests.get(
            generation_url,
            params=params,
            headers=headers,
            timeout=180,
        )

        response.raise_for_status()

        # -------------------------------------------------
        # CHECK RESPONSE
        # -------------------------------------------------

        content_type = response.headers.get("Content-Type", "").lower()

        if not content_type.startswith("image/"):
            return jsonify(
                {
                    "success": False,
                    "error": ("Pollinations did not return an image."),
                    "content_type": (content_type),
                    "details": (response.text[:1000]),
                }
            ), 502

        # -------------------------------------------------
        # SAVE IMAGE
        # -------------------------------------------------

        image_path.write_bytes(response.content)

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        return jsonify(
            {
                "success": True,
                "cached": False,
                "image_url": (f"/assets/images/generated_products/{key}.jpg"),
                "visual_type": ("AI_GENERATED_CONCEPT"),
                "provider": ("Pollinations.AI"),
                "model": (POLLINATIONS_MODEL),
            }
        ), 200

    # -----------------------------------------------------
    # HTTP ERROR
    # -----------------------------------------------------

    except requests.HTTPError as exc:
        details = ""

        try:
            details = response.text[:1500]
        except Exception:
            pass

        return jsonify(
            {
                "success": False,
                "error": ("Pollinations AI image generation failed."),
                "details": (details or str(exc)),
            }
        ), 502

    # -----------------------------------------------------
    # CONNECTION ERROR
    # -----------------------------------------------------

    except requests.RequestException as exc:
        return jsonify(
            {
                "success": False,
                "error": ("Could not connect to Pollinations AI."),
                "details": str(exc),
            }
        ), 502

    # -----------------------------------------------------
    # OTHER ERROR
    # -----------------------------------------------------

    except Exception as exc:
        return jsonify(
            {
                "success": False,
                "error": ("Could not generate product visual."),
                "details": str(exc),
            }
        ), 500


# =========================================================
# EXPORT
# =========================================================

__all__ = [
    "product_image_bp",
]
