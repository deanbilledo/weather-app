// This file manages the current weather display, including temperature toggling, weather icons, and additional weather details.

const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const weatherContainer = document.getElementById('weather-container');
const temperatureElement = document.getElementById('temperature');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const uvIndexElement = document.getElementById('uv-index');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');
const lastUpdatedElement = document.getElementById('last-updated');
const refreshButton = document.getElementById('refresh-button');
const unitToggle = document.getElementById('unit-toggle');

let currentUnit = 'metric'; // Default to Celsius

function fetchWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${currentUnit}&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => updateWeatherDisplay(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateWeatherDisplay(data) {
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed);
    const uvIndex = data.uvi;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    
    temperatureElement.textContent = `${temperature}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    feelsLikeElement.textContent = `Feels like: ${feelsLike}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;
    uvIndexElement.textContent = `UV Index: ${uvIndex}`;
    sunriseElement.textContent = `Sunrise: ${sunrise}`;
    sunsetElement.textContent = `Sunset: ${sunset}`;
    lastUpdatedElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    
    updateBackground(data.weather[0].main);
}

function updateBackground(weatherCondition) {
    let gradient;
    switch (weatherCondition) {
        case 'Clear':
            gradient = 'linear-gradient(to bottom, #87CEEB, #1E90FF)';
            break;
        case 'Rain':
            gradient = 'linear-gradient(to bottom, #2C3E50, #34495E)';
            break;
        case 'Clouds':
            gradient = 'linear-gradient(to bottom, #D3D3D3, #778899)';
            break;
        case 'Snow':
        case 'Mist':
            gradient = 'linear-gradient(to bottom, #191970, #000000)';
            break;
        default:
            gradient = 'linear-gradient(to bottom, #87CEEB, #1E90FF)';
    }
    document.body.style.background = gradient;
}

unitToggle.addEventListener('change', () => {
    currentUnit = unitToggle.checked ? 'imperial' : 'metric';
    fetchWeather('Your Location'); // Replace with actual location or use geolocation
});

refreshButton.addEventListener('click', () => {
    fetchWeather('Your Location'); // Replace with actual location or use geolocation
});

// Initial fetch
fetchWeather('Your Location'); // Replace with actual location or use geolocation