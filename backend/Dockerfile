FROM python:3.11-slim

# Ortam değişkenleri
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Sistem bağımlılıkları
RUN apt-get update && apt-get install -y \
    libpq-dev \
    fonts-dejavu-core \
    gcc \
    gettext \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıkları
COPY requirements/ requirements/
RUN pip install -r requirements/base.txt

COPY . .

EXPOSE 8000
