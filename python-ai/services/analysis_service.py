"""
AI Makeup Analysis Guide
Professional Analysis Service

Pipeline:
Image
  -> Face Detection
  -> Facial Landmarks
  -> Real AI Skin Analysis
  -> Face Shape Analysis
  -> Eye Analysis
  -> Lip Analysis
  -> Beauty Metrics
  -> Color Palette
  -> Personalized Makeup Recommendations
  -> Personalized Product Compatibility Ranking
  -> Professional Report
"""

from __future__ import annotations

from pathlib import Path
from time import perf_counter
from typing import Any

from ai.eye_analyzer import EyeAnalyzer
from ai.face_detector import FaceDetector
from ai.face_landmarks import FaceLandmarks
from ai.face_shape import FaceShapeAnalyzer
from ai.lip_analyzer import LipAnalyzer
from ai.skin_analyzer import SkinAnalyzer

from config import LOGGER

from services.beauty_score import BeautyScore
from services.color_palette import ColorPalette
from services.product_recommender import ProductRecommender
from services.recommendation_engine import RecommendationEngine
from services.report_generator import ReportGenerator


class AnalysisService:
    """
    Main orchestration layer for the AI Makeup Analysis Guide.

    This service coordinates all AI/analysis modules and produces
    one structured response for the frontend.

    Important:
    - No random predictions.
    - No demo predictions.
    - No fake AI confidence.
    - Product recommendations are ranked from the actual
      analysis profile returned by the AI pipeline.
    """

    VERSION = "5.0.0"

    def __init__(self) -> None:
        LOGGER.info("Initializing AnalysisService...")

        # ---------------------------------------------------------
        # Core AI analyzers
        # ---------------------------------------------------------
        self.detector = FaceDetector()
        self.landmarks = FaceLandmarks()

        self.skin = SkinAnalyzer()
        self.face_shape = FaceShapeAnalyzer()
        self.eye = EyeAnalyzer()
        self.lip = LipAnalyzer()

        # ---------------------------------------------------------
        # Analysis and recommendation services
        # ---------------------------------------------------------
        self.beauty = BeautyScore()
        self.palette = ColorPalette()
        self.recommendation = RecommendationEngine()
        self.products = ProductRecommender()
        self.reporter = ReportGenerator()

        LOGGER.info("AnalysisService initialized successfully.")

    def analyze(
        self,
        image_path: str | Path,
    ) -> dict[str, Any]:
        """
        Run the complete makeup analysis pipeline.

        Parameters
        ----------
        image_path:
            Path to the uploaded face image.

        Returns
        -------
        dict[str, Any]
            Complete structured analysis response.
        """

        start = perf_counter()
        image_path = Path(image_path)

        # ---------------------------------------------------------
        # Validate input image
        # ---------------------------------------------------------
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        if not image_path.is_file():
            raise ValueError(f"Image path is not a file: {image_path}")

        LOGGER.info(
            "Starting complete AI analysis for: %s",
            image_path.name,
        )

        # =========================================================
        # 1. FACE DETECTION
        # =========================================================
        LOGGER.info("[1/10] Detecting face...")

        detection = self.detector.detect(image_path)

        if not isinstance(detection, dict):
            raise TypeError("FaceDetector returned an invalid result.")

        if not detection.get("success"):
            LOGGER.warning(
                "Face detection failed: %s",
                detection.get("message", "Unknown error"),
            )
            return detection

        raw_faces = detection.get("_raw_faces")

        if not isinstance(raw_faces, list) or not raw_faces:
            return {
                "success": False,
                "message": "No usable face detected.",
            }

        faces = detection.get("faces", [])

        if not isinstance(faces, list) or not faces:
            return {
                "success": False,
                "message": ("Face detection returned no face metadata."),
            }

        LOGGER.info(
            "[1/10] Detected %s face(s).",
            len(raw_faces),
        )

        # ---------------------------------------------------------
        # Select the highest-confidence detected face
        # ---------------------------------------------------------
        best_index = max(
            range(len(raw_faces)),
            key=lambda i: float(
                getattr(
                    raw_faces[i],
                    "det_score",
                    0.0,
                )
            ),
        )

        raw_face = raw_faces[best_index]
        detected_face = faces[best_index]

        if not isinstance(detected_face, dict):
            raise TypeError("Selected face metadata is invalid.")

        face_box = detected_face.get("bounding_box")

        if not face_box:
            raise ValueError("Face bounding box was not detected.")

        # =========================================================
        # 2. FACIAL LANDMARKS
        # =========================================================
        LOGGER.info("[2/10] Extracting facial landmarks...")

        landmark_result = self.landmarks.extract(raw_face)

        if not isinstance(landmark_result, dict):
            raise TypeError("FaceLandmarks returned an invalid result.")

        landmarks = landmark_result.get("landmarks")

        if not isinstance(landmarks, dict):
            raise TypeError("Facial landmarks are invalid.")

        # =========================================================
        # 3. REAL AI SKIN ANALYSIS
        # =========================================================
        LOGGER.info("[3/10] Running real AI skin analysis...")

        skin_result = self.skin.analyze(
            image_path=image_path,
            face_box=face_box,
        )

        if not isinstance(skin_result, dict):
            raise TypeError("SkinAnalyzer returned an invalid result.")

        # =========================================================
        # 4. FACE SHAPE
        # =========================================================
        LOGGER.info("[4/10] Detecting face shape...")

        face_shape_result = self.face_shape.analyze(
            face_box=face_box,
            landmarks=landmarks,
        )

        if not isinstance(face_shape_result, dict):
            raise TypeError("FaceShapeAnalyzer returned an invalid result.")

        # =========================================================
        # 5. EYE ANALYSIS
        # =========================================================
        LOGGER.info("[5/10] Analyzing eyes...")

        eye_result = self.eye.analyze(landmarks)

        if not isinstance(eye_result, dict):
            raise TypeError("EyeAnalyzer returned an invalid result.")

        # =========================================================
        # 6. LIP ANALYSIS
        # =========================================================
        LOGGER.info("[6/10] Analyzing lips...")

        lip_result = self.lip.analyze(landmarks)

        if not isinstance(lip_result, dict):
            raise TypeError("LipAnalyzer returned an invalid result.")

        # =========================================================
        # BUILD CORE AI PROFILE
        # =========================================================
        #
        # This object is important.
        #
        # The ProductRecommender receives this actual analysis
        # profile and uses it for compatibility ranking.
        #
        # Example:
        # skin type -> oily
        # acne -> high
        # skin tone -> medium
        # face shape -> oval
        # eye spacing -> wide
        # lip shape -> fuller
        #
        # These values come from the actual analysis pipeline.
        # =========================================================

        core_analysis: dict[str, Any] = {
            "skin_analysis": skin_result,
            "face_shape": face_shape_result,
            "eye_analysis": eye_result,
            "lip_analysis": lip_result,
        }

        # =========================================================
        # 7. BEAUTY METRICS
        # =========================================================
        LOGGER.info("[7/10] Calculating beauty metrics...")

        try:
            beauty_result = self.beauty.calculate(core_analysis)
        except Exception as exc:
            LOGGER.exception("BeautyScore failed.")
            raise RuntimeError(f"BeautyScore failed: {exc}") from exc

        # =========================================================
        # 8. COLOR PALETTE
        # =========================================================
        LOGGER.info("[8/10] Generating color palette...")

        try:
            palette_result = self.palette.generate(core_analysis)
        except Exception as exc:
            LOGGER.exception("ColorPalette failed.")
            raise RuntimeError(f"ColorPalette failed: {exc}") from exc

        # =========================================================
        # 9. PERSONALIZED MAKEUP RECOMMENDATIONS
        # =========================================================
        LOGGER.info("[9/10] Generating personalized makeup recommendations...")

        try:
            recommendation_result = self.recommendation.generate(core_analysis)
        except Exception as exc:
            LOGGER.exception("RecommendationEngine failed.")
            raise RuntimeError(f"RecommendationEngine failed: {exc}") from exc

        if not isinstance(
            recommendation_result,
            dict,
        ):
            raise TypeError("RecommendationEngine returned an invalid result.")

        # =========================================================
        # 10. PERSONALIZED PRODUCT RECOMMENDATIONS
        # =========================================================
        LOGGER.info("[10/10] Ranking personalized product recommendations...")

        try:
            # IMPORTANT:
            #
            # ProductRecommender needs BOTH:
            #
            # 1. core_analysis
            #    -> actual AI-derived face/skin/eye/lip profile
            #
            # 2. recommendation_result
            #    -> personalized makeup recommendations
            #
            # This prevents the product engine from using only
            # generic/static product lists.
            #
            product_result = self.products.recommend(
                core_analysis,
                recommendation_result,
            )

        except Exception as exc:
            LOGGER.exception("ProductRecommender failed.")
            raise RuntimeError(f"ProductRecommender failed: {exc}") from exc

        if not isinstance(product_result, dict):
            raise TypeError("ProductRecommender returned an invalid result.")

        # =========================================================
        # PROFESSIONAL REPORT
        # =========================================================
        try:
            report_result = self.reporter.generate(
                core_analysis,
                recommendation_result,
            )
        except Exception as exc:
            LOGGER.exception("ReportGenerator failed.")
            raise RuntimeError(f"ReportGenerator failed: {exc}") from exc

        # =========================================================
        # PROCESSING TIME
        # =========================================================
        elapsed = round(
            (perf_counter() - start) * 1000,
            2,
        )

        # =========================================================
        # FINAL API RESPONSE
        # =========================================================
        result: dict[str, Any] = {
            "success": True,
            "message": ("AI makeup analysis completed successfully."),
            "processing_time_ms": elapsed,
            # -----------------------------------------------------
            # Face detection
            # -----------------------------------------------------
            "face_detection": {
                "success": True,
                "total_faces": len(raw_faces),
                "selected_face": detected_face,
            },
            # -----------------------------------------------------
            # Facial structure analysis
            # -----------------------------------------------------
            "landmarks": landmark_result,
            # -----------------------------------------------------
            # Real AI skin analysis
            # -----------------------------------------------------
            "skin_analysis": skin_result,
            # -----------------------------------------------------
            # Face shape
            # -----------------------------------------------------
            "face_shape": face_shape_result,
            # -----------------------------------------------------
            # Eye analysis
            # -----------------------------------------------------
            "eye_analysis": eye_result,
            # -----------------------------------------------------
            # Lip analysis
            # -----------------------------------------------------
            "lip_analysis": lip_result,
            # -----------------------------------------------------
            # Beauty metrics
            # -----------------------------------------------------
            "beauty_score": beauty_result,
            # -----------------------------------------------------
            # Personalized color palette
            # -----------------------------------------------------
            "color_palette": palette_result,
            # -----------------------------------------------------
            # Personalized makeup recommendations
            # -----------------------------------------------------
            "recommendations": recommendation_result,
            # -----------------------------------------------------
            # Personalized product compatibility results
            # -----------------------------------------------------
            "product_catalog": product_result,
            # -----------------------------------------------------
            # Professional report
            # -----------------------------------------------------
            "report": report_result,
            # -----------------------------------------------------
            # Processing metadata
            # -----------------------------------------------------
            "metadata": {
                "engine": "AI Makeup Analysis Guide",
                "version": self.VERSION,
                "detector": "InsightFace",
                "analysis_mode": "REAL_AI",
                "image": image_path.name,
            },
        }

        LOGGER.info(
            "Complete AI analysis finished in %.2f ms.",
            elapsed,
        )

        return result
