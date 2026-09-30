"""
AI Makeup Analysis Guide
Authentication API

Provides:
- User signup
- User login
- Password hashing
- SQLite user storage
- Session token generation
"""

from __future__ import annotations

import sqlite3
import secrets
from pathlib import Path

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATABASE = DATA_DIR / "users.db"

DATA_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# BLUEPRINT
# ============================================================

auth_bp = Blueprint("auth", __name__)


# ============================================================
# DATABASE
# ============================================================


def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    connection = get_db()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    connection.commit()
    connection.close()


init_database()


# ============================================================
# RESPONSE HELPERS
# ============================================================


def success(message, **extra):
    return jsonify({"success": True, "message": message, **extra})


def error(message, status=400, **extra):
    return jsonify({"success": False, "message": message, **extra}), status


# ============================================================
# SIGNUP
# ============================================================


@auth_bp.post("/signup")
def signup():
    try:
        data = request.get_json(silent=True)

        if not data:
            return error("Request body is required.")

        full_name = str(data.get("fullName", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        # ----------------------------------------------------
        # Validation
        # ----------------------------------------------------

        if not full_name:
            return error("Full name is required.")

        if len(full_name) < 2:
            return error("Please enter a valid full name.")

        if not email:
            return error("Email is required.")

        if "@" not in email or "." not in email:
            return error("Please enter a valid email address.")

        if not password:
            return error("Password is required.")

        if len(password) < 8:
            return error("Password must contain at least 8 characters.")

        # ----------------------------------------------------
        # Check existing user
        # ----------------------------------------------------

        connection = get_db()

        existing_user = connection.execute(
            "SELECT id FROM users WHERE email = ?", (email,)
        ).fetchone()

        if existing_user:
            connection.close()

            return error("An account with this email already exists.", 409)

        # ----------------------------------------------------
        # Hash password
        # ----------------------------------------------------

        password_hash = generate_password_hash(password)

        # ----------------------------------------------------
        # Create user
        # ----------------------------------------------------

        cursor = connection.execute(
            """
            INSERT INTO users
            (full_name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (full_name, email, password_hash),
        )

        connection.commit()

        user_id = cursor.lastrowid

        connection.close()

        # ----------------------------------------------------
        # Create login token
        # ----------------------------------------------------

        token = secrets.token_urlsafe(32)

        user = {"id": user_id, "fullName": full_name, "email": email}

        return success("Account created successfully.", token=token, user=user)

    except sqlite3.IntegrityError:
        return error("An account with this email already exists.", 409)

    except Exception as exc:  # noqa: BLE001
        print("SIGNUP ERROR:", exc)

        return error("Unable to create account right now.", 500)


# ============================================================
# LOGIN
# ============================================================


@auth_bp.post("/login")
def login():
    try:
        data = request.get_json(silent=True)

        if not data:
            return error("Request body is required.")

        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        # ----------------------------------------------------
        # Validation
        # ----------------------------------------------------

        if not email:
            return error("Email is required.")

        if not password:
            return error("Password is required.")

        # ----------------------------------------------------
        # Find user
        # ----------------------------------------------------

        connection = get_db()

        user = connection.execute(
            """
            SELECT
                id,
                full_name,
                email,
                password_hash
            FROM users
            WHERE email = ?
            """,
            (email,),
        ).fetchone()

        connection.close()

        if not user:
            return error("Invalid email or password.", 401)

        # ----------------------------------------------------
        # Verify password
        # ----------------------------------------------------

        if not check_password_hash(user["password_hash"], password):
            return error("Invalid email or password.", 401)

        # ----------------------------------------------------
        # Generate token
        # ----------------------------------------------------

        token = secrets.token_urlsafe(32)

        user_data = {
            "id": user["id"],
            "fullName": user["full_name"],
            "email": user["email"],
        }

        return success("Login successful.", token=token, user=user_data)

    except Exception as exc:  # noqa: BLE001
        print("LOGIN ERROR:", exc)

        return error("Unable to login right now.", 500)


# ============================================================
# AUTH HEALTH
# ============================================================


@auth_bp.get("/health")
def auth_health():
    return success("Authentication service is working.", service="Authentication API")
