"""
AI Makeup Analysis Guide
Professional Face Detector

InsightFace + OpenCV
CPU optimized for low-memory deployment.
"""

from __future__ import annotations

import gc
import os
from pathlib import Path
from threading import Lock
from time import perf_counter
from typing import Any


if os.name != "nt":
    os.environ.setdefault("HOME", "/tmp")

os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")
os.environ.setdefault("XDG_CACHE_HOME", "/tmp/.cache")
import cv2
from insightface.app import FaceAnalysis

from config import LOGGER, ai_config


class FaceDetector:
    """
    Production face detection service using InsightFace.

    Uses:
    - InsightFace buffalo_s model
    - CPU execution
    - 2D face landmarks
    - JSON-safe API output

    Raw InsightFace objects are kept internal.
    """

    _model: FaceAnalysis | None = None
    _lock = Lock()

    def __init__(self) -> None:
        self._model = self._load_model()

    @classmethod
    def _load_model(cls) -> FaceAnalysis:
        """
        Load the InsightFace model only once.

        Only the modules required for face detection and
        2D landmarks are loaded to reduce memory usage.
        """

        with cls._lock:
            if cls._model is None:
                LOGGER.info(
                    "Loading InsightFace model: %s",
                    ai_config.model_name,
                )

                model = FaceAnalysis(
                    name=ai_config.model_name,
                    root="/tmp/.insightface",
                    providers=list(ai_config.providers),
                    allowed_modules=[
                        "detection",
                        "landmark_2d_106",
                    ],
                )

                model.prepare(
                    ctx_id=0,
                    det_size=ai_config.detection_size,
                )

                cls._model = model

                LOGGER.info("InsightFace model loaded successfully.")

        return cls._model

    def detect(self, image_path: str | Path) -> dict[str, Any]:
        """
        Detect faces from an image.

        Returns only JSON-safe information to the Flask API.
        """

        start = perf_counter()

        image = self._load_image(image_path)

        raw_faces = self._model.get(image)

        valid_faces = [
            face
            for face in raw_faces
            if float(getattr(face, "det_score", 0.0))
            >= float(ai_config.detection_threshold)
        ]

        faces = [
            self._serialize_face(index, face)
            for index, face in enumerate(valid_faces, start=1)
        ]

        elapsed = round(
            (perf_counter() - start) * 1000,
            2,
        )

        LOGGER.info(
            "Face detection completed: %d face(s), %.2f ms.",
            len(faces),
            elapsed,
        )

        return {
            "success": bool(faces),
            "message": (
                "Face detected successfully."
                if faces
                else ("No face detected. Please upload a clear front-facing photo.")
            ),
            "processing_time_ms": elapsed,
            "total_faces": len(faces),
            "faces": faces,
            # Internal use by the analysis service.
            # These objects must not be sent directly
            # through Flask's JSON response.
            "_raw_faces": valid_faces,
        }

    @staticmethod
    def _load_image(image_path: str | Path) -> Any:
        """
        Load and validate an image using OpenCV.
        """

        path = Path(image_path)

        if not path.exists():
            raise FileNotFoundError(f"Image file not found: {path}")

        image = cv2.imread(str(path))

        if image is None:
            raise ValueError(f"Unable to decode image: {path}")

        if image.size == 0:
            raise ValueError("Uploaded image is empty.")

        return image

    @staticmethod
    def _serialize_face(
        index: int,
        face: Any,
    ) -> dict[str, Any]:
        """
        Convert an InsightFace face object into
        JSON-safe data.
        """

        bbox = face.bbox
        landmarks = face.kps

        return {
            "id": index,
            "confidence": round(
                float(face.det_score),
                4,
            ),
            "bounding_box": {
                "x1": round(float(bbox[0])),
                "y1": round(float(bbox[1])),
                "x2": round(float(bbox[2])),
                "y2": round(float(bbox[3])),
            },
            "landmarks": [
                {
                    "x": round(float(point[0]), 2),
                    "y": round(float(point[1]), 2),
                }
                for point in landmarks
            ],
        }

    def health(self) -> dict[str, Any]:
        """
        Return the current detector health status.
        """

        return {
            "service": "FaceDetector",
            "status": "ready",
            "model_loaded": self._model is not None,
            "model": ai_config.model_name,
            "provider": list(ai_config.providers),
            "detection_size": list(ai_config.detection_size),
            "detection_threshold": (ai_config.detection_threshold),
        }

    @classmethod
    def unload_model(cls) -> None:
        """
        Release the InsightFace model reference
        and request Python garbage collection.
        """

        with cls._lock:
            cls._model = None
            gc.collect()

            LOGGER.info("InsightFace model released.")
