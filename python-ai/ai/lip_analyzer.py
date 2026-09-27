"""
AI Makeup Analysis Guide - Professional Lip Analyzer
"""

from __future__ import annotations

from math import hypot
from time import perf_counter
from typing import Any

from config import LOGGER


class LipAnalyzer:
    def __init__(self) -> None:
        LOGGER.info("LipAnalyzer initialized.")

    def analyze(self, landmarks: dict[str, dict[str, float]]) -> dict[str, Any]:
        start = perf_counter()
        self._validate(landmarks)
        left = landmarks["left_mouth"]
        right = landmarks["right_mouth"]
        width = self._distance(left, right)
        symmetry = self._symmetry(left, right)
        shape = self._classify(width)
        return {
            "success": True,
            "processing_time_ms": round((perf_counter() - start) * 1000, 2),
            "lip_center": {
                "x": round((left["x"] + right["x"]) / 2, 2),
                "y": round((left["y"] + right["y"]) / 2, 2),
            },
            "lip_width": round(width, 2),
            "lip_symmetry": round(symmetry, 2),
            "lip_shape": shape,
        }

    @staticmethod
    def _validate(landmarks: dict[str, dict[str, float]]) -> None:
        missing = {"left_mouth", "right_mouth"} - set(landmarks)
        if missing:
            raise ValueError(f"Missing lip landmarks: {sorted(missing)}")

    @staticmethod
    def _distance(left: dict[str, float], right: dict[str, float]) -> float:
        return hypot(right["x"] - left["x"], right["y"] - left["y"])

    @staticmethod
    def _symmetry(left: dict[str, float], right: dict[str, float]) -> float:
        return max(0.0, 100.0 - abs(left["y"] - right["y"]) * 2.0)

    @staticmethod
    def _classify(width: float) -> str:
        if width < 35:
            return "Thin"
        if width > 65:
            return "Full"
        return "Medium"

    def health(self) -> dict[str, Any]:
        return {
            "service": "LipAnalyzer",
            "status": "ready",
            "supported_shapes": ["Thin", "Medium", "Full"],
        }
