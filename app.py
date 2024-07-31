from fastapi import FastAPI
import httpx
import os
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
import re 
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


#WEATHER_API_KEY = os.getenv("API_KEY")
RPD_KEY = os.getenv("RPD_KEY")

def highlight():
        
    url = "https://instagram-scraper-api2.p.rapidapi.com/v1/highlights"

    querystring = {"username_or_id_or_url":"calcalist"}

    headers = {
        "x-rapidapi-key": RPD_KEY,
        "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    print(response.json())
    return response.json()


# @app.get("/weather")
# async def get_weather(location: str):
#     url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={location}&aqi=no"
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url)
        
#         # Log request and response details
#         print(f"Request URL: {url}")
#         print(f"Response Status: {response.status_code}")
#         print(f"Response Headers: {response.headers}")
#         print(f"Response Body: {response.text}")

#         if response.status_code != 200:
#             return JSONResponse(content={"error": "Failed to fetch weather data"}, status_code=response.status_code)
        

        
#         try:
#             data = response.json()
#             if not data:
#                 raise ValueError("Received empty JSON response")
#         except ValueError as json_err:
#             return JSONResponse(content={"error": f"Failed to parse JSON: {str(json_err)}"}, status_code=500)
        
#         return JSONResponse(content=data)

@app.get("/highlights")
async def highlight_create():
    response = highlight()
    items = response['data']['items']
    data = {}

    for item in items:
        title = item.get('title')
        highlight_id = item.get('id')

        if title and highlight_id:
            # Extract the numeric part after the colon
            numeric_id = highlight_id.split(':')[1]
            # Construct the URL
            url = f"https://www.instagram.com/stories/highlights/{numeric_id}"
            # Set the URL for each title
            data[title] = url

    # Return the structured data as a JSON response
    return JSONResponse(content=data)




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
