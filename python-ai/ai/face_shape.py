"""
Face Shape Analysis
"""

from __future__ import annotations

from math import hypot
from typing import Any

from config import LOGGER


class FaceShapeAnalyzer:
    def __init__(self) -> None:
        LOGGER.info("FaceShapeAnalyzer initialized.")

    def analyze(
        self,
        face_box: dict[str, int],
        landmarks: dict[str, dict[str, float]],
    ) -> dict[str, Any]:
        width = max(
            1.0,
            float(face_box["x2"] - face_box["x1"]),
        )

        height = max(
            1.0,
            float(face_box["y2"] - face_box["y1"]),
        )

        ratio = height / width

        eye_distance = self._distance(
            landmarks["left_eye"],
            landmarks["right_eye"],
        )

        mouth_width = self._distance(
            landmarks["left_mouth"],
            landmarks["right_mouth"],
        )

        shape = self._classify(ratio)

        return {
            "success": True,
            "face_shape": shape,
            "face_ratio": round(
                ratio,
                3,
            ),
            "face_width": round(
                width,
                2,
            ),
            "face_height": round(
                height,
                2,
            ),
            "eye_distance": round(
                eye_distance,
                2,
            ),
            "mouth_width": round(
                mouth_width,
                2,
            ),
            "method": ("Face-box geometry with InsightFace landmarks"),
            "confidence": self._confidence(ratio),
        }

    @staticmethod
    def _distance(
        a: dict[str, float],
        b: dict[str, float],
    ) -> float:
        return hypot(
            b["x"] - a["x"],
            b["y"] - a["y"],
        )

    @staticmethod
    def _classify(
        ratio: float,
    ) -> str:
        if ratio >= 1.55:
            return "Oblong"

        if ratio < 1.10:
            return "Round"

        if ratio <= 1.38:
            return "Oval"

        return "Diamond"

    @staticmethod
    def _confidence(
        ratio: float,
    ) -> float:
        if 1.15 <= ratio <= 1.35 or ratio < 1.08 or ratio > 1.55:
            return 0.82

        return 0.68

    def health(self) -> dict[str, Any]:
        return {
            "service": "FaceShapeAnalyzer",
            "status": "ready",
            "method": "geometric estimation",
        }
