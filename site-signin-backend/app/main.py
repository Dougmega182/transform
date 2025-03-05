import os
from fastapi import FastAPI
from dotenv import load_dotenv
from typing import Optional
import uvicorn

app = FastAPI()


# Load environment variables from .env
load_dotenv()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Site Sign-In/Sign-Out App",
        "database_url": os.getenv("DATABASE_URL"),
        "secret_key": os.getenv("SECRET_KEY"),
    }
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=os.getenv("PORT", default=5000), log_level="info")