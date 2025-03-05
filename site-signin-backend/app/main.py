import os
from fastapi import FastAPI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Site Sign-In/Sign-Out App",
        "database_url": os.getenv("DATABASE_URL"),
        "secret_key": os.getenv("SECRET_KEY"),
    }
