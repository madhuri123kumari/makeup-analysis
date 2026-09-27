"""
AI Makeup Analysis Guide
Professional Face Detector

Python 3.12+
InsightFace + OpenCV
"""

from __future__ import annotations

from pathlib import Path
from threading import Lock
from time import perf_counter
from typing import Any

import cv2
from insightface.app import FaceAnalysis

from config import LOGGER, ai_config


class FaceDetector:
    """
    Production face detection service using InsightFace.

    Important:
    - InsightFace objects NEVER leave this class.
    - API responses contain JSON-safe dictionaries only.
    """

    _model: FaceAnalysis | None = None
    _lock = Lock()

    def __init__(self) -> None:
        self._model = self._load_model()

    @classmethod
    def _load_model(cls) -> FaceAnalysis:
        with cls._lock:
            if cls._model is None:
                LOGGER.info("Loading InsightFace model...")

                model = FaceAnalysis(
                    name=ai_config.model_name,
                    providers=list(ai_config.providers),
                )

                model.prepare(
                    ctx_id=0,
                    det_size=ai_config.detection_size,
                )

                cls._model = model

                LOGGER.info("InsightFace model loaded successfully.")

        return cls._model

    def detect(self, image_path: str | Path) -> dict[str, Any]:
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
                else "No face detected. Please upload a clear front-facing photo."
            ),
            "processing_time_ms": elapsed,
            "total_faces": len(faces),
            "faces": faces,
            # Internal use only.
            # Never return raw InsightFace objects to Flask.
            "_raw_faces": valid_faces,
        }

    @staticmethod
    def _load_image(image_path: str | Path) -> Any:
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
        bbox = face.bbox
        landmarks = face.kps

        return {
            "id": index,
            "confidence": round(
                float(face.det_score),
                4,
            ),
            "bounding_box": {
                "x1": int(round(float(bbox[0]))),
                "y1": int(round(float(bbox[1]))),
                "x2": int(round(float(bbox[2]))),
                "y2": int(round(float(bbox[3]))),
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
        return {
            "service": "FaceDetector",
            "status": "ready",
            "model_loaded": self._model is not None,
            "model": ai_config.model_name,
            "provider": list(ai_config.providers),
        }

    @classmethod
    def unload_model(cls) -> None:
        with cls._lock:
            cls._model = None
            LOGGER.info("InsightFace model released.")
