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

                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background-color: red;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 5px;
                    padding: 5x;
                    font-size: 14px;
                    text-align: center;
                    text-decoration: none; /* Remove underline */
                    flex: 0 0 auto; /* Prevent circles from shrinking */
                }
                .circle-container-wrapper {
                    display: flex;
                    overflow: hidden;
                }
                .circle-container {
                    display: flex;
                    flex-direction: row;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    width: 100%;
                }
                .circle-container .circle {
                    scroll-snap-align: start;
                    flex: 0 0 70px; /* Ensure circles don't shrink and have some space */
                }
                .circle-container::-webkit-scrollbar {
                    display: none; /* Hide scrollbar for WebKit browsers */
                }
                @media (min-width: 600px) {
                    .circle-container .circle {
                        flex: 0 0 100px; /* Adjust size for larger screens */
                    }
                }
                @media (min-width: 768px) {
                    .circle-container .circle {
                        flex: 0 0 120px; /* Adjust size for even larger screens */
                    }
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
                const keys = Object.keys(data);
                const visibleCount = 4; // Number of circles to show at once
                for (let i = 0; i < keys.length; i++) {
                    if (i < visibleCount) { // Show only the first 4 circles initially
                        const title = keys[i];
                        const link = data[title];
                        const circle = createCircle(title, link);
                        container.appendChild(circle);
                    }
                }
            }

            // Add a wrapper and container for the circles
            const circleWrapper = document.createElement('div');
            circleWrapper.className = 'circle-container-wrapper';
            const circleContainer = document.createElement('div');
            circleContainer.className = 'circle-container';
            circleWrapper.appendChild(circleContainer);
            widgetElement.appendChild(circleWrapper);

            loadCircles(data, circleContainer);

            // Add more circles if needed
            if (Object.keys(data).length > 4) {
                const moreCircles = Object.keys(data).slice(4);
                moreCircles.forEach((title) => {
                    const link = data[title];
                    const circle = createCircle(title, link);
                    circleContainer.appendChild(circle);
                });
            }
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

// Automatically load highlights on page load
window.onload = () => {
    if (window.loadHighlights) {
        window.loadHighlights();
    } else {
        console.error('loadHighlights function is not defined');
    }
};
