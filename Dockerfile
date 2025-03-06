# Use an official Python image as a base
FROM python:3-alpine

# Set the working directory
WORKDIR /app

# Copy all files to the container
COPY .  .
COPY requirements.txt /app/requirements.txt

# Install system dependencies for building packages
RUN chmod -R 755 /app
RUN apk add --no-cache python3 py3-pip gcc musl-dev python3-dev g++ libffi-dev linux-headers bash

# Upgrade pip and install dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir --upgrade uvicorn

# Install all the packages listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port FastAPI runs on
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
