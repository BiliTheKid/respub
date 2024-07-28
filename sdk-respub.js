async function loadWeather() {
    const scriptElement = document.querySelector('script[src*="sdk-respub.js"]');
    
    if (!scriptElement) {
        console.error("Script element not found.");
        return;
    }

    const location = scriptElement.getAttribute('data-location') || 'London'; // Default location if not specified
    const elementId = scriptElement.getAttribute('data-element-id');
    const widgetElement = document.getElementById(elementId);

    if (!widgetElement) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }

    const apiUrl = `https://16d4-147-235-200-38.ngrok-free.app/weather?location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(apiUrl);

        console.log("Response Status:", response.status);
        console.log("Response Headers:", [...response.headers.entries()]); // Log all headers
        console.log("Response URL:", response.url); // Log the request URL

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        console.log("Response Text:", text);

        if (response.headers.get('Content-Type') !== 'application/json') {
            console.error(`Unexpected Content-Type: ${response.headers.get('Content-Type')}`);
            widgetElement.innerText = 'Error fetching weather data: unexpected content type.';
            return;
        }

        try {
            const data = JSON.parse(text);

            if (data.error) {
                widgetElement.innerText = `Error fetching weather data: ${data.error}`;
                return;
            }

            widgetElement.innerHTML = `
                <h3>Weather in ${data.location.name}</h3>
                <p>${data.current.condition.text}</p>
                <p>${data.current.temp_c}°C</p>
                <p>Humidity: ${data.current.humidity}%</p>
            `;
        } catch (jsonError) {
            console.error("Failed to parse JSON:", text);
            widgetElement.innerText = 'Error fetching weather data: invalid JSON response.';
        }
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        widgetElement.innerText = `Error fetching weather data: ${error.message}`;
    }
}

window.loadWeather = loadWeather;
