async function loadHighlights() {
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

    const apiUrl = `https://respub.onrender.com/highlights`; // Ensure this URL is correct

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
            widgetElement.innerText = 'Error fetching highlight data: unexpected content type.';
            return;
        }

        try {
            const data = JSON.parse(text);

            if (data.error) {
                widgetElement.innerText = `Error fetching highlight data: ${data.error}`;
                return;
            }

            widgetElement.innerHTML = ''; // Clear previous content

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
                    text-decoration: none; /* Remove underline */
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
            function createCircle(text, link) {
                const anchor = document.createElement('a');
                anchor.href = link;
                anchor.target = '_blank'; // Open link in a new tab
                anchor.className = 'circle';
                anchor.innerText = text;
                return anchor;
            }

            // Function to load circles into the specified container
            function loadCircles(data, container) {
                container.innerHTML = ''; // Clear existing circles if any
                Object.keys(data).forEach(title => {
                    const link = data[title]; // Get link for the circle
                    const circle = createCircle(title, link);
                    container.appendChild(circle);
                });
            }

            // Add a container for the circles
            const circleContainer = document.createElement('div');
            circleContainer.className = 'circle-container';
            widgetElement.appendChild(circleContainer);

            loadCircles(data, circleContainer);
        } catch (jsonError) {
            console.error("Failed to parse JSON:", text);
            widgetElement.innerText = 'Error fetching highlight data: invalid JSON response.';
        }
    } catch (error) {
        console.error(`Error fetching highlight data: ${error.message}`);
        widgetElement.innerText = `Error fetching highlight data: ${error.message}`;
    }
}

window.loadHighlights = loadHighlights;
