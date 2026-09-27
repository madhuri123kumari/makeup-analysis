"""
AI Makeup Analysis Guide
Application Configuration
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


# ============================================================
# PROJECT
# ============================================================

PROJECT_NAME = "AI Makeup Analysis Guide"
PROJECT_VERSION = "4.0.0"


# ============================================================
# BASE DIRECTORIES
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOADS_DIR = BASE_DIR / "uploads"
TEMP_DIR = BASE_DIR / "temp"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv(BASE_DIR / ".env")


# ============================================================
# FLASK CONFIGURATION
# ============================================================


@dataclass(frozen=True)
class FlaskConfig:
    host: str
    port: int
    debug: bool
    secret_key: str
    max_content_length: int


flask_config = FlaskConfig(
    host=os.getenv("FLASK_HOST", "127.0.0.1"),
    port=int(os.getenv("FLASK_PORT", "5000")),
    debug=os.getenv("FLASK_DEBUG", "True").lower() == "true",
    secret_key=os.getenv(
        "SECRET_KEY",
        "development-secret-key-change-this",
    ),
    max_content_length=10 * 1024 * 1024,
)


# ============================================================
# AI CONFIGURATION
# ============================================================


@dataclass(frozen=True)
class AIConfig:
    model_name: str
    providers: tuple[str, ...]
    detection_size: tuple[int, int]
    detection_threshold: float


ai_config = AIConfig(
    model_name=os.getenv(
        "AI_MODEL_NAME",
        "buffalo_l",
    ),
    providers=("CPUExecutionProvider",),
    detection_size=(640, 640),
    detection_threshold=0.50,
)


# ============================================================
# IMAGE CONFIGURATION
# ============================================================

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


def is_allowed_image(filename: str) -> bool:
    """
    Check whether an uploaded filename has a supported
    image extension.
    """

    extension = Path(filename).suffix.lower()

    return extension in ALLOWED_IMAGE_EXTENSIONS


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format=("%(asctime)s | %(levelname)s | %(name)s | %(message)s"),
)

LOGGER = logging.getLogger(PROJECT_NAME)
