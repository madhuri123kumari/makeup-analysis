"""
REAL AI ACNE SEVERITY ANALYZER
================================

Model:
    imfarzanansari/skintelligent-acne

Model classes:
    Level -1 -> Clear Skin
    Level  0 -> Occasional Spots
    Level  1 -> Mild Acne
    Level  2 -> Moderate Acne
    Level  3 -> Severe Acne
    Level  4 -> Very Severe Acne

Dashboard categories:
    Clear / Occasional -> Low
    Mild / Moderate    -> Medium
    Severe / Very Severe -> High

IMPORTANT:
    This is an AI image-classification estimate.
    It is NOT a medical diagnosis.

There is:
    - NO random prediction
    - NO hard-coded acne score
    - NO OpenCV acne heuristic
    - NO "Average" fallback
    - NO fake confidence
"""

from __future__ import annotations

import logging
import re
from typing import Any

import cv2
import numpy as np

LOGGER = logging.getLogger("AcneAI")


class AcneAnalyzer:
    """
    Real pretrained AI acne-severity classifier.
    """

    MODEL_ID = "imfarzanansari/skintelligent-acne"

    def __init__(self) -> None:
        LOGGER.info("Initializing REAL AI Acne Analyzer...")

        self._torch = None
        self._processor = None
        self._model = None

        self._load_model()

        LOGGER.info("REAL AI Acne Analyzer initialized successfully.")

    # ==========================================================
    # LOAD REAL AI MODEL
    # ==========================================================

    def _load_model(self) -> None:
        try:
            import torch

            from transformers import (
                AutoImageProcessor,
                AutoModelForImageClassification,
            )

            self._torch = torch

            LOGGER.info(
                "Loading REAL acne AI model: %s",
                self.MODEL_ID,
            )

            self._processor = AutoImageProcessor.from_pretrained(self.MODEL_ID)

            self._model = AutoModelForImageClassification.from_pretrained(self.MODEL_ID)

            self._model.eval()

            LOGGER.info("REAL acne AI model loaded successfully.")

            LOGGER.info(
                "Acne model labels: %s",
                self._model.config.id2label,
            )

        except Exception as exc:
            LOGGER.exception("Failed to load REAL acne AI model.")

            raise RuntimeError(
                "REAL acne AI model could not be loaded. "
                "Check PyTorch, Transformers and internet/model "
                "download availability."
            ) from exc

    # ==========================================================
    # PUBLIC ANALYSIS
    # ==========================================================

    def analyze(
        self,
        face: np.ndarray,
    ) -> dict[str, Any]:
        """
        Run real AI inference on a detected face.

        The model itself produces the acne severity
        probabilities. We do not calculate acne from
        redness, texture or saturation.
        """

        if self._model is None:
            raise RuntimeError("Acne AI model is not initialized.")

        if self._processor is None:
            raise RuntimeError("Acne AI image processor is not initialized.")

        if face is None or face.size == 0:
            raise ValueError("Invalid face image supplied to AcneAnalyzer.")

        height, width = face.shape[:2]

        if height < 100 or width < 100:
            raise ValueError("Face resolution is too small for acne AI analysis.")

        # ------------------------------------------------------
        # BGR -> RGB
        # ------------------------------------------------------

        rgb_face = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2RGB,
        )

        from PIL import Image

        image = Image.fromarray(rgb_face)

        # ------------------------------------------------------
        # MODEL PREPROCESSING
        # ------------------------------------------------------

        inputs = self._processor(
            images=image,
            return_tensors="pt",
        )

        # ------------------------------------------------------
        # REAL MODEL INFERENCE
        # ------------------------------------------------------

        with self._torch.inference_mode():
            outputs = self._model(**inputs)

            probabilities = self._torch.softmax(
                outputs.logits,
                dim=-1,
            )[0]

        # ------------------------------------------------------
        # READ EVERY MODEL CLASS
        # ------------------------------------------------------

        predictions: list[dict[str, Any]] = []

        for index, probability in enumerate(probabilities):
            raw_label = self._model.config.id2label.get(
                index,
                str(index),
            )

            confidence = float(probability.item())

            ai_level = self._extract_level(raw_label)

            predictions.append(
                {
                    "label": str(raw_label),
                    "ai_level": ai_level,
                    "confidence": round(
                        confidence,
                        6,
                    ),
                }
            )

        # Highest-probability class first.
        predictions.sort(
            key=lambda item: item["confidence"],
            reverse=True,
        )

        if not predictions:
            raise RuntimeError("Acne AI model returned no predictions.")

        best = predictions[0]

        # ------------------------------------------------------
        # REAL MODEL RESULT
        # ------------------------------------------------------

        ai_level = best["ai_level"]

        if ai_level is None:
            raise RuntimeError(
                f"Unable to interpret acne AI model output: {best['label']}"
            )

        # ------------------------------------------------------
        # USER'S REQUIRED CATEGORIES
        # ------------------------------------------------------

        dashboard_level = self._map_dashboard_level(ai_level)

        # This is ONLY a representation of the
        # model's predicted class. It is NOT an
        # independently calculated acne score.
        severity_score = self._class_score(ai_level)

        result = {
            "value": dashboard_level,
            "score": severity_score,
            "confidence": round(
                best["confidence"],
                4,
            ),
            "ai_level": ai_level,
            "ai_label": best["label"],
            "model": self.MODEL_ID,
            "predictions": predictions,
            "method": (
                "Real pretrained Vision Transformer acne severity classification"
            ),
            "real_ai": True,
            "heuristic": False,
        }

        LOGGER.info(
            "REAL ACNE AI RESULT | "
            "label=%s | "
            "level=%s | "
            "confidence=%.4f | "
            "dashboard=%s",
            best["label"],
            ai_level,
            best["confidence"],
            dashboard_level,
        )

        return result

    # ==========================================================
    # EXTRACT AI SEVERITY LEVEL
    # ==========================================================

    @staticmethod
    def _extract_level(
        label: str,
    ) -> int | None:
        """
        Extract the model severity level.

        Examples:
            Level -1: Clear Skin
            Level 0: Occasional Spots
            Level 1: Mild Acne
            Level 2: Moderate Acne
            Level 3: Severe Acne
            Level 4: Very Severe Acne
        """

        text = str(label).strip()

        # Preferred format:
        # "Level 2: Moderate Acne"
        match = re.search(
            r"level\s*(-?\d+)",
            text,
            flags=re.IGNORECASE,
        )

        if match:
            return int(match.group(1))

        # Fallback only for interpreting
        # the MODEL'S label.
        #
        # This does NOT create a prediction.
        match = re.search(
            r"(-?\d+)",
            text,
        )

        if match:
            value = int(match.group(1))

            if -1 <= value <= 4:
                return value

        return None

    # ==========================================================
    # MAP MODEL CLASS TO USER CATEGORY
    # ==========================================================

    @staticmethod
    def _map_dashboard_level(
        ai_level: int,
    ) -> str:
        """
        Convert the model's six severity classes
        into the three categories requested by the user.

        -1 = Clear Skin
         0 = Occasional Spots

         1 = Mild Acne
         2 = Moderate Acne

         3 = Severe Acne
         4 = Very Severe Acne
        """

        if ai_level <= 0:
            return "Low"

        if ai_level <= 2:
            return "Medium"

        return "High"

    # ==========================================================
    # CLASS REPRESENTATION
    # ==========================================================

    @staticmethod
    def _class_score(
        ai_level: int,
    ) -> float:
        """
        Represents the predicted class on a 0-100 scale.

        IMPORTANT:
        This is NOT a new AI prediction.

        It is only a numerical representation of
        the class already predicted by the model.
        """

        class_scores = {
            -1: 0.0,
            0: 15.0,
            1: 35.0,
            2: 55.0,
            3: 75.0,
            4: 95.0,
        }

        if ai_level not in class_scores:
            raise ValueError(f"Unsupported acne AI level: {ai_level}")

        return class_scores[ai_level]

    # ==========================================================
    # HEALTH CHECK
    # ==========================================================

    def health(
        self,
    ) -> dict[str, Any]:
        return {
            "service": "AcneAnalyzer",
            "status": ("ready" if self._model is not None else "not_ready"),
            "model": self.MODEL_ID,
            "engine": ("Vision Transformer image classification"),
            "real_ai": True,
            "heuristic": False,
            "demo_mode": False,
            "classes": [
                "Level -1: Clear Skin",
                "Level 0: Occasional Spots",
                "Level 1: Mild Acne",
                "Level 2: Moderate Acne",
                "Level 3: Severe Acne",
                "Level 4: Very Severe Acne",
            ],
            "dashboard_mapping": {
                "clear_skin": "Low",
                "occasional_spots": "Low",
                "mild_acne": "Medium",
                "moderate_acne": "Medium",
                "severe_acne": "High",
                "very_severe_acne": "High",
            },
        }
