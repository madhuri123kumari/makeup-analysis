"""
Personalized Product Recommendation Engine
AI Makeup Analysis Guide

IMPORTANT:
- No random product selection.
- No fake prediction.
- Recommendations are generated from the actual analysis profile.
- Product ranking is deterministic and explainable.
- This is a content-based recommendation engine, not a trained ML model.
"""

from __future__ import annotations

from typing import Any
from config import LOGGER


class ProductRecommender:
    VERSION = "7.0.0"

    # ---------------------------------------------------------
    # PRODUCT CATALOG
    # ---------------------------------------------------------

    CATALOG: dict[str, list[dict[str, Any]]] = {
        "cleanser": [
            {
                "name": "CeraVe Foaming Facial Cleanser",
                "brand": "CeraVe",
                "skin_types": ["oily", "normal"],
                "finish": "balanced",
                "acne_support": True,
            },
            {
                "name": "CeraVe Hydrating Facial Cleanser",
                "brand": "CeraVe",
                "skin_types": ["dry", "normal"],
                "finish": "hydrating",
                "acne_support": False,
            },
            {
                "name": "La Roche-Posay Toleriane Purifying Foaming Cleanser",
                "brand": "La Roche-Posay",
                "skin_types": ["oily", "normal"],
                "finish": "balanced",
                "acne_support": True,
            },
        ],
        "toner": [
            {
                "name": "Thayers Alcohol-Free Witch Hazel Toner",
                "brand": "Thayers",
                "skin_types": ["oily", "normal"],
                "finish": "balancing",
            },
            {
                "name": "Klairs Supple Preparation Unscented Toner",
                "brand": "Dear, Klairs",
                "skin_types": ["dry", "normal"],
                "finish": "hydrating",
            },
        ],
        "moisturizer": [
            {
                "name": "CeraVe PM Facial Moisturizing Lotion",
                "brand": "CeraVe",
                "skin_types": ["oily", "normal"],
                "finish": "lightweight",
                "acne_support": True,
            },
            {
                "name": "CeraVe Moisturizing Cream",
                "brand": "CeraVe",
                "skin_types": ["dry", "normal"],
                "finish": "rich",
                "acne_support": False,
            },
            {
                "name": "Neutrogena Hydro Boost Water Gel",
                "brand": "Neutrogena",
                "skin_types": ["oily", "normal"],
                "finish": "gel",
                "acne_support": True,
            },
        ],
        "sunscreen": [
            {
                "name": "La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+",
                "brand": "La Roche-Posay",
                "skin_types": ["oily", "normal"],
                "finish": "fluid",
                "spf": "50+",
                "acne_support": True,
            },
            {
                "name": "Neutrogena Ultra Sheer Dry-Touch SPF 50+",
                "brand": "Neutrogena",
                "skin_types": ["oily", "normal"],
                "finish": "dry-touch",
                "spf": "50+",
                "acne_support": True,
            },
            {
                "name": "CeraVe Hydrating Mineral Sunscreen SPF 50",
                "brand": "CeraVe",
                "skin_types": ["dry", "normal"],
                "finish": "hydrating",
                "spf": "50",
                "acne_support": False,
            },
        ],
        "primer": [
            {
                "name": "e.l.f. Power Grip Primer",
                "brand": "e.l.f.",
                "skin_types": ["oily", "normal"],
                "finish": "grip",
                "acne_support": True,
            },
            {
                "name": "e.l.f. Hydrating Face Primer",
                "brand": "e.l.f.",
                "skin_types": ["dry", "normal"],
                "finish": "hydrating",
                "acne_support": False,
            },
            {
                "name": "NYX Professional Makeup Pore Filler",
                "brand": "NYX",
                "skin_types": ["oily", "normal"],
                "finish": "smoothing",
                "acne_support": True,
            },
        ],
        "foundation": [
            {
                "name": "Fenty Beauty Pro Filt'r Soft Matte Longwear Foundation",
                "brand": "Fenty Beauty",
                "skin_types": ["oily", "normal"],
                "finish": "soft-matte",
                "coverage": "medium-to-full",
                "undertones": ["warm", "cool", "neutral"],
            },
            {
                "name": "L'Oréal Paris True Match Super-Blendable Foundation",
                "brand": "L'Oréal Paris",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "natural",
                "coverage": "medium",
                "undertones": ["warm", "cool", "neutral"],
            },
            {
                "name": "Maybelline Fit Me Matte + Poreless Foundation",
                "brand": "Maybelline",
                "skin_types": ["oily", "normal"],
                "finish": "matte",
                "coverage": "medium",
                "undertones": ["warm", "cool", "neutral"],
            },
        ],
        "concealer": [
            {
                "name": "NARS Radiant Creamy Concealer",
                "brand": "NARS",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "radiant",
                "coverage": "medium",
                "undertones": ["warm", "cool", "neutral"],
            },
            {
                "name": "Maybelline Instant Age Rewind Eraser Concealer",
                "brand": "Maybelline",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "natural",
                "coverage": "medium",
                "undertones": ["warm", "cool", "neutral"],
            },
        ],
        "blush": [
            {
                "name": "Milani Baked Blush",
                "brand": "Milani",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "luminous",
                "undertones": ["warm", "neutral"],
            },
            {
                "name": "Rare Beauty Soft Pinch Liquid Blush",
                "brand": "Rare Beauty",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "natural",
                "undertones": ["cool", "neutral", "warm"],
            },
        ],
        "contour": [
            {
                "name": "Fenty Beauty Match Stix Matte Contour Skinstick",
                "brand": "Fenty Beauty",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "matte",
                "face_shapes": ["round", "oval", "square", "heart", "diamond"],
            },
            {
                "name": "NYX Professional Makeup Wonder Stick",
                "brand": "NYX",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "matte",
                "face_shapes": ["round", "square", "heart", "diamond"],
            },
        ],
        "highlighter": [
            {
                "name": "Fenty Beauty Killawatt Freestyle Highlighter",
                "brand": "Fenty Beauty",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "glow",
                "undertones": ["warm", "cool", "neutral"],
            },
            {
                "name": "MAC Mineralize Skinfinish",
                "brand": "MAC",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "luminous",
                "undertones": ["warm", "cool", "neutral"],
            },
        ],
        "eyeshadow": [
            {
                "name": "Huda Beauty Nude Eyeshadow Palette",
                "brand": "Huda Beauty",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "mixed",
                "eye_spacing": ["close-set", "average", "wide-set"],
                "face_shapes": ["all"],
            },
            {
                "name": "e.l.f. Bite-Size Eyeshadow",
                "brand": "e.l.f.",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "mixed",
                "eye_spacing": ["close-set", "average", "wide-set"],
                "face_shapes": ["all"],
            },
        ],
        "eyeliner": [
            {
                "name": "NYX Epic Ink Liner",
                "brand": "NYX",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "defined",
                "eye_spacing": ["close-set", "average", "wide-set"],
            },
            {
                "name": "Maybelline Hyper Easy Liquid Pen",
                "brand": "Maybelline",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "defined",
                "eye_spacing": ["close-set", "average", "wide-set"],
            },
        ],
        "mascara": [
            {
                "name": "Maybelline Lash Sensational Sky High Mascara",
                "brand": "Maybelline",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "lengthening",
                "eye_spacing": ["close-set", "average", "wide-set"],
            },
            {
                "name": "L'Oréal Paris Voluminous Lash Paradise Mascara",
                "brand": "L'Oréal Paris",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "volumizing",
                "eye_spacing": ["close-set", "average", "wide-set"],
            },
        ],
        "lipstick": [
            {
                "name": "MAC Matte Lipstick",
                "brand": "MAC",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "matte",
                "undertones": ["cool", "neutral", "warm"],
                "lip_shapes": ["all"],
            },
            {
                "name": "Maybelline Super Stay Matte Ink",
                "brand": "Maybelline",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "matte",
                "undertones": ["warm", "neutral"],
                "lip_shapes": ["all"],
            },
            {
                "name": "Rare Beauty Kind Words Matte Lipstick",
                "brand": "Rare Beauty",
                "skin_types": ["dry", "normal", "oily"],
                "finish": "matte",
                "undertones": ["cool", "neutral", "warm"],
                "lip_shapes": ["all"],
            },
        ],
        "setting_spray": [
            {
                "name": "Urban Decay All Nighter Setting Spray",
                "brand": "Urban Decay",
                "skin_types": ["oily", "normal", "dry"],
                "finish": "long-wear",
            },
            {
                "name": "e.l.f. Stay All Night Micro-Fine Setting Mist",
                "brand": "e.l.f.",
                "skin_types": ["oily", "normal", "dry"],
                "finish": "natural",
            },
        ],
    }

    # ---------------------------------------------------------
    # INITIALIZATION
    # ---------------------------------------------------------

    def __init__(self) -> None:
        LOGGER.info(
            "ProductRecommender initialized, version=%s",
            self.VERSION,
        )

    # ---------------------------------------------------------
    # MAIN RECOMMENDATION FUNCTION
    # ---------------------------------------------------------

    def recommend(
        self,
        recommendations: dict[str, Any] | None = None,
        analysis: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        recommendations = recommendations if isinstance(recommendations, dict) else {}

        analysis = analysis if isinstance(analysis, dict) else {}

        # -----------------------------------------------------
        # Backward compatibility
        # -----------------------------------------------------

        first_looks_like_analysis = any(
            key in recommendations
            for key in (
                "skin_analysis",
                "face_shape",
                "eye_analysis",
                "lip_analysis",
                "image_quality",
                "measurements",
                "ai_status",
            )
        )

        second_looks_like_recommendations = any(
            key in analysis
            for key in (
                "foundation",
                "primer",
                "blush",
                "eyeshadow",
                "lipstick",
                "recommendations",
                "makeup_recommendations",
            )
        )

        if first_looks_like_analysis and second_looks_like_recommendations:
            recommendations, analysis = analysis, recommendations

        makeup = self._unwrap(recommendations)

        if not analysis:
            analysis = self._extract_analysis(recommendations)

        if not analysis:
            analysis = self._extract_analysis(makeup)

        profile = self._build_profile(
            analysis,
            makeup,
        )

        products: dict[str, dict[str, Any]] = {}

        for category in self.CATALOG:
            products[category] = self._recommend_category(
                category,
                profile,
                makeup,
            )

        available = sum(1 for product in products.values() if product.get("available"))

        missing = [key for key, value in profile.items() if value is None]

        LOGGER.info(
            "Personalized product recommendations generated: %d/%d",
            available,
            len(products),
        )

        return {
            "success": True,
            "version": self.VERSION,
            "personalized": True,
            # Transparent naming:
            "real_ai_analysis_used": bool(analysis),
            "fake_prediction": False,
            "random_prediction": False,
            "ranking_method": (
                "deterministic content-based compatibility "
                "ranking using actual AI analysis"
            ),
            "analysis_inputs": profile,
            "products": products,
            "summary": {
                "total_categories": len(products),
                "available_categories": available,
                "missing_ai_inputs": missing,
            },
        }

    # ---------------------------------------------------------
    # PROFILE EXTRACTION
    # ---------------------------------------------------------

    def _build_profile(
        self,
        analysis: dict[str, Any],
        makeup: dict[str, Any],
    ) -> dict[str, Any]:
        skin = self._get_dict(
            analysis,
            "skin_analysis",
        )

        face = self._get_dict(
            analysis,
            "face_shape",
        )

        eye = self._get_dict(
            analysis,
            "eye_analysis",
        )

        lip = self._get_dict(
            analysis,
            "lip_analysis",
        )

        # Some analysis systems may return these directly.
        if not skin:
            skin = analysis

        return {
            "skin_type": self._first_value(
                skin,
                [
                    "skin_type",
                    "type",
                ],
            ),
            "skin_tone": self._first_value(
                skin,
                [
                    "skin_tone",
                    "tone",
                    "complexion",
                ],
            ),
            "undertone": self._first_value(
                skin,
                [
                    "undertone",
                    "skin_undertone",
                ],
            ),
            "acne_level": self._first_value(
                skin,
                [
                    "acne_level",
                    "acne_severity",
                    "acne",
                ],
            ),
            "dark_circles": self._first_value(
                skin,
                [
                    "dark_circles",
                    "dark_circle_level",
                    "under_eye_darkness",
                ],
            ),
            "face_shape": self._first_value(
                face,
                [
                    "face_shape",
                    "shape",
                ],
            ),
            "eye_spacing": self._first_value(
                eye,
                [
                    "eye_spacing",
                    "spacing",
                ],
            ),
            "lip_shape": self._first_value(
                lip,
                [
                    "lip_shape",
                    "shape",
                ],
            ),
        }

    # ---------------------------------------------------------
    # CATEGORY RANKING
    # ---------------------------------------------------------

    def _recommend_category(
        self,
        category: str,
        profile: dict[str, Any],
        makeup: dict[str, Any],
    ) -> dict[str, Any]:
        catalog = self.CATALOG.get(
            category,
            [],
        )

        if not catalog:
            return self._unavailable(
                category,
                "No products are configured.",
            )

        scored_products = []

        for index, product in enumerate(catalog):
            score, matched, reasons = self._score(
                product,
                category,
                profile,
                makeup,
            )

            scored_products.append(
                (
                    score,
                    matched,
                    reasons,
                    index,
                    product,
                )
            )

        # Highest score first.
        #
        # If two products have exactly the same compatibility,
        # we use the number of matched profile signals.
        #
        # The final index is ONLY a stable deterministic tie-breaker.
        # It is NOT random.
        scored_products.sort(
            key=lambda item: (
                item[0],
                item[1],
                -item[3],
            ),
            reverse=True,
        )

        best_score, matched, reasons, _, best_product = scored_products[0]

        result = dict(best_product)

        result.update(
            {
                "category": category.replace(
                    "_",
                    " ",
                ).title(),
                "match_score": int(
                    max(
                        0,
                        min(
                            99,
                            round(best_score),
                        ),
                    )
                ),
                "reason": self._build_reason(
                    category,
                    profile,
                    result,
                    reasons,
                ),
                "available": True,
                "source": ("curated_catalog + actual_analysis"),
                "image_url": result.get("image_url"),
            }
        )

        return result

    # ---------------------------------------------------------
    # REAL COMPATIBILITY SCORING
    # ---------------------------------------------------------

    def _score(
        self,
        product: dict[str, Any],
        category: str,
        profile: dict[str, Any],
        makeup: dict[str, Any],
    ) -> tuple[float, int, list[str]]:
        score = 40.0
        matched = 0
        reasons: list[str] = []

        skin_type = self._normalise(profile.get("skin_type"))

        undertone = self._normalise(profile.get("undertone"))

        face_shape = self._normalise(profile.get("face_shape"))

        eye_spacing = self._normalise(profile.get("eye_spacing"))

        lip_shape = self._normalise(profile.get("lip_shape"))

        acne = self._normalise(profile.get("acne_level"))

        dark_circles = self._normalise(profile.get("dark_circles"))

        skin_tone = self._normalise(profile.get("skin_tone"))

        # -----------------------------------------------------
        # 1. SKIN TYPE
        # -----------------------------------------------------

        product_skin_types = [
            self._normalise(x)
            for x in product.get(
                "skin_types",
                [],
            )
        ]

        if skin_type:
            if skin_type in product_skin_types:
                score += 25
                matched += 1

                reasons.append(f"matches detected {skin_type} skin")

            elif "all" in product_skin_types:
                score += 15
                matched += 1

            else:
                score -= 12

        # -----------------------------------------------------
        # 2. UNDERTONE
        # -----------------------------------------------------

        product_undertones = [
            self._normalise(x)
            for x in product.get(
                "undertones",
                [],
            )
        ]

        if undertone and product_undertones:
            if undertone in product_undertones:
                score += 20
                matched += 1

                reasons.append(f"matches {undertone} undertone")

            else:
                score -= 8

        # -----------------------------------------------------
        # 3. FACE SHAPE
        # -----------------------------------------------------

        product_face_shapes = [
            self._normalise(x)
            for x in product.get(
                "face_shapes",
                [],
            )
        ]

        if face_shape and product_face_shapes:
            if face_shape in product_face_shapes or "all" in product_face_shapes:
                score += 15
                matched += 1

                reasons.append(f"suits {face_shape} face shape")

        # -----------------------------------------------------
        # 4. EYE SPACING
        # -----------------------------------------------------

        product_eye_spacing = [
            self._normalise(x)
            for x in product.get(
                "eye_spacing",
                [],
            )
        ]

        if eye_spacing and product_eye_spacing:
            if eye_spacing in product_eye_spacing or "all" in product_eye_spacing:
                score += 15
                matched += 1

                reasons.append(f"works with {eye_spacing} eye spacing")

        # -----------------------------------------------------
        # 5. LIP SHAPE
        # -----------------------------------------------------

        product_lip_shapes = [
            self._normalise(x)
            for x in product.get(
                "lip_shapes",
                [],
            )
        ]

        if lip_shape and product_lip_shapes:
            if lip_shape in product_lip_shapes or "all" in product_lip_shapes:
                score += 15
                matched += 1

                reasons.append(f"works with {lip_shape} lip shape")

        # -----------------------------------------------------
        # 6. ACNE
        # -----------------------------------------------------

        if acne:
            high_acne = {
                "high",
                "severe",
                "moderate",
            }

            if acne in high_acne:
                if product.get(
                    "acne_support",
                    False,
                ):
                    score += 12
                    matched += 1

                    reasons.append("better aligned with acne-prone skin")

                elif category in {
                    "foundation",
                    "primer",
                    "concealer",
                }:
                    # Avoid rewarding heavy makeup
                    # when acne is detected.
                    if product.get("coverage") == "medium-to-full":
                        score -= 4

        # -----------------------------------------------------
        # 7. DARK CIRCLES
        # -----------------------------------------------------

        if dark_circles:
            severe_dark_circles = {
                "high",
                "severe",
                "moderate",
                "prominent",
            }

            if dark_circles in severe_dark_circles and category == "concealer":
                score += 12
                matched += 1

                reasons.append("prioritizes under-eye coverage")

        # -----------------------------------------------------
        # 8. SKIN TONE
        # -----------------------------------------------------

        #
        # Skin tone is useful for shade-oriented products.
        # The catalog represents product families, not individual
        # shade numbers, so we only give a modest compatibility
        # weight instead of pretending to know an exact shade.
        #

        if skin_tone and category in {
            "foundation",
            "concealer",
            "highlighter",
            "blush",
            "lipstick",
        }:
            score += 4
            matched += 1

            reasons.append(f"shade should be selected for {skin_tone} skin tone")

        # -----------------------------------------------------
        # 9. EXISTING MAKEUP ENGINE RECOMMENDATION
        # -----------------------------------------------------

        existing = self._existing(
            makeup,
            category,
        )

        if existing:
            existing_name = self._normalise(existing.get("name"))

            product_name = self._normalise(product.get("name"))

            if existing_name and existing_name == product_name:
                score += 18
                matched += 1

                reasons.append("matches the existing makeup recommendation")

        # -----------------------------------------------------
        # 10. CATEGORY-SPECIFIC FINISH LOGIC
        # -----------------------------------------------------

        finish = self._normalise(product.get("finish"))

        if category in {
            "foundation",
            "primer",
            "setting_spray",
        }:
            if skin_type == "oily":
                if finish in {
                    "matte",
                    "soft matte",
                    "smoothing",
                    "dry touch",
                    "long wear",
                    "grip",
                }:
                    score += 8
                    matched += 1

                    reasons.append("finish is suitable for oily skin")

                elif finish in {
                    "hydrating",
                    "rich",
                }:
                    score -= 5

            elif skin_type == "dry":
                if finish in {
                    "hydrating",
                    "rich",
                    "natural",
                    "radiant",
                    "luminous",
                    "gel",
                }:
                    score += 8
                    matched += 1

                    reasons.append("finish supports dry skin")

                elif finish in {
                    "matte",
                    "soft matte",
                    "dry touch",
                }:
                    score -= 4

        # -----------------------------------------------------
        # 11. LIP FINISH
        # -----------------------------------------------------

        if category == "lipstick":
            if skin_type == "dry":
                if finish == "matte":
                    score -= 2

            elif skin_type == "oily":
                if finish == "matte":
                    score += 4

        # -----------------------------------------------------
        # 12. BLUSH / HIGHLIGHTER FINISH
        # -----------------------------------------------------

        if category in {
            "blush",
            "highlighter",
        }:
            if skin_type == "dry":
                if finish in {
                    "luminous",
                    "glow",
                    "radiant",
                }:
                    score += 7
                    matched += 1

                    reasons.append("luminous finish complements dry skin")

            elif skin_type == "oily":
                if finish in {
                    "natural",
                    "matte",
                }:
                    score += 5
                    matched += 1

                    reasons.append("controlled finish suits oily skin")

        # -----------------------------------------------------
        # FINAL SCORE
        # -----------------------------------------------------

        score = max(
            0.0,
            min(
                99.0,
                score,
            ),
        )

        return (
            score,
            matched,
            reasons,
        )

    # ---------------------------------------------------------
    # HUMAN-READABLE REASON
    # ---------------------------------------------------------

    def _build_reason(
        self,
        category: str,
        profile: dict[str, Any],
        product: dict[str, Any],
        reasons: list[str],
    ) -> str:
        if reasons:
            unique_reasons = []

            for reason in reasons:
                if reason not in unique_reasons:
                    unique_reasons.append(reason)

            return "Recommended because " + "; ".join(unique_reasons[:4]) + "."

        # Fallback explanation based on actual profile.

        skin_type = profile.get("skin_type")

        if skin_type:
            return f"Recommended for the detected {skin_type} skin profile."

        return "Recommended from the available analyzed profile."

    # ---------------------------------------------------------
    # HELPERS
    # ---------------------------------------------------------

    @staticmethod
    def _unwrap(
        data: dict[str, Any],
    ) -> dict[str, Any]:
        if not isinstance(data, dict):
            return {}

        for key in (
            "recommendations",
            "makeup_recommendations",
        ):
            nested = data.get(key)

            if isinstance(nested, dict):
                return nested

        return data

    @staticmethod
    def _extract_analysis(
        data: dict[str, Any],
    ) -> dict[str, Any]:
        if not isinstance(data, dict):
            return {}

        # Direct analysis object
        if isinstance(
            data.get("analysis"),
            dict,
        ):
            return data["analysis"]

        # AI analysis object
        if isinstance(
            data.get("ai_analysis"),
            dict,
        ):
            return data["ai_analysis"]

        # Direct skin analysis
        if isinstance(
            data.get("skin_analysis"),
            dict,
        ):
            return data

        return {}

    @staticmethod
    def _get_dict(
        data: dict[str, Any],
        key: str,
    ) -> dict[str, Any]:
        if not isinstance(data, dict):
            return {}

        value = data.get(key)

        if isinstance(value, dict):
            return value

        return {}

    @staticmethod
    def _first_value(
        data: dict[str, Any],
        keys: list[str],
    ) -> str | None:
        if not isinstance(data, dict):
            return None

        for key in keys:
            if key not in data:
                continue

            value = data.get(key)

            result = ProductRecommender._value(value)

            if result:
                return result

        return None

    @staticmethod
    def _value(
        value: Any,
    ) -> str | None:
        if isinstance(value, dict):
            for key in (
                "value",
                "label",
                "name",
                "type",
                "result",
            ):
                candidate = value.get(key)

                if candidate not in (
                    None,
                    "",
                ):
                    return str(candidate)

            return None

        if isinstance(value, list):
            if not value:
                return None

            return str(value[0])

        if value in (
            None,
            "",
        ):
            return None

        return str(value)

    @staticmethod
    def _normalise(
        value: Any,
    ) -> str:
        if value in (
            None,
            "",
        ):
            return ""

        return str(value).strip().lower().replace("_", " ").replace("-", " ")

    @staticmethod
    def _existing(
        data: dict[str, Any],
        key: str,
    ) -> dict[str, Any] | None:
        if not isinstance(data, dict):
            return None

        value = data.get(key)

        if isinstance(value, dict):
            return value

        return None

    @staticmethod
    def _unavailable(
        category: str,
        reason: str,
    ) -> dict[str, Any]:
        return {
            "category": category.replace(
                "_",
                " ",
            ).title(),
            "available": False,
            "reason": reason,
            "source": "actual_analysis",
        }
