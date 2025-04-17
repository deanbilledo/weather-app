// This file manages the hourly and daily weather forecasts, including displaying temperature values, weather icons, and precipitation probabilities.

const forecastContainer = document.getElementById('forecast-container');
const hourlyForecastContainer = document.getElementById('hourly-forecast-container');
const dailyForecastContainer = document.getElementById('daily-forecast-container');

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    hourlyForecastContainer.innerHTML = '';
    hourlyData.forEach(hour => {
        const hourCard = document.createElement('div');
        hourCard.className = 'hour-card';
        hourCard.innerHTML = `
            <div class="hour">${new Date(hour.dt * 1000).getHours()}:00</div>
            <img src="assets/icons/weather-icons/${hour.weather[0].icon}.svg" alt="${hour.weather[0].description}">
            <div class="temperature">${Math.round(hour.temp)}°</div>
            <div class="precipitation">${hour.pop * 100}%</div>
        `;
        hourlyForecastContainer.appendChild(hourCard);
    });
}

// Function to display daily forecast
function displayDailyForecast(dailyData) {
    dailyForecastContainer.innerHTML = '';
    dailyData.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.innerHTML = `
            <div class="day">${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div class="temperature">
                <span class="high">${Math.round(day.temp.max)}°</span> /
                <span class="low">${Math.round(day.temp.min)}°</span>
            </div>
            <img src="assets/icons/weather-icons/${day.weather[0].icon}.svg" alt="${day.weather[0].description}">
            <div class="precipitation">${day.pop * 100}%</div>
        `;
        dailyForecastContainer.appendChild(dayCard);
    });
}

// Function to fetch and display forecasts
async function fetchForecast(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=YOUR_API_KEY&units=metric`);
    const data = await response.json();
    displayHourlyForecast(data.hourly);
    displayDailyForecast(data.daily);
}

// Example usage: fetchForecast(35.6895, 139.6917); // Tokyo coordinates

// Event listener for location change
document.getElementById('location-input').addEventListener('change', (event) => {
    const location = event.target.value;
    // Fetch new coordinates based on location input and call fetchForecast
});