(async () => {
  const location = document.currentScript.getAttribute('data-location');
  const elementId = document.currentScript.getAttribute('data-element-id');
  const widgetElement = document.getElementById(elementId);

  if (!widgetElement) {
      console.error(`Element with ID '${elementId}' not found.`);
      return;
  }

  try {
      const response = await fetch(`https://8062-147-235-204-123.ngrok-free.app/weather?location=${location}`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

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
  } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
      widgetElement.innerText = 'Error fetching weather data.';
  }
})();
