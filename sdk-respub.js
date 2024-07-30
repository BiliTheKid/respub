// sdk-respub.js

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

    const apiUrl = `https://8062-147-235-204-123.ngrok-free.app/weather?location=${encodeURIComponent(location)}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();

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

            widgetElement.innerHTML = ''; // Clear previous content

            const circleData = [
                { text: `Location: ${data.location.name}` },
                { text: `Condition: ${data.current.condition.text}` },
                { text: `Temperature: ${data.current.temp_c}°C` },
                { text: `Humidity: ${data.current.humidity}%` }
            ];

            // Create and append styles
            const style = document.createElement('style');
            style.innerHTML = `
                .circle {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background-color: red;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 10px;
                    font-size: 14px;
                    text-align: center;
                }
                .circle-container {
                    display: flex;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);

            // Function to create a circle element
            function createCircle(text) {
                const circle = document.createElement('div');
                circle.className = 'circle';
                circle.innerText = text;
                return circle;
            }

            // Function to load circles into the specified container
            function loadCircles(data, container) {
                container.innerHTML = ''; // Clear existing circles if any
                data.forEach(item => {
                    const circle = createCircle(item.text);
                    container.appendChild(circle);
                });
            }

            loadCircles(circleData, widgetElement);
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
