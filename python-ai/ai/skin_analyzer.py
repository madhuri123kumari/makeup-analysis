"""
AI Makeup Analysis Guide
========================

Professional Skin Analysis Engine

REAL AI / COMPUTER VISION PIPELINE

1. InsightFace
   - Face detection is supplied by the caller.
   - This class receives the detected face region.

2. Hugging Face Vision Transformer
   - Real skin-type classification.
   - Model:
       dima806/skin_types_image_detection

3. Real Acne AI
   - Dedicated pretrained acne-severity classifier.
   - Model:
       imfarzanansari/skintelligent-acne

4. OpenCV
   - Skin tone measurement
   - Undertone measurement
   - Redness measurement
   - Texture measurement
   - Uniformity measurement
   - Image quality measurement
   - Under-eye darkness estimate

IMPORTANT
---------
There are NO:
- random predictions
- demo predictions
- hard-coded acne predictions
- "Average" fallback
- fake confidence
- OpenCV acne heuristic

Acne prediction comes from AcneAnalyzer.

Medical disclaimer:
Image analysis is an estimate and is not a medical diagnosis.
"""

from __future__ import annotations

from pathlib import Path
from time import perf_counter
from typing import Any

import cv2
import numpy as np

from config import LOGGER
from ai.acne_analyzer import AcneAnalyzer


class SkinAnalyzer:
    """
    Professional skin-analysis component.

    REAL ML:
        Skin type:
            dima806/skin_types_image_detection

        Acne:
            imfarzanansari/skintelligent-acne

    Computer vision:
        Skin tone
        Undertone
        Redness
        Texture
        Uniformity
        Dark-circle appearance
        Image quality
    """

    SKIN_TYPE_MODEL_ID = "dima806/skin_types_image_detection"

    def __init__(self) -> None:
        LOGGER.info("Initializing REAL ML SkinAnalyzer...")

        # ------------------------------------------------------
        # Skin-type model
        # ------------------------------------------------------

        self._processor = None
        self._model = None
        self._torch = None

        # ------------------------------------------------------
        # Dedicated acne AI model
        # ------------------------------------------------------

        self.acne_analyzer = None

        # Load skin-type model
        self._load_skin_type_model()

        # Load dedicated acne model
        self._load_acne_model()

        LOGGER.info("REAL ML SkinAnalyzer initialized successfully.")

    # ==========================================================
    # SKIN TYPE MODEL
    # ==========================================================

    def _load_skin_type_model(self) -> None:
        try:
            import torch

            from transformers import (
                AutoImageProcessor,
                AutoModelForImageClassification,
            )

            self._torch = torch

            LOGGER.info(
                "Loading skin-type AI model: %s",
                self.SKIN_TYPE_MODEL_ID,
            )

            self._processor = AutoImageProcessor.from_pretrained(
                self.SKIN_TYPE_MODEL_ID
            )

            self._model = AutoModelForImageClassification.from_pretrained(
                self.SKIN_TYPE_MODEL_ID
            )

            self._model.eval()

            LOGGER.info("REAL skin-type AI model loaded successfully.")

            LOGGER.info(
                "Skin-type labels: %s",
                self._model.config.id2label,
            )

        except Exception as exc:
            LOGGER.exception("REAL skin-type AI model could not be loaded.")

            raise RuntimeError(
                "Skin-type AI model initialization failed. "
                "Install the required ML dependencies and "
                "ensure the model can be downloaded."
            ) from exc

    # ==========================================================
    # ACNE MODEL
    # ==========================================================

    def _load_acne_model(self) -> None:
        try:
            self.acne_analyzer = AcneAnalyzer()

            LOGGER.info("REAL acne AI model connected successfully.")

        except Exception as exc:
            LOGGER.exception("REAL acne AI model could not be initialized.")

            raise RuntimeError(
                "Acne AI initialization failed. "
                "The application will not use a fake acne "
                "fallback."
            ) from exc

    # ==========================================================
    # PUBLIC API
    # ==========================================================

    def analyze(
        self,
        image_path: str | Path,
        face_box: dict[str, int],
    ) -> dict[str, Any]:
        start = perf_counter()

        # ------------------------------------------------------
        # LOAD IMAGE
        # ------------------------------------------------------

        image = self._load_image(image_path)

        # ------------------------------------------------------
        # EXTRACT DETECTED FACE
        # ------------------------------------------------------

        face = self._extract_face(
            image,
            face_box,
        )

        if face.shape[0] < 100 or face.shape[1] < 100:
            raise ValueError(
                "Face region is too small for reliable skin and acne analysis."
            )

        # ------------------------------------------------------
        # IMAGE QUALITY
        # ------------------------------------------------------

        quality = self._image_quality(face)

        # ------------------------------------------------------
        # SKIN PIXELS
        # ------------------------------------------------------

        skin_pixels, mask_ratio = self._extract_skin_pixels(face)

        if len(skin_pixels) < 500:
            return {
                "success": False,
                "available": False,
                "message": (
                    "Insufficient visible skin pixels for reliable skin analysis."
                ),
                "confidence": 0.0,
                "image_quality": quality,
            }

        # ======================================================
        # REAL AI SKIN TYPE
        # ======================================================

        skin_type = self._predict_skin_type(face)

        # ======================================================
        # REAL AI ACNE
        # ======================================================

        if self.acne_analyzer is None:
            raise RuntimeError("Acne AI analyzer is unavailable.")

        acne_result = self.acne_analyzer.analyze(face)

        # ======================================================
        # COLOR ANALYSIS
        # ======================================================

        hsv = cv2.cvtColor(
            skin_pixels.reshape(
                -1,
                1,
                3,
            ),
            cv2.COLOR_BGR2HSV,
        ).reshape(
            -1,
            3,
        )

        lab = cv2.cvtColor(
            skin_pixels.reshape(
                -1,
                1,
                3,
            ),
            cv2.COLOR_BGR2LAB,
        ).reshape(
            -1,
            3,
        )

        bgr_median = np.median(
            skin_pixels,
            axis=0,
        )

        hsv_median = np.median(
            hsv,
            axis=0,
        )

        lab_median = np.median(
            lab,
            axis=0,
        )

        luminance = float(lab_median[0])

        a_channel = float(lab_median[1])

        b_channel = float(lab_median[2])

        saturation = float(hsv_median[1])

        brightness = float(hsv_median[2])

        # ======================================================
        # SKIN TONE
        # ======================================================

        skin_tone = self._estimate_skin_tone(luminance)

        # ======================================================
        # UNDERTONE
        # ======================================================

        undertone = self._estimate_undertone(
            a_channel=a_channel,
            b_channel=b_channel,
            bgr=bgr_median,
        )

        # ======================================================
        # REDNESS
        # ======================================================

        redness = self._redness_score(skin_pixels)

        # ======================================================
        # TEXTURE
        # ======================================================

        texture = self._texture_score(face)

        # ======================================================
        # UNIFORMITY
        # ======================================================

        uniformity = self._skin_uniformity(skin_pixels)

        # ======================================================
        # DARK CIRCLES
        # ======================================================

        dark_circle_result = self._analyze_dark_circles(face)

        # ======================================================
        # OVERALL CONFIDENCE
        # ======================================================

        confidence = self._calculate_confidence(
            face=face,
            mask_ratio=mask_ratio,
            quality=quality,
            pixel_count=len(skin_pixels),
            model_confidence=skin_type["confidence"],
        )

        elapsed = round(
            (perf_counter() - start) * 1000,
            2,
        )

        # ======================================================
        # FINAL RESULT
        # ======================================================

        result = {
            "success": True,
            "available": True,
            "processing_time_ms": elapsed,
            # --------------------------------------------------
            # SKIN TONE
            # --------------------------------------------------
            "skin_tone": {
                "value": skin_tone,
                "confidence": confidence,
                "method": ("Facial skin-pixel Lab luminance analysis"),
            },
            # --------------------------------------------------
            # UNDERTONE
            # --------------------------------------------------
            "undertone": {
                "value": undertone,
                "confidence": confidence,
                "method": ("Facial skin-pixel Lab/BGR color analysis"),
            },
            # --------------------------------------------------
            # SKIN TYPE - REAL AI
            # --------------------------------------------------
            "skin_type": {
                "value": skin_type["label"],
                "confidence": skin_type["confidence"],
                "model": self.SKIN_TYPE_MODEL_ID,
                "model_predictions": skin_type["predictions"],
                "method": ("Fine-tuned Vision Transformer image classification"),
            },
            # --------------------------------------------------
            # ACNE - REAL AI
            # --------------------------------------------------
            "acne_level": acne_result,
            # --------------------------------------------------
            # DARK CIRCLES
            # --------------------------------------------------
            "dark_circles": dark_circle_result,
            # --------------------------------------------------
            # MEASUREMENTS
            # --------------------------------------------------
            "measurements": {
                "luminance": round(
                    luminance,
                    2,
                ),
                "chroma_a": round(
                    a_channel,
                    2,
                ),
                "chroma_b": round(
                    b_channel,
                    2,
                ),
                "saturation": round(
                    saturation,
                    2,
                ),
                "brightness": round(
                    brightness,
                    2,
                ),
                "redness": round(
                    redness,
                    2,
                ),
                "texture": round(
                    texture,
                    2,
                ),
                "uniformity": round(
                    uniformity,
                    2,
                ),
            },
            # --------------------------------------------------
            # IMAGE QUALITY
            # --------------------------------------------------
            "image_quality": quality,
            # --------------------------------------------------
            # ANALYSIS METHODS
            # --------------------------------------------------
            "analysis_method": {
                "skin_type": ("Fine-tuned Vision Transformer"),
                "skin_color": ("OpenCV facial skin-pixel analysis"),
                "acne": ("Dedicated pretrained acne severity Vision Transformer"),
                "dark_circles": (
                    "OpenCV bilateral under-eye region luminance analysis"
                ),
                "face_region": ("InsightFace detected face bounding box"),
            },
            # --------------------------------------------------
            # REAL AI FLAGS
            # --------------------------------------------------
            "ai_status": {
                "skin_type": True,
                "acne": True,
                "acne_heuristic": False,
                "acne_demo": False,
                "fake_prediction": False,
            },
            "disclaimer": (
                "AI image analysis is an estimate and is not a medical diagnosis."
            ),
        }

        # ======================================================
        # LOG
        # ======================================================

        LOGGER.info(
            "REAL skin analysis completed | "
            "type=%s | "
            "type_confidence=%.3f | "
            "acne=%s | "
            "acne_confidence=%.3f | "
            "dark_circles=%s | "
            "time=%.2fms",
            skin_type["label"],
            skin_type["confidence"],
            acne_result["value"],
            acne_result["confidence"],
            dark_circle_result["value"],
            elapsed,
        )

        return result

    # ==========================================================
    # REAL ML SKIN TYPE PREDICTION
    # ==========================================================

    def _predict_skin_type(
        self,
        face: np.ndarray,
    ) -> dict[str, Any]:
        if self._model is None:
            raise RuntimeError("Skin AI model is not initialized.")

        if self._processor is None:
            raise RuntimeError("Skin image processor is not initialized.")

        rgb = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2RGB,
        )

        from PIL import Image

        pil_image = Image.fromarray(rgb)

        inputs = self._processor(
            images=pil_image,
            return_tensors="pt",
        )

        with self._torch.inference_mode():
            outputs = self._model(**inputs)

            probabilities = self._torch.softmax(
                outputs.logits,
                dim=-1,
            )[0]

        predictions = []

        for index, probability in enumerate(probabilities):
            label = self._model.config.id2label.get(
                index,
                str(index),
            )

            predictions.append(
                {
                    "label": str(label).lower(),
                    "confidence": round(
                        float(probability.item()),
                        4,
                    ),
                }
            )

        predictions.sort(
            key=lambda item: item["confidence"],
            reverse=True,
        )

        if not predictions:
            raise RuntimeError("Skin AI model returned no predictions.")

        best = predictions[0]

        return {
            "label": best["label"],
            "confidence": best["confidence"],
            "predictions": predictions,
        }

    # ==========================================================
    # IMAGE LOADING
    # ==========================================================

    @staticmethod
    def _load_image(
        image_path: str | Path,
    ) -> np.ndarray:
        path = Path(image_path)

        if not path.exists():
            raise FileNotFoundError(f"Image does not exist: {path}")

        image = cv2.imread(
            str(path),
            cv2.IMREAD_COLOR,
        )

        if image is None:
            raise ValueError(f"Unable to decode image: {path}")

        return image

    # ==========================================================
    # FACE ROI
    # ==========================================================

    @staticmethod
    def _extract_face(
        image: np.ndarray,
        face_box: dict[str, int],
    ) -> np.ndarray:
        height, width = image.shape[:2]

        x1 = max(
            0,
            int(face_box["x1"]),
        )

        y1 = max(
            0,
            int(face_box["y1"]),
        )

        x2 = min(
            width,
            int(face_box["x2"]),
        )

        y2 = min(
            height,
            int(face_box["y2"]),
        )

        if x2 <= x1 or y2 <= y1:
            raise ValueError("Invalid face bounding box.")

        face = image[
            y1:y2,
            x1:x2,
        ]

        if face.size == 0:
            raise ValueError("Empty facial region.")

        return face

    # ==========================================================
    # SKIN SEGMENTATION
    # ==========================================================

    @staticmethod
    def _extract_skin_pixels(
        face: np.ndarray,
    ) -> tuple[np.ndarray, float]:
        height, width = face.shape[:2]

        mask = np.zeros(
            (
                height,
                width,
            ),
            dtype=np.uint8,
        )

        center = (
            width // 2,
            int(height * 0.50),
        )

        axes = (
            max(
                10,
                int(width * 0.38),
            ),
            max(
                10,
                int(height * 0.45),
            ),
        )

        cv2.ellipse(
            mask,
            center,
            axes,
            0,
            0,
            360,
            255,
            -1,
        )

        hsv = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2HSV,
        )

        ycrcb = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2YCrCb,
        )

        lower_hsv = np.array(
            [0, 20, 35],
            dtype=np.uint8,
        )

        upper_hsv = np.array(
            [179, 220, 255],
            dtype=np.uint8,
        )

        hsv_mask = cv2.inRange(
            hsv,
            lower_hsv,
            upper_hsv,
        )

        lower_ycrcb = np.array(
            [35, 125, 70],
            dtype=np.uint8,
        )

        upper_ycrcb = np.array(
            [245, 180, 145],
            dtype=np.uint8,
        )

        ycrcb_mask = cv2.inRange(
            ycrcb,
            lower_ycrcb,
            upper_ycrcb,
        )

        combined = cv2.bitwise_and(
            hsv_mask,
            ycrcb_mask,
        )

        combined = cv2.bitwise_and(
            combined,
            mask,
        )

        kernel = np.ones(
            (
                5,
                5,
            ),
            np.uint8,
        )

        combined = cv2.morphologyEx(
            combined,
            cv2.MORPH_OPEN,
            kernel,
        )

        combined = cv2.morphologyEx(
            combined,
            cv2.MORPH_CLOSE,
            kernel,
        )

        pixels = face[combined > 0]

        ratio = float(
            len(pixels)
            / max(
                1,
                np.count_nonzero(mask),
            )
        )

        if len(pixels) > 1000:
            pixels_float = pixels.astype(np.float32)

            low = np.percentile(
                pixels_float,
                5,
                axis=0,
            )

            high = np.percentile(
                pixels_float,
                95,
                axis=0,
            )

            valid = np.all(
                (pixels_float >= low) & (pixels_float <= high),
                axis=1,
            )

            pixels = pixels[valid]

        return (
            pixels.astype(np.uint8),
            ratio,
        )

    # ==========================================================
    # IMAGE QUALITY
    # ==========================================================

    @staticmethod
    def _image_quality(
        face: np.ndarray,
    ) -> dict[str, Any]:
        gray = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2GRAY,
        )

        brightness = float(np.mean(gray))

        contrast = float(np.std(gray))

        sharpness = float(
            cv2.Laplacian(
                gray,
                cv2.CV_64F,
            ).var()
        )

        brightness_score = 1.0 - min(
            abs(brightness - 145.0) / 145.0,
            1.0,
        )

        contrast_score = min(
            contrast / 55.0,
            1.0,
        )

        sharpness_score = min(
            sharpness / 180.0,
            1.0,
        )

        quality = (
            brightness_score * 0.35 + contrast_score * 0.25 + sharpness_score * 0.40
        )

        quality = max(
            0.0,
            min(
                quality,
                1.0,
            ),
        )

        return {
            "score": round(
                quality,
                3,
            ),
            "brightness": round(
                brightness,
                2,
            ),
            "contrast": round(
                contrast,
                2,
            ),
            "sharpness": round(
                sharpness,
                2,
            ),
        }

    # ==========================================================
    # SKIN TONE
    # ==========================================================

    @staticmethod
    def _estimate_skin_tone(
        luminance: float,
    ) -> str:
        if luminance >= 205:
            return "Very Fair"

        if luminance >= 185:
            return "Fair"

        if luminance >= 160:
            return "Light"

        if luminance >= 135:
            return "Light Medium"

        if luminance >= 110:
            return "Medium"

        if luminance >= 85:
            return "Tan"

        if luminance >= 65:
            return "Deep"

        return "Very Deep"

    # ==========================================================
    # UNDERTONE
    # ==========================================================

    @staticmethod
    def _estimate_undertone(
        a_channel: float,
        b_channel: float,
        bgr: np.ndarray,
    ) -> str:
        red_bias = a_channel - 128.0

        yellow_bias = b_channel - 128.0

        blue = float(bgr[0])

        red = float(bgr[2])

        warm_signal = yellow_bias * 0.65 + (red - blue) * 0.35

        cool_signal = red_bias * 0.40 - yellow_bias * 0.20

        if abs(warm_signal - cool_signal) < 2.5:
            return "Neutral"

        if warm_signal > cool_signal:
            return "Warm"

        return "Cool"

    # ==========================================================
    # REDNESS
    # ==========================================================

    @staticmethod
    def _redness_score(
        pixels: np.ndarray,
    ) -> float:
        blue = pixels[
            :,
            0,
        ].astype(np.float32)

        green = pixels[
            :,
            1,
        ].astype(np.float32)

        red = pixels[
            :,
            2,
        ].astype(np.float32)

        redness = red - (green + blue) / 2.0

        score = float(
            np.mean(
                np.maximum(
                    redness,
                    0,
                )
            )
        )

        return min(
            100.0,
            score * 4.0,
        )

    # ==========================================================
    # TEXTURE
    # ==========================================================

    @staticmethod
    def _texture_score(
        face: np.ndarray,
    ) -> float:
        gray = cv2.cvtColor(
            face,
            cv2.COLOR_BGR2GRAY,
        )

        laplacian = cv2.Laplacian(
            gray,
            cv2.CV_64F,
        )

        raw_texture = float(np.std(laplacian))

        return min(
            100.0,
            raw_texture * 4.0,
        )

    # ==========================================================
    # UNIFORMITY
    # ==========================================================

    @staticmethod
    def _skin_uniformity(
        pixels: np.ndarray,
    ) -> float:
        lab = cv2.cvtColor(
            pixels.reshape(
                -1,
                1,
                3,
            ),
            cv2.COLOR_BGR2LAB,
        ).reshape(
            -1,
            3,
        )

        luminance = lab[
            :,
            0,
        ].astype(np.float32)

        variation = float(np.std(luminance))

        uniformity = 100.0 - min(
            variation * 3.0,
            100.0,
        )

        return max(
            0.0,
            uniformity,
        )

    # ==========================================================
    # DARK CIRCLES
    # ==========================================================

    @staticmethod
    def _analyze_dark_circles(
        face: np.ndarray,
    ) -> dict[str, Any]:
        height, width = face.shape[:2]

        if height < 100 or width < 100:
            return {
                "value": "Not available",
                "score": 0.0,
                "confidence": 0.0,
                "method": ("Insufficient facial resolution"),
            }

        eye_y1 = int(height * 0.30)

        eye_y2 = int(height * 0.58)

        left_x1 = int(width * 0.12)

        left_x2 = int(width * 0.47)

        right_x1 = int(width * 0.53)

        right_x2 = int(width * 0.88)

        left_region = face[
            eye_y1:eye_y2,
            left_x1:left_x2,
        ]

        right_region = face[
            eye_y1:eye_y2,
            right_x1:right_x2,
        ]

        if left_region.size == 0 or right_region.size == 0:
            return {
                "value": "Not available",
                "score": 0.0,
                "confidence": 0.0,
                "method": ("Invalid under-eye region"),
            }

        def lower_eye_area(
            region: np.ndarray,
        ) -> np.ndarray:
            h = region.shape[0]

            start = int(h * 0.52)

            return region[
                start:h,
                :,
            ]

        left_under_eye = lower_eye_area(left_region)

        right_under_eye = lower_eye_area(right_region)

        def luminance(
            region: np.ndarray,
        ) -> float:
            lab = cv2.cvtColor(
                region,
                cv2.COLOR_BGR2LAB,
            )

            return float(
                np.median(
                    lab[
                        :,
                        :,
                        0,
                    ]
                )
            )

        left_luma = luminance(left_under_eye)

        right_luma = luminance(right_under_eye)

        reference = face[
            int(height * 0.58) : int(height * 0.82),
            int(width * 0.20) : int(width * 0.80),
        ]

        if reference.size == 0:
            return {
                "value": "Not available",
                "score": 0.0,
                "confidence": 0.0,
                "method": ("Invalid facial reference region"),
            }

        reference_luma = luminance(reference)

        left_difference = max(
            0.0,
            reference_luma - left_luma,
        )

        right_difference = max(
            0.0,
            reference_luma - right_luma,
        )

        average_difference = (left_difference + right_difference) / 2.0

        score = min(
            average_difference / 45.0,
            1.0,
        )

        score_percent = round(
            score * 100.0,
            2,
        )

        if score < 0.20:
            level = "Low"

        elif score < 0.40:
            level = "Mild"

        elif score < 0.65:
            level = "Moderate"

        else:
            level = "High"

        region_pixels = (
            left_under_eye.shape[0] * left_under_eye.shape[1]
            + right_under_eye.shape[0] * right_under_eye.shape[1]
        )

        confidence = min(
            1.0,
            0.45
            + min(
                region_pixels / 50000.0,
                0.30,
            )
            + min(
                abs(left_luma - right_luma) / 100.0,
                0.25,
            ),
        )

        return {
            "value": level,
            "score": score_percent,
            "confidence": round(
                confidence,
                3,
            ),
            "signals": {
                "left_under_eye_luminance": round(
                    left_luma,
                    2,
                ),
                "right_under_eye_luminance": round(
                    right_luma,
                    2,
                ),
                "reference_luminance": round(
                    reference_luma,
                    2,
                ),
                "average_darkness_difference": round(
                    average_difference,
                    2,
                ),
            },
            "method": ("OpenCV bilateral under-eye region luminance analysis"),
        }

    # ==========================================================
    # OVERALL CONFIDENCE
    # ==========================================================

    @staticmethod
    def _calculate_confidence(
        face: np.ndarray,
        mask_ratio: float,
        quality: dict[str, Any],
        pixel_count: int,
        model_confidence: float,
    ) -> float:
        resolution_score = min(
            (face.shape[0] * face.shape[1]) / 160000.0,
            1.0,
        )

        pixel_score = min(
            pixel_count / 12000.0,
            1.0,
        )

        mask_score = min(
            mask_ratio / 0.35,
            1.0,
        )

        quality_score = float(quality["score"])

        confidence = (
            model_confidence * 0.50
            + resolution_score * 0.10
            + pixel_score * 0.15
            + mask_score * 0.10
            + quality_score * 0.15
        )

        return round(
            max(
                0.0,
                min(
                    confidence,
                    1.0,
                ),
            ),
            3,
        )

    # ==========================================================
    # HEALTH
    # ==========================================================

    def health(
        self,
    ) -> dict[str, Any]:
        acne_ready = self.acne_analyzer is not None

        skin_ready = self._model is not None and self._processor is not None

        return {
            "service": "SkinAnalyzer",
            "status": ("ready" if (acne_ready and skin_ready) else "not_ready"),
            "engine": ("Hugging Face Vision Transformer + OpenCV facial analysis"),
            "skin_type_model": self.SKIN_TYPE_MODEL_ID,
            "acne_model": (self.acne_analyzer.MODEL_ID if acne_ready else None),
            "features": [
                "skin_type",
                "skin_tone",
                "undertone",
                "acne_level",
                "dark_circles",
                "redness",
                "texture",
                "uniformity",
                "image_quality",
            ],
            "real_ai": {
                "skin_type": skin_ready,
                "acne": acne_ready,
                "acne_heuristic": False,
                "demo_mode": False,
                "fake_prediction": False,
            },
        }
