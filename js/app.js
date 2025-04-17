// Main JavaScript file for the Weather App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
});

async function initApp() {
    // Try to get user's location
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Get and display weather data
        await updateWeatherData(lat, lon);
    } catch (error) {
        console.error('Error getting location:', error);
        // Default to a location if geolocation fails
        await updateWeatherData(40.7128, -74.0060); // New York coordinates
    }
    
    // Set up event listeners
    setupEventListeners();
}

async function updateWeatherData(lat, lon) {
    try {
        // Show loading state
        document.getElementById('temperature').textContent = 'Loading...';
        
        // Fetch weather data
        const weatherData = await WeatherAPI.getCurrentWeather(lat, lon);
        const forecastData = await WeatherAPI.getForecast(lat, lon);
        
        if (weatherData) {
            // Update current weather display
            updateCurrentWeather(weatherData);
        } else {
            throw new Error('Weather data unavailable');
        }
        
        if (forecastData) {
            // Update forecast displays
            updateForecast(forecastData);
        }
    } catch (error) {
        console.error('Error updating weather data:', error);
        // Show error message to user
        document.getElementById('temperature').textContent = 'Error loading weather data';
    }
}

function setupEventListeners() {
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', async () => {
        // Get current location again and refresh data
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            await updateWeatherData(position.coords.latitude, position.coords.longitude);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    });
    
    // Temperature toggle
    document.getElementById('temp-toggle').addEventListener('click', () => {
        const tempToggle = document.getElementById('temp-toggle');
        if (tempToggle.textContent === '°C') {
            tempToggle.textContent = '°F';
            // Convert all temperatures to Fahrenheit
            convertTemperatures('C', 'F');
        } else {
            tempToggle.textContent = '°C';
            // Convert all temperatures to Celsius
            convertTemperatures('F', 'C');
        }
    });
}

// Function to convert temperatures
function convertTemperatures(from, to) {
    // Implementation of temperature conversion logic
    console.log(`Converting temperatures from ${from} to ${to}`);
    // This would be implemented to change all displayed temperatures
}

// Function to update current weather UI
function updateCurrentWeather(data) {
    console.log('Weather data:', data);
    
    // Update temperature
    const tempElement = document.getElementById('temperature');
    tempElement.textContent = `${Math.round(data.main.temp)}°`;
    
    // Update weather details
    document.getElementById('feels-like').textContent = `Feels like: ${Math.round(data.main.feels_like)}°`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    
    // Update weather icon (placeholder)
    const weatherIcon = document.getElementById('weather-icon');
    const iconCode = data.weather[0].icon;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}">`;
    
    // Update last updated time
    const lastUpdated = document.getElementById('last-updated');
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    
    // Apply theme based on weather condition
    applyWeatherTheme(data.weather[0].main, data.dt, data.sys.sunrise, data.sys.sunset);
}

// Function to update forecast UI
function updateForecast(data) {
    console.log('Forecast data:', data);
    
    // Update hourly forecast
    const hourlyContainer = document.getElementById('hourly-forecast');
    hourlyContainer.innerHTML = ''; // Clear existing forecast
    
    // Display hourly forecast for next 24 hours (or however many are available)
    const hoursToShow = Math.min(24, data.hourly.length);
    
    for (let i = 0; i < hoursToShow; i++) {
        const hourData = data.hourly[i];
        const hour = new Date(hourData.dt * 1000).getHours();
        const hourDisplay = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <div>${hourDisplay}</div>
            <img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" alt="${hourData.weather[0].description}">
            <div>${Math.round(hourData.temp)}°</div>
            <div>${hourData.pop > 0 ? Math.round(hourData.pop * 100) + '%' : ''}</div>
        `;
        
        hourlyContainer.appendChild(hourlyItem);
    }
    
    // Update daily forecast
    const weeklyContainer = document.getElementById('weekly-forecast');
    weeklyContainer.innerHTML = ''; // Clear existing forecast
    
    // Show 7-day forecast
    for (let i = 0; i < data.daily.length; i++) {
        const dayData = data.daily[i];
        const date = new Date(dayData.dt * 1000);
        const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dailyItem = document.createElement('div');
        dailyItem.className = 'daily-item';
        dailyItem.innerHTML = `
            <div class="day-name">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="${dayData.weather[0].description}">
            <div class="temp-range">
                <span class="high">${Math.round(dayData.temp.max)}°</span>
                <span class="low">${Math.round(dayData.temp.min)}°</span>
            </div>
            <div>${dayData.pop > 0 ? Math.round(dayData.pop * 100) + '%' : ''}</div>
        `;
        
        weeklyContainer.appendChild(dailyItem);
    }
}

// Function to apply theme based on weather
function applyWeatherTheme(weatherCondition, currentTime, sunrise, sunset) {
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupEventListeners();
    
    // Load initial weather data
    loadWeatherData();
});

// Function to set up event listeners
function setupEventListeners() {
    const refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', loadWeatherData);

    const locationInput = document.getElementById('location-input');
    locationInput.addEventListener('input', handleLocationInput);
}

// Function to load weather data
function loadWeatherData() {
    // Fetch current weather data and update the UI
    fetchWeatherData()
        .then(data => updateWeatherUI(data))
        .catch(error => showError(error));
}

// Function to handle location input
function handleLocationInput(event) {
    const query = event.target.value;
    // Implement autocomplete functionality here
}

// Function to update the weather UI
function updateWeatherUI(data) {
    // Update the UI with the fetched weather data
}

// Function to show error messages
function showError(error) {
    console.error('Error fetching weather data:', error);
    // Display user-friendly error message
}

// Fetch weather data from the API
function fetchWeatherData() {
    // Call the API and return a promise
}