from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
app = FastAPI()

API_URL = 'https://api.weatherapi.com/v1/current.json'
API_KEY = os.getenv('API_KEY')  # Replace with your actual API key

@app.get("/weather")
async def get_weather(location: str):
    if not location:
        raise HTTPException(status_code=400, detail="Location parameter is required")

    response = requests.get(API_URL, params={'key': API_KEY, 'q': location})
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch weather data")

    return JSONResponse(content=response.json())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
