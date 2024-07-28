// sdk.js
var WeatherSDK = (function() {
    function getWeather(location) {
        return fetch(`https://16d4-147-235-200-38.ngrok-free.app/weather?location=${location}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }

    return {
        getWeather: getWeather
    };
})();
