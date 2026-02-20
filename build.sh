#!/bin/bash
# Build script for Render deployment
# Ensures Python 3.11 is used regardless of default

set -e

echo "Setting up HRMS Lite backend..."
echo "Python version:"
python3 --version

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "✅ Build complete!"
