"""
==============================================================
AI Makeup Analysis Guide

Professional Eye Analyzer

Python 3.12+

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from math import hypot
from time import perf_counter
from typing import Any

from config import LOGGER


class EyeAnalyzer:
    """
    Analyze eye geometry using facial landmarks.
    """

    def __init__(self) -> None:
        LOGGER.info("EyeAnalyzer initialized.")

    def analyze(
        self,
        landmarks: dict[str, dict[str, float]],
    ) -> dict[str, Any]:
        """
        Analyze eye features.
        """

        start = perf_counter()

        self._validate(landmarks)

        left = landmarks["left_eye"]
        right = landmarks["right_eye"]

        distance = self._distance(left, right)
        symmetry = self._symmetry(left, right)
        spacing = self._spacing(distance)

        center = {
            "x": round((left["x"] + right["x"]) / 2, 2),
            "y": round((left["y"] + right["y"]) / 2, 2),
        }

        elapsed = round((perf_counter() - start) * 1000, 2)

        LOGGER.info(
            "Eye analysis completed in %.2f ms.",
            elapsed,
        )

        return {
            "success": True,
            "processing_time_ms": elapsed,
            "eye_center": center,
            "eye_distance": round(distance, 2),
            "eye_symmetry": round(symmetry, 2),
            "eye_spacing": spacing,
        }

    @staticmethod
    def _validate(
        landmarks: dict[str, dict[str, float]],
    ) -> None:
        required = {"left_eye", "right_eye"}

        missing = required - set(landmarks)

        if missing:
            raise ValueError(f"Missing eye landmarks: {sorted(missing)}")

    @staticmethod
    def _distance(
        left: dict[str, float],
        right: dict[str, float],
    ) -> float:
        return hypot(
            right["x"] - left["x"],
            right["y"] - left["y"],
        )

    @staticmethod
    def _symmetry(
        left: dict[str, float],
        right: dict[str, float],
    ) -> float:
        vertical = abs(left["y"] - right["y"])
        return max(0.0, 100.0 - (vertical * 2.0))

    @staticmethod
    def _spacing(
        distance: float,
    ) -> str:
        if distance < 45:
            return "Close Set"

        if distance > 75:
            return "Wide Set"

        return "Average"

    def health(
        self,
    ) -> dict[str, Any]:
        return {
            "service": "EyeAnalyzer",
            "status": "ready",
            "supported_spacing": [
                "Close Set",
                "Average",
                "Wide Set",
            ],
        }


# End of eye_analyzer.py
