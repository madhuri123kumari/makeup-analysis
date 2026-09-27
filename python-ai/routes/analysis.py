"""
AI Makeup Analysis Guide
Professional Analysis API

Python 3.12+
Flask
"""

from __future__ import annotations


from pathlib import Path
from uuid import uuid4

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from config import (
    LOGGER,
    UPLOADS_DIR,
    is_allowed_image,
)

from services.analysis_service import AnalysisService


analysis_bp = Blueprint(
    "analysis",
    __name__,
)

analysis_service = AnalysisService()


# ============================================================
# COMPLETE AI ANALYSIS
# ============================================================


@analysis_bp.post("/")
def analyze():
    """
    Receive an image and run the complete AI analysis pipeline.
    """

    if "image" not in request.files:
        return jsonify(
            {
                "success": False,
                "message": "Image file is required.",
            }
        ), 400

    image = request.files["image"]

    if not image.filename:
        return jsonify(
            {
                "success": False,
                "message": "No image selected.",
            }
        ), 400

    safe_name = secure_filename(image.filename)

    if not safe_name:
        return jsonify(
            {
                "success": False,
                "message": "Invalid image filename.",
            }
        ), 400

    if not is_allowed_image(safe_name):
        return jsonify(
            {
                "success": False,
                "message": ("Unsupported image format. Use JPG, JPEG, PNG or WEBP."),
            }
        ), 400

    extension = Path(safe_name).suffix.lower()
    unique_name = f"{uuid4().hex}{extension}"
    save_path = Path(UPLOADS_DIR) / unique_name

    try:
        image.save(save_path)

        LOGGER.info(
            "Analysis request received: %s",
            save_path.name,
        )

        result = analysis_service.analyze(save_path)

        return jsonify(result), 200

    except FileNotFoundError as exc:
        LOGGER.exception(
            "File error: %s",
            exc,
        )

        return jsonify(
            {
                "success": False,
                "message": "Uploaded image could not be found.",
                "error": str(exc),
            }
        ), 400

    except ValueError as exc:
        LOGGER.exception(
            "Image validation error: %s",
            exc,
        )

        return jsonify(
            {
                "success": False,
                "message": str(exc),
            }
        ), 422

    except Exception as exc:
        LOGGER.exception(
            "AI analysis failed: %s",
            exc,
        )

        return jsonify(
            {
                "success": False,
                "message": "AI analysis failed.",
                "error": str(exc),
            }
        ), 500

    finally:
        LOGGER.info(
            "Analysis request completed: %s",
            save_path.name,
        )


# ============================================================
# HEALTH
# ============================================================


@analysis_bp.get("/health")
def health():
    return jsonify(
        {
            "success": True,
            "service": "AI Analysis API",
            "status": "healthy",
            "version": "4.0.0",
        }
    ), 200
