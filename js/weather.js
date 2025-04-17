// This file manages the current weather display, including temperature toggling, weather icons, and additional weather details.

// Updated element selectors to match your HTML
const temperatureElement = document.getElementById('temperature');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const uvIndexElement = document.getElementById('uv-index');
const lastUpdatedElement = document.getElementById('last-updated');
const refreshButton = document.getElementById('refresh-btn'); // Changed to match HTML
const tempToggle = document.getElementById('temp-toggle'); // Changed to match HTML
const sunriseSunsetElement = document.getElementById('sunrise-sunset'); // Changed to match HTML

let currentUnit = 'metric'; // Default to Celsius

// Weather display update function
function updateWeatherDisplay(data) {
    if (!data) return;
    
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    
    // Update temperature displays
    temperatureElement.textContent = `${temperature}°`;
    feelsLikeElement.textContent = `Feels like: ${feelsLike}°`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
    windSpeedElement.textContent = `Wind: ${windSpeed} km/h`;
    
    // Handle UV index if available
    if (data.uvi !== undefined) {
        uvIndexElement.textContent = `UV Index: ${data.uvi}`;
    }
    
    // Handle sunrise/sunset
    if (data.sys && data.sys.sunrise && data.sys.sunset) {
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        sunriseSunsetElement.textContent = `Sunrise: ${sunrise} | Sunset: ${sunset}`;
    }
    
    lastUpdatedElement.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    
    // Update weather icon
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon && data.weather && data.weather[0]) {
        const iconCode = data.weather[0].icon;
        weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}">`;
    }
    
    // Update background theme
    if (data.weather && data.weather[0]) {
        updateBackground(data.weather[0].main, data.dt, data.sys?.sunrise, data.sys?.sunset);
    }
}

function updateBackground(weatherCondition, currentTime, sunrise, sunset) {
    const body = document.body;
    
    // Remove existing themes
    body.classList.remove('theme-clear', 'theme-rainy', 'theme-cloudy', 'theme-night');
    
    // Check if it's day or night
    const isNight = currentTime < sunrise || currentTime > sunset;
    
    if (isNight) {
        body.classList.add('theme-night');
        return;
    }
    
    // Apply theme based on weather condition
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            body.classList.add('theme-clear');
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            body.classList.add('theme-rainy');
            break;
        case 'clouds':
        case 'mist':
        case 'fog':
        case 'haze':
            body.classList.add('theme-cloudy');
            break;
        default:
            body.classList.add('theme-clear');
    }
}

// Add event listeners only if elements exist
document.addEventListener('DOMContentLoaded', () => {
    // Refresh button event listener
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            // Trigger refresh in app.js
            if (typeof updateWeatherData === 'function') {
                navigator.geolocation.getCurrentPosition(
                    position => updateWeatherData(position.coords.latitude, position.coords.longitude),
                    error => console.error('Error getting location:', error)
                );
            }
        });
    }
    
    // Temperature toggle event listener
    if (tempToggle) {
        tempToggle.addEventListener('click', () => {
            if (tempToggle.textContent === '°C') {
                tempToggle.textContent = '°F';
                convertTemperatures('C', 'F');
            } else {
                tempToggle.textContent = '°C';
                convertTemperatures('F', 'C');
            }
        });
    }
});

// Temperature conversion function
function convertTemperatures(from, to) {
    // Get all temperature elements
    const tempElements = document.querySelectorAll('[id*="temp"], [id*="feels"]');
    
    tempElements.forEach(element => {
        const text = element.textContent;
        const tempMatch = text.match(/(-?\d+(?:\.\d+)?)°/);
        
        if (tempMatch) {
            const currentTemp = parseFloat(tempMatch[1]);
            let newTemp;
            
            if (from === 'C' && to === 'F') {
                newTemp = Math.round((currentTemp * 9/5) + 32);
            } else if (from === 'F' && to === 'C') {
                newTemp = Math.round((currentTemp - 32) * 5/9);
            } else {
                return;
            }
            
            element.textContent = text.replace(`${tempMatch[1]}°`, `${newTemp}°`);
        }
    });
}