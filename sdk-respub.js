async function loadWeather() {
    const scriptElement = document.querySelector('script[src*="sdk-respub.js"]');
    
    if (!scriptElement) {
        console.error("Script element not found.");
        return;
    }

    const location = scriptElement.getAttribute('data-location');
    const elementId = scriptElement.getAttribute('data-element-id');
    const widgetElement = document.getElementById(elementId);

    if (!widgetElement) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }

    try {
        const response = await fetch(`https://16d4-147-235-200-38.ngrok-free.app/weather?location=tel-aviv`);
        
        // Check if the response is in JSON format
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error(`Unexpected Content-Type: ${contentType}`);
            widgetElement.innerText = 'Error fetching weather data: unexpected content type.';
            return;
        }

        const text = await response.text();
        console.log("Raw response text:", text);  // Debug log

        try {
            const data = JSON.parse(text);
            if (data.error) {
                widgetElement.innerText = `Error fetching weather data: ${data.error}`;
            } else {
                widgetElement.innerHTML = `
                    <h3>Weather in ${data.location.name}</h3>
                    <p>${data.current.condition.text}</p>
                    <p>${data.current.temp_c}°C</p>
                    <p>Humidity: ${data.current.humidity}%</p>
                `;
            }
        } catch (jsonError) {
            console.error("Failed to parse JSON:", text);
            widgetElement.innerText = 'Error fetching weather data: invalid JSON response.';
        }
    } catch (error) {
        console.error(`Error fetching weather data: ${error}`);
        widgetElement.innerText = 'Error fetching weather data.';
    }
}

window.loadWeather = loadWeather;
