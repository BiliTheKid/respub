from fastapi import FastAPI
import httpx
import os
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

WEATHER_API_KEY = os.getenv("API_KEY")

@app.get("/weather")
async def get_weather(location: str):
    url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={location}&aqi=no"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            return JSONResponse(content={"error": "Failed to fetch weather data"}, status_code=response.status_code)
        data = response.json()
        return JSONResponse(content=data)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])

WEATHER_API_KEY = os.getenv("API_KEY")
WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json"

@app.get("/weather")
def get_weather(location: str):
    try:
        response = requests.get(f"{WEATHER_API_URL}?key={WEATHER_API_KEY}&q={location}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
