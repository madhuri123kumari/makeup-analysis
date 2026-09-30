"""
AI Makeup Analysis Guide
Professional Flask Application Entry Point

This file is responsible for:
- Creating the Flask application
- Configuring CORS and upload limits
- Serving the dashboard and frontend assets
- Registering the analysis blueprint
- Registering the authentication blueprint
- Registering the AI product-image blueprint
- Providing health/status endpoints
- Handling common HTTP errors

AI analysis:
    routes/analysis.py

Authentication:
    routes/auth.py

Product image generation:
    routes/product_image.py
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from config import LOGGER, PROJECT_NAME, PROJECT_VERSION, flask_config


# ================================================================
# APPLICATION STATUS
# ================================================================

APP_STATUS = "Development"


# ================================================================
# PATHS
# ================================================================

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent
FRONTEND_DIR = PROJECT_DIR

DASHBOARD_FILE = FRONTEND_DIR / "dashboard.html"
ASSETS_DIR = FRONTEND_DIR / "assets"


# ================================================================
# JSON RESPONSE HELPERS
# ================================================================


def success_response(
    message: str,
    status_code: int = 200,
    **extra: Any,
):
    """Return a consistent successful JSON response."""

    payload = {
        "success": True,
        "message": message,
        **extra,
    }

    return jsonify(payload), status_code


def error_response(
    message: str,
    status_code: int,
    **extra: Any,
):
    """Return a consistent error JSON response."""

    payload = {
        "success": False,
        "message": message,
        **extra,
    }

    return jsonify(payload), status_code


# ================================================================
# FRONTEND ROUTES
# ================================================================


def register_frontend_routes(app: Flask) -> None:
    """Register dashboard and frontend asset routes."""

    @app.get("/")
    def home():
        """Return backend API information."""

        return success_response(
            "AI Makeup Analysis Guide API is running.",
            application=PROJECT_NAME,
            version=PROJECT_VERSION,
            status=APP_STATUS,
            service="Python AI Server",
            endpoints={
                "health": "/health",
                "dashboard": "/dashboard.html",
                "analysis": "/api/analysis/",
                "analysis_health": "/api/analysis/health",
                "auth_signup": "/api/auth/signup",
                "auth_login": "/api/auth/login",
                "auth_health": "/api/auth/health",
                "product_image": "/api/analysis/product-image",
            },
        )

    @app.get("/health")
    def health():
        """Return general backend health status."""

        return success_response(
            "Backend is healthy.",
            service=PROJECT_NAME,
            status="healthy",
            version=PROJECT_VERSION,
        )

    @app.get("/dashboard.html")
    def dashboard():
        """Serve the dashboard HTML page."""

        if not DASHBOARD_FILE.is_file():
            LOGGER.error(
                "Dashboard file not found: %s",
                DASHBOARD_FILE,
            )

            return error_response(
                "dashboard.html was not found.",
                404,
                expected_path=str(DASHBOARD_FILE),
            )

        return send_from_directory(
            str(FRONTEND_DIR),
            "dashboard.html",
        )

    @app.get("/assets/<path:filename>")
    def frontend_assets(filename: str):
        """Serve frontend assets."""

        if not ASSETS_DIR.is_dir():
            LOGGER.error(
                "Assets directory not found: %s",
                ASSETS_DIR,
            )

            return error_response(
                "Frontend assets directory was not found.",
                404,
            )

        return send_from_directory(
            str(ASSETS_DIR),
            filename,
        )


# ================================================================
# API BLUEPRINTS
# ================================================================


def register_blueprints(app: Flask) -> None:
    """
    Register all application API blueprints.

    APIs:
    - /api/analysis
    - /api/auth
    - /api/analysis/product-image
    """

    try:
        from routes.analysis import analysis_bp
        from routes.auth import auth_bp
        from routes.product_image import product_image_bp

    except ImportError:
        LOGGER.exception("Unable to import required API blueprints.")
        raise

    # ============================================================
    # ANALYSIS BLUEPRINT
    # ============================================================

    app.register_blueprint(
        analysis_bp,
        url_prefix="/api/analysis",
    )

    LOGGER.info("Analysis blueprint registered at /api/analysis")

    # ============================================================
    # PRODUCT IMAGE BLUEPRINT
    # ============================================================

    app.register_blueprint(product_image_bp)

    LOGGER.info("Product image blueprint registered at /api/analysis/product-image")

    # ============================================================
    # AUTHENTICATION BLUEPRINT
    # ============================================================

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth",
    )

    LOGGER.info("Authentication blueprint registered at /api/auth")


# ================================================================
# ERROR HANDLERS
# ================================================================


def register_error_handlers(app: Flask) -> None:
    """Register consistent JSON error responses."""

    @app.errorhandler(400)
    def bad_request(error: Exception):
        LOGGER.warning(
            "400 Bad Request: %s",
            error,
        )

        return error_response(
            "Bad request.",
            400,
        )

    @app.errorhandler(404)
    def not_found(error: Exception):
        LOGGER.warning(
            "404 Not Found: %s",
            getattr(error, "description", error),
        )

        return error_response(
            "Resource not found.",
            404,
        )

    @app.errorhandler(405)
    def method_not_allowed(error: Exception):
        LOGGER.warning(
            "405 Method Not Allowed: %s",
            error,
        )

        return error_response(
            "Method not allowed.",
            405,
        )

    @app.errorhandler(413)
    def request_too_large(error: Exception):
        LOGGER.warning(
            "413 Request Entity Too Large: %s",
            error,
        )

        return error_response(
            "Uploaded image is too large.",
            413,
        )

    @app.errorhandler(415)
    def unsupported_media_type(error: Exception):
        LOGGER.warning(
            "415 Unsupported Media Type: %s",
            error,
        )

        return error_response(
            "Unsupported media type.",
            415,
        )

    @app.errorhandler(500)
    def internal_server_error(error: Exception):
        LOGGER.exception(
            "500 Internal Server Error: %s",
            error,
        )

        return error_response(
            "Internal server error.",
            500,
        )


# ================================================================
# APPLICATION FACTORY
# ================================================================


def create_app() -> Flask:
    """Create and configure the Flask application."""

    app = Flask(
        __name__,
        static_folder=None,
    )

    # ============================================================
    # CORS
    # ============================================================

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*",
                "methods": [
                    "GET",
                    "POST",
                    "OPTIONS",
                ],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                ],
            }
        },
    )

    # ============================================================
    # APPLICATION CONFIGURATION
    # ============================================================

    app.config.update(
        SECRET_KEY=flask_config.secret_key,
        MAX_CONTENT_LENGTH=flask_config.max_content_length,
        JSON_SORT_KEYS=False,
    )

    # ============================================================
    # REGISTER ROUTES
    # ============================================================

    register_frontend_routes(app)
    register_blueprints(app)
    register_error_handlers(app)

    # ============================================================
    # STARTUP LOGGING
    # ============================================================

    LOGGER.info("Application initialized successfully.")

    LOGGER.info(
        "Frontend directory: %s",
        FRONTEND_DIR,
    )

    LOGGER.info(
        "Dashboard file: %s",
        DASHBOARD_FILE,
    )

    LOGGER.info(
        "Assets directory: %s",
        ASSETS_DIR,
    )

    # ============================================================
    # LOG ALL REGISTERED ROUTES
    # ============================================================

    for rule in sorted(
        app.url_map.iter_rules(),
        key=lambda item: item.rule,
    ):
        methods = sorted(
            rule.methods
            - {
                "HEAD",
                "OPTIONS",
            }
        )

        LOGGER.info(
            "Route: %-7s %s",
            ",".join(methods),
            rule.rule,
        )

    return app


# ================================================================
# APPLICATION INSTANCE
# ================================================================

app = create_app()


# ================================================================
# STARTUP BANNER
# ================================================================


def startup_banner() -> None:
    """Print a readable development startup banner."""

    host = flask_config.host
    port = flask_config.port

    print(
        f"""
==============================================================
{PROJECT_NAME}
Version : {PROJECT_VERSION}
Status  : {APP_STATUS}
Host    : {host}
Port    : {port}
==============================================================

Frontend
--------
Dashboard       : http://{host}:{port}/dashboard.html
Assets          : http://{host}:{port}/assets/

Backend
-------
Health          : http://{host}:{port}/health

AI Analysis
-----------
Analysis        : http://{host}:{port}/api/analysis/
Analysis Health : http://{host}:{port}/api/analysis/health
Product Image   : http://{host}:{port}/api/analysis/product-image

Authentication
--------------
Signup          : http://{host}:{port}/api/auth/signup
Login           : http://{host}:{port}/api/auth/login
Auth Health     : http://{host}:{port}/api/auth/health

==============================================================
"""
    )


# ================================================================
# APPLICATION START
# ================================================================


def main() -> None:
    """Start the Flask development server."""

    startup_banner()

    app.run(
        host=flask_config.host,
        port=flask_config.port,
        debug=flask_config.debug,
        use_reloader=False,
    )


# ================================================================
# ENTRY POINT
# ================================================================

if __name__ == "__main__":
    main()
