# Use an official Python image as a base
FROM python:3-alpine

# Set the working directory
WORKDIR /app

# Copy all files to the container
COPY requirements.txt  .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port FastAPI runs on
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["Uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
