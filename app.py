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
        
        try:
            data = response.json()
            if not data:
                raise ValueError("Received empty JSON response")
        except ValueError as json_err:
            return JSONResponse(content={"error": f"Failed to parse JSON: {str(json_err)}"}, status_code=500)
        
        return JSONResponse(content=data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
