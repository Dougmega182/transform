# Use a more complete Python base image (Debian-based)
FROM python:3

# Set the working directory
WORKDIR /app

# Copy all files to the container
COPY .  .
COPY requirements.txt /app/requirements.txt

# Install dependencies
RUN chmod -R 755 /app
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir --upgrade uvicorn

# Install all the packages listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port FastAPI runs on
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
