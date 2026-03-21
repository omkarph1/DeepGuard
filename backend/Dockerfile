# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=main.py

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
# Install PyTorch CPU directly to save space and avoid HF Free Space build timeout/oom
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to the container image.
COPY . .

# Change ownership of /app to an unprivileged user to run safely in HF Spaces
RUN useradd -m -u 1000 user

# Create uploads directory and give user ownership of the app folder
RUN mkdir -p /app/uploads && chown -R user:user /app

USER user

# Expose the port that HF Spaces expects (7860 by default)
EXPOSE 7860

# Run the web service on container startup.
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--threads", "8", "--timeout", "0", "main:app"]
