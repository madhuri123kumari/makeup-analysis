FROM python:3.11.16-slim-trixie

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Writable runtime directories
ENV HOME=/tmp
ENV MPLCONFIGDIR=/tmp/matplotlib
ENV XDG_CACHE_HOME=/tmp/.cache

RUN mkdir -p \
    /tmp/matplotlib \
    /tmp/.cache \
    /tmp/.insightface

# Build tools required by InsightFace and its native dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY python-ai/requirements.txt /app/python-ai/requirements.txt

RUN pip install --no-cache-dir -r /app/python-ai/requirements.txt

# Copy application
COPY . /app

WORKDIR /app/python-ai

# InsightFace model location
ENV INSIGHTFACE_ROOT=/app/python-ai/.insightface

RUN mkdir -p /app/python-ai/.insightface/models

# Download buffalo_s during image build
RUN python -c "import urllib.request, zipfile, os; url='https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_s.zip'; z='/tmp/buffalo_s.zip'; urllib.request.urlretrieve(url, z); zipfile.ZipFile(z).extractall('/app/python-ai/.insightface/models'); os.remove(z)"

EXPOSE 8080

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-8080}"]