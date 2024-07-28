async function loadWeather() {
    // Find the script element with the src attribute containing "sdk-respub.js"
    const scriptElement = document.querySelector('script[src*="sdk-respub.js"]');
    
    if (!scriptElement) {
        console.error("Script element not found.");
        return;
    }

    // Extract attributes from the script element
    const location = scriptElement.getAttribute('data-location') || 'tel-aviv'; // Default location if not specified
    const elementId = scriptElement.getAttribute('data-element-id');
    const widgetElement = document.getElementById(elementId);

    if (!widgetElement) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }

    // Set the API URL using the ngrok tunnel address and location
    const apiUrl = `https://16d4-147-235-200-38.ngrok-free.app/weather?location=${encodeURIComponent(location)}`;

    try {
        // Fetch weather data from the API
        const response = await fetch(apiUrl);
        
        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if the response is in JSON format
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Unexpected Content-Type: ${contentType}`);
        }

        // Parse the response as text and then as JSON
        const text = await response.text();
        const data = JSON.parse(text);

        // Check for errors in the data
        if (data.error) {
            widgetElement.innerText = `Error fetching weather data: ${data.error}`;
            return;
        }

        // Display the weather data in the widget element
        widgetElement.innerHTML = `
            <h3>Weather in ${data.location.name}</h3>
            <p>${data.current.condition.text}</p>
            <p>${data.current.temp_c}°C</p>
            <p>Humidity: ${data.current.humidity}%</p>
        `;
    } catch (error) {
        // Display an error message in case of any issues
        console.error(`Error fetching weather data: ${error.message}`);
        widgetElement.innerText = `Error fetching weather data: ${error.message}`;
    }
}

// Expose the loadWeather function to the global scope
window.loadWeather = loadWeather;
