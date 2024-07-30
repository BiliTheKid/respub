async function loadStories() {
    const scriptElement = document.querySelector('script[src*="sdk-respub.js"]');

    if (!scriptElement) {
        console.error("Script element not found.");
        return;
    }

    const elementId = scriptElement.getAttribute('data-element-id');
    const widgetElement = document.getElementById(elementId);

    if (!widgetElement) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }

    const apiUrl = `https://your-ngrok-url.ngrok-free.app/stories`;

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
            widgetElement.innerText = 'Error fetching stories data: unexpected content type.';
            return;
        }

        try {
            const data = JSON.parse(text);

            if (data.error) {
                widgetElement.innerText = `Error fetching stories data: ${data.error}`;
                return;
            }

            widgetElement.innerHTML = ''; // Clear previous content

            const circleData = data.stories.map((story, index) => ({ text: `Story ${index + 1}`, url: story }));

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
                    cursor: pointer;
                }
                .circle-container {
                    display: flex;
                    flex-direction: row; /* Ensures horizontal layout */
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap; /* Allows wrapping to new lines if needed */
                }
            `;
            document.head.appendChild(style);

            // Function to create a circle element
            function createCircle(text, url) {
                const circle = document.createElement('div');
                circle.className = 'circle';
                circle.innerText = text;
                circle.onclick = () => window.open(url, '_blank'); // Open story in a new tab
                return circle;
            }

            // Function to load circles into the specified container
            function loadCircles(data, container) {
                container.innerHTML = ''; // Clear existing circles if any
                data.forEach(item => {
                    const circle = createCircle(item.text, item.url);
                    container.appendChild(circle);
                });
            }

            // Add a container for the circles
            const circleContainer = document.createElement('div');
            circleContainer.className = 'circle-container';
            widgetElement.appendChild(circleContainer);

            loadCircles(circleData, circleContainer);
        } catch (jsonError) {
            console.error("Failed to parse JSON:", text);
            widgetElement.innerText = 'Error fetching stories data: invalid JSON response.';
        }
    } catch (error) {
        console.error(`Error fetching stories data: ${error.message}`);
        widgetElement.innerText = `Error fetching stories data: ${error.message}`;
    }
}

window.loadStories = loadStories;
