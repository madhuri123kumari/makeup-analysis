"""
==============================================================
AI Makeup Analysis Guide

Professional Color Palette Generator

Python 3.12+

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from typing import Any

from config import LOGGER


class ColorPalette:
    """
    Generate makeup color palettes from AI skin analysis results.

    The SkinAnalyzer returns skin_tone as a structured object:

        {
            "value": "Medium",
            "confidence": 0.85,
            "method": "..."
        }

    This class safely extracts the actual skin-tone value before
    generating the personalized color palette.
    """

    def __init__(self) -> None:
        LOGGER.info("ColorPalette initialized.")

    def generate(
        self,
        analysis: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Generate a personalized makeup color palette.

        Parameters
        ----------
        analysis:
            Complete AI analysis dictionary.

        Returns
        -------
        dict[str, Any]
            Generated color palette.
        """

        skin = analysis.get("skin_analysis", {})

        if not isinstance(skin, dict):
            raise TypeError("skin_analysis must be a dictionary.")

        # SkinAnalyzer returns skin_tone as a structured dictionary.
        tone_data = skin.get(
            "skin_tone",
            "Medium",
        )

        # Extract the actual AI-generated skin-tone value.
        if isinstance(tone_data, dict):
            tone = tone_data.get(
                "value",
                "Medium",
            )
        else:
            tone = tone_data

        # Make sure the palette functions always receive a string.
        if not isinstance(tone, str) or not tone.strip():
            tone = "Medium"

        tone = tone.strip()

        LOGGER.info(
            "Generating color palette for skin tone: %s",
            tone,
        )

        palette = {
            "foundation": self._foundation(tone),
            "blush": self._blush(tone),
            "lipstick": self._lipstick(tone),
            "eyeshadow": self._eyeshadow(tone),
            "highlighter": self._highlighter(tone),
        }

        return {
            "success": True,
            "skin_tone": tone,
            "palette": palette,
        }

    @staticmethod
    def _foundation(
        tone: str,
    ) -> list[str]:
        """
        Generate foundation shade suggestions.
        """

        return {
            "Very Fair": [
                "Ivory",
                "Porcelain",
            ],
            "Fair": [
                "Natural Beige",
                "Light Beige",
            ],
            "Medium": [
                "Warm Beige",
                "Golden Beige",
            ],
            "Tan": [
                "Caramel",
                "Honey",
            ],
            "Deep": [
                "Espresso",
                "Mocha",
            ],
        }.get(
            tone,
            ["Warm Beige"],
        )

    @staticmethod
    def _blush(
        tone: str,
    ) -> list[str]:
        """
        Generate blush shade suggestions.
        """

        return {
            "Very Fair": [
                "Soft Pink",
                "Peach",
            ],
            "Fair": [
                "Rose",
                "Coral",
            ],
            "Medium": [
                "Warm Peach",
                "Apricot",
            ],
            "Tan": [
                "Terracotta",
                "Burnt Coral",
            ],
            "Deep": [
                "Berry",
                "Brick",
            ],
        }.get(
            tone,
            ["Rose"],
        )

    @staticmethod
    def _lipstick(
        tone: str,
    ) -> list[str]:
        """
        Generate lipstick shade suggestions.
        """

        return {
            "Very Fair": [
                "Baby Pink",
                "Nude",
            ],
            "Fair": [
                "Rose",
                "Coral",
            ],
            "Medium": [
                "Mauve",
                "Nude Brown",
            ],
            "Tan": [
                "Brick Red",
                "Caramel",
            ],
            "Deep": [
                "Wine",
                "Burgundy",
            ],
        }.get(
            tone,
            ["Nude"],
        )

    @staticmethod
    def _eyeshadow(
        tone: str,
    ) -> list[str]:
        """
        Generate eyeshadow shade suggestions.
        """

        return {
            "Very Fair": [
                "Champagne",
                "Taupe",
            ],
            "Fair": [
                "Bronze",
                "Rose Gold",
            ],
            "Medium": [
                "Copper",
                "Brown",
            ],
            "Tan": [
                "Chocolate",
                "Gold",
            ],
            "Deep": [
                "Plum",
                "Espresso",
            ],
        }.get(
            tone,
            ["Brown"],
        )

    @staticmethod
    def _highlighter(
        tone: str,
    ) -> list[str]:
        """
        Generate highlighter shade suggestions.
        """

        return {
            "Very Fair": [
                "Pearl",
            ],
            "Fair": [
                "Champagne",
            ],
            "Medium": [
                "Golden",
            ],
            "Tan": [
                "Gold",
            ],
            "Deep": [
                "Bronze Gold",
            ],
        }.get(
            tone,
            ["Golden"],
        )


# End of color_palette.py
