"""
==============================================================
AI Makeup Analysis Guide

Professional Analysis Context

Python 3.12+

Author  : Madhuri
Version : 4.0.0
==============================================================
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass(slots=True)
class AnalysisContext:
    """
    Shared context passed through the AI pipeline.
    """

    image_path: Path

    raw_faces: list[Any] = field(default_factory=list)
    face_detection: dict[str, Any] = field(default_factory=dict)
    landmarks: dict[str, Any] = field(default_factory=dict)
    skin_analysis: dict[str, Any] = field(default_factory=dict)
    face_shape: dict[str, Any] = field(default_factory=dict)
    eye_analysis: dict[str, Any] = field(default_factory=dict)
    lip_analysis: dict[str, Any] = field(default_factory=dict)
    beauty_score: dict[str, Any] = field(default_factory=dict)
    color_palette: dict[str, Any] = field(default_factory=dict)
    recommendations: dict[str, Any] = field(default_factory=dict)
    product_catalog: dict[str, Any] = field(default_factory=dict)
    report: dict[str, Any] = field(default_factory=dict)

    metadata: dict[str, Any] = field(default_factory=dict)
    processing_time_ms: float = 0.0

    def to_dict(self) -> dict[str, Any]:
        """
        Convert the context into a serializable dictionary.
        """

        return {
            "image_path": str(self.image_path),
            "face_detection": self.face_detection,
            "landmarks": self.landmarks,
            "skin_analysis": self.skin_analysis,
            "face_shape": self.face_shape,
            "eye_analysis": self.eye_analysis,
            "lip_analysis": self.lip_analysis,
            "beauty_score": self.beauty_score,
            "color_palette": self.color_palette,
            "recommendations": self.recommendations,
            "product_catalog": self.product_catalog,
            "report": self.report,
            "metadata": self.metadata,
            "processing_time_ms": self.processing_time_ms,
        }

    def reset(self) -> None:
        """
        Reset analysis results while keeping the image path.
        """

        self.raw_faces.clear()
        self.face_detection.clear()
        self.landmarks.clear()
        self.skin_analysis.clear()
        self.face_shape.clear()
        self.eye_analysis.clear()
        self.lip_analysis.clear()
        self.beauty_score.clear()
        self.color_palette.clear()
        self.recommendations.clear()
        self.product_catalog.clear()
        self.report.clear()
        self.metadata.clear()
        self.processing_time_ms = 0.0


# End of analysis_context.py
