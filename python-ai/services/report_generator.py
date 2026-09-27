"""
==============================================================
AI Makeup Analysis Guide

Professional Report Generator

Python 3.12+

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from config import LOGGER, PROJECT_NAME, PROJECT_VERSION


class ReportGenerator:
    """
    Build structured reports from AI analysis.
    """

    def __init__(self) -> None:
        LOGGER.info("ReportGenerator initialized.")

    def generate(
        self,
        analysis: dict[str, Any],
        recommendations: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Generate the complete report.
        """

        report = {
            "metadata": self._metadata(),
            "generated_at": datetime.now(
                UTC,
            ).isoformat(
                timespec="seconds",
            ),
            "analysis": analysis,
            "recommendations": recommendations,
            "summary": self._summary(
                analysis,
                recommendations,
            ),
            "statistics": self._statistics(
                analysis,
            ),
            "beauty_profile": self._beauty_profile(
                analysis,
                recommendations,
            ),
        }

        LOGGER.info("Report generated successfully.")

        return report

    @staticmethod
    def _summary(
        analysis: dict[str, Any],
        recommendations: dict[str, Any],
    ) -> dict[str, Any]:
        return {
            "face_shape": analysis.get(
                "face_shape",
                {},
            ).get(
                "face_shape",
                "Unknown",
            ),
            "skin_tone": analysis.get(
                "skin_analysis",
                {},
            ).get(
                "skin_tone",
                "Unknown",
            ),
            "foundation": recommendations.get(
                "recommendations",
                {},
            )
            .get(
                "foundation",
                {},
            )
            .get(
                "shade",
                "Unknown",
            ),
        }

    @staticmethod
    def _statistics(
        analysis: dict[str, Any],
    ) -> dict[str, Any]:
        skin = analysis.get("skin_analysis", {})

        return {
            "brightness": skin.get("brightness", 0),
            "contrast": skin.get("contrast", 0),
        }

    @staticmethod
    def _beauty_profile(
        analysis: dict[str, Any],
        recommendations: dict[str, Any],
    ) -> dict[str, Any]:
        return {
            "skin": analysis.get("skin_analysis", {}),
            "eyes": analysis.get("eye_analysis", {}),
            "lips": analysis.get("lip_analysis", {}),
            "face": analysis.get("face_shape", {}),
            "makeup": recommendations.get(
                "recommendations",
                {},
            ),
        }

    @staticmethod
    def _metadata() -> dict[str, str]:
        return {
            "application": PROJECT_NAME,
            "version": PROJECT_VERSION,
            "generator": "Professional Report Generator",
        }


# End of report_generator.py
