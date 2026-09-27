"""
==============================================================
AI Makeup Analysis Guide

Professional Face Landmarks

Python 3.12+
InsightFace

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from time import perf_counter
from typing import Any

import numpy as np
from config import LOGGER


class FaceLandmarks:
    """
    Extract and organize facial landmarks from an
    InsightFace detection result.
    """

    LANDMARK_NAMES: tuple[str, ...] = (
        "left_eye",
        "right_eye",
        "nose",
        "left_mouth",
        "right_mouth",
    )

    def __init__(self) -> None:
        LOGGER.info("FaceLandmarks initialized.")

    def extract(
        self,
        face: Any,
    ) -> dict[str, Any]:
        """
        Extract named facial landmarks.
        """

        start = perf_counter()

        self._validate_face(face)

        points = np.asarray(
            face.kps,
            dtype=np.float32,
        )

        landmarks = self._create_landmark_map(points)
        center = self._face_center(points)

        elapsed = round(
            (perf_counter() - start) * 1000,
            2,
        )

        LOGGER.info(
            "Landmarks extracted in %.2f ms.",
            elapsed,
        )

        return {
            "success": True,
            "processing_time_ms": elapsed,
            "total_landmarks": len(points),
            "landmarks": landmarks,
            "face_center": center,
        }

    @staticmethod
    def _validate_face(
        face: Any,
    ) -> None:
        if face is None:
            raise ValueError("Face cannot be None.")

        if not hasattr(face, "kps"):
            raise ValueError("Missing facial landmarks.")

        if len(face.kps) != 5:
            raise ValueError("InsightFace must provide exactly five landmarks.")

    def _create_landmark_map(
        self,
        points: np.ndarray,
    ) -> dict[str, dict[str, float]]:
        result: dict[str, dict[str, float]] = {}

        for name, point in zip(
            self.LANDMARK_NAMES,
            points,
            strict=True,
        ):
            result[name] = {
                "x": float(point[0]),
                "y": float(point[1]),
            }

        return result

    @staticmethod
    def _face_center(
        points: np.ndarray,
    ) -> dict[str, float]:
        center = points.mean(axis=0)

        return {
            "x": float(center[0]),
            "y": float(center[1]),
        }

    def health(
        self,
    ) -> dict[str, Any]:
        return {
            "service": "FaceLandmarks",
            "status": "ready",
            "supported_landmarks": len(self.LANDMARK_NAMES),
        }


# End of face_landmarks.py
