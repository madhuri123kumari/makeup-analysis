"""
==============================================================
AI Makeup Analysis Guide

Professional Beauty Score

Python 3.12+

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from typing import Any

from config import LOGGER


class BeautyScore:
    """
    Calculates an overall beauty score from analysis results.
    """

    def __init__(self) -> None:
        LOGGER.info("BeautyScore initialized.")

    def calculate(
        self,
        analysis: dict[str, Any],
    ) -> dict[str, Any]:
        skin = analysis.get("skin_analysis", {})
        face = analysis.get("face_shape", {})
        eye = analysis.get("eye_analysis", {})
        lip = analysis.get("lip_analysis", {})

        skin_score = self._skin_score(skin)
        face_score = self._face_score(face)
        eye_score = self._eye_score(eye)
        lip_score = self._lip_score(lip)

        overall = round(
            (skin_score + face_score + eye_score + lip_score) / 4,
            2,
        )

        return {
            "overall_score": overall,
            "grade": self._grade(overall),
            "scores": {
                "skin": skin_score,
                "face": face_score,
                "eyes": eye_score,
                "lips": lip_score,
            },
        }

    @staticmethod
    def _skin_score(
        skin: dict[str, Any],
    ) -> float:
        brightness = float(skin.get("brightness", 120))
        contrast = float(skin.get("contrast", 30))
        score = 60.0 + min(brightness / 4.0, 25.0) + min(contrast / 5.0, 15.0)
        return round(min(score, 100.0), 2)

    @staticmethod
    def _face_score(
        face: dict[str, Any],
    ) -> float:
        shape = face.get("face_shape", "Oval")
        values = {
            "Oval": 95.0,
            "Heart": 92.0,
            "Diamond": 91.0,
            "Square": 88.0,
            "Round": 87.0,
            "Oblong": 86.0,
        }
        return values.get(shape, 85.0)

    @staticmethod
    def _eye_score(
        eye: dict[str, Any],
    ) -> float:
        symmetry = float(eye.get("eye_symmetry", 90))
        return round(min(max(symmetry, 0.0), 100.0), 2)

    @staticmethod
    def _lip_score(
        lip: dict[str, Any],
    ) -> float:
        shape = lip.get("lip_shape", "Medium")
        values = {
            "Full": 95.0,
            "Medium": 90.0,
            "Thin": 85.0,
        }
        return values.get(shape, 88.0)

    @staticmethod
    def _grade(
        score: float,
    ) -> str:
        if score >= 90:
            return "Excellent"
        if score >= 80:
            return "Very Good"
        if score >= 70:
            return "Good"
        if score >= 60:
            return "Average"
        return "Needs Improvement"


# End of beauty_score.py
