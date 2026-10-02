# AI Makeup Analysis Guide

An AI-powered web application designed to help users understand their skin characteristics and explore personalized makeup recommendations.

## Overview

AI Makeup Analysis Guide combines a web interface with Python-based computer vision and machine learning services to analyze uploaded facial images and provide skincare and makeup-related insights.

## Features

* **AI Face Detection:** Detect faces and facial landmarks in uploaded images.
* **Skin Type Analysis:** Predict skin type using a trained image-classification model.
* **Acne Analysis:** Estimate acne severity using an image-classification model.
* **Makeup Recommendations:** Explore makeup-related recommendations.
* **Product Image Generation:** Generate product visuals through an external image-generation service when configured.
* **User Interface:** HTML-based pages for login, dashboard, analysis, history, profile, and recommendations.
* **Python Backend:** Flask API for processing requests and connecting frontend features to analysis services.

## Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python, Flask
* **Computer Vision:** OpenCV, InsightFace
* **Machine Learning:** PyTorch, Transformers
* **Image Processing:** Pillow, NumPy
* **Deployment:** Docker, Gunicorn
* **Version Control:** Git and GitHub

## Project Structure

```text
makeup-analysis/
├── assets/
├── backend/
├── python-ai/
│   ├── ai/
│   ├── routes/
│   ├── services/
│   ├── app.py
│   └── requirements.txt
├── analysis.html
├── dashboard.html
├── history.html
├── index.html
├── login.html
├── profile.html
├── recommendation.html
├── Dockerfile
└── README.md
```

## Getting Started

### Prerequisites

* Python 3.11
* Git
* pip
* A compatible environment for the project's machine-learning dependencies

### 1. Clone the repository

```bash
git clone https://github.com/madhuri123kumari/makeup-analysis.git
cd makeup-analysis
```

### 2. Create a virtual environment

**Windows PowerShell:**

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
pip install -r python-ai/requirements.txt
```

### 4. Configure environment variables

Configure the environment variables required by the application in a local `.env` file or your hosting provider's environment settings.

Keep API keys, passwords, secret keys, and database credentials private. Never commit your `.env` file to GitHub.

### 5. Run the backend

```powershell
python python-ai/app.py
```

Use the local address printed by Flask in the terminal to open or test the application.

## Deployment

The repository includes a Dockerfile for container-based deployment. Deployment also requires compatible hosting resources, correctly configured environment variables, and writable directories for model files and caches.

Machine-learning models may require additional memory and startup time. Confirm that the selected hosting plan supports the application's dependencies before deploying.

## Important Notes

* Analysis results are AI-generated estimates and should not be treated as medical diagnoses.
* Some external features require API credentials and internet access.
* Model downloads may occur during the first startup if model files are not already available.
* Availability of individual features depends on the backend configuration and required services.
<img width="1916" height="972" alt="image" src="https://github.com/user-attachments/assets/f647cd46-da40-497b-8d40-b09ae8df076a" />
<img width="1917" height="982" alt="image" src="https://github.com/user-attachments/assets/1e94cf28-10e4-4087-b645-8d791b88906c" />
<img width="1917" height="962" alt="image" src="https://github.com/user-attachments/assets/acb3f541-e06b-4f00-9a88-b5bddd4db9e1" />
<img width="1512" height="877" alt="image" src="https://github.com/user-attachments/assets/4637873b-e96a-41ec-a0d0-fb6150a336a7" />
<img width="1916" height="907" alt="image" src="https://github.com/user-attachments/assets/0c55229e-1b35-449f-a0cd-cae1f800c25c" />
<img width="1836" height="952" alt="image" src="https://github.com/user-attachments/assets/37c4feb4-4606-4355-9971-bdd4c7ac0197" />
<img width="1897" height="943" alt="image" src="https://github.com/user-attachments/assets/88ee7027-7c7a-4c53-9af6-74f5f1e73686" />

<img width="1307" height="906" alt="image" src="https://github.com/user-attachments/assets/a901e7d5-5468-4529-a7b4-cb637f8c9ba0" />


