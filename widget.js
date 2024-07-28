(function() {
  const script = document.createElement('script');
  script.src = 'https://bilithekid.github.io/respub/sdk-respub.js'; // Replace with the actual URL of your SDK
  script.onload = function() {
    if (typeof WeatherSDK === 'undefined') {
      console.error('WeatherSDK is not loaded');
      return;
    }

    function displayWeather(elementId, location) {
      fetch(`https://16d4-147-235-200-38.ngrok-free.app/weather?location=${location}`)  // Replace with your ngrok URL
        .then(response => response.json())
        .then(data => {
          const weatherElement = document.getElementById(elementId);
          if (weatherElement) {
            weatherElement.innerHTML = `
              <h3>Weather in ${data.location.name}</h3>
              <p>${data.current.condition.text}</p>
              <p>Temperature: ${data.current.temp_c} °C</p>
            `;
          } else {
            console.error('Element with id ' + elementId + ' not found.');
          }
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    }

    const scriptTags = document.getElementsByTagName('script');
    const currentScript = scriptTags[scriptTags.length - 1];
    const location = currentScript.getAttribute('data-location');
    const elementId = currentScript.getAttribute('data-element-id');

    if (location && elementId) {
      displayWeather(elementId, location);
    } else {
      console.error('Missing data-location or data-element-id attribute.');
    }
  };

  document.head.appendChild(script);
})();
