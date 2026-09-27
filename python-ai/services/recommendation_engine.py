"""
==============================================================
AI Makeup Analysis Guide

Professional Recommendation Engine

Python 3.12+

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from typing import Any

from config import LOGGER


class RecommendationEngine:
    """
    Generate makeup recommendations from AI analysis.
    """

    def __init__(self) -> None:
        LOGGER.info("RecommendationEngine initialized.")

    def generate(
        self,
        analysis: dict[str, Any],
    ) -> dict[str, Any]:
        skin = analysis.get("skin_analysis", {})
        face = analysis.get("face_shape", {})
        eye = analysis.get("eye_analysis", {})
        lip = analysis.get("lip_analysis", {})

        recommendations = {
            "foundation": self._foundation(skin),
            "concealer": self._concealer(skin),
            "primer": self._primer(skin),
            "lipstick": self._lipstick(lip),
            "eye_makeup": self._eye_makeup(eye),
            "blush": self._blush(face),
            "contour": self._contour(face),
            "highlighter": self._highlighter(skin),
            "setting_spray": self._setting_spray(),
        }

        recommendations["summary"] = self._summary(recommendations)

        return {
            "success": True,
            "recommendations": recommendations,
        }

    def _foundation(self, skin: dict[str, Any]) -> dict[str, str]:
        b = float(skin.get("brightness", 0))
        if b >= 180:
            shade = "Ivory"
        elif b >= 140:
            shade = "Natural Beige"
        elif b >= 100:
            shade = "Warm Beige"
        elif b >= 70:
            shade = "Caramel"
        else:
            shade = "Espresso"
        return {"shade": shade, "finish": "Natural"}

    def _concealer(self, skin: dict[str, Any]) -> dict[str, str]:
        return {
            "shade": self._foundation(skin)["shade"],
            "coverage": "Medium",
        }

    def _primer(self, skin: dict[str, Any]) -> dict[str, str]:
        contrast = float(skin.get("contrast", 0))
        return {
            "type": ("Pore Filling Primer" if contrast > 45 else "Hydrating Primer")
        }

    def _lipstick(self, lip: dict[str, Any]) -> dict[str, str]:
        shape = lip.get("lip_shape", "Medium")
        color = {
            "Thin": "Coral Pink",
            "Medium": "Nude Rose",
            "Full": "Berry Red",
        }.get(shape, "Nude Rose")
        return {"color": color, "finish": "Cream"}

    def _eye_makeup(self, eye: dict[str, Any]) -> dict[str, str]:
        spacing = eye.get("eye_spacing", "Average")
        style = {
            "Close Set": "Winged Eyeliner",
            "Average": "Natural Glam",
            "Wide Set": "Soft Smokey Eyes",
        }.get(spacing, "Natural Glam")
        return {"style": style}

    def _blush(self, face: dict[str, Any]) -> dict[str, str]:
        placement = {
            "Round": "High Cheekbone",
            "Square": "Diagonal",
            "Heart": "Outer Cheeks",
            "Oval": "Apple Cheeks",
            "Diamond": "Temple Blend",
            "Oblong": "Horizontal Sweep",
        }.get(face.get("face_shape", "Oval"), "Apple Cheeks")
        return {"placement": placement}

    def _contour(self, face: dict[str, Any]) -> dict[str, str]:
        return {"style": f"{face.get('face_shape', 'Natural')} Contour"}

    def _highlighter(self, skin: dict[str, Any]) -> dict[str, str]:
        b = float(skin.get("brightness", 0))
        shade = "Pearl" if b >= 170 else "Champagne" if b >= 120 else "Golden Glow"
        return {"shade": shade}

    @staticmethod
    def _setting_spray() -> dict[str, str]:
        return {"type": "Long Lasting", "finish": "Natural"}

    @staticmethod
    def _summary(data: dict[str, Any]) -> str:
        return (
            f"Foundation: {data['foundation']['shade']}, "
            f"Lipstick: {data['lipstick']['color']}, "
            f"Eyes: {data['eye_makeup']['style']}."
        )
