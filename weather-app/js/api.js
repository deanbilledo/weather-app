const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

async function fetchCurrentWeather(location) {
    try {
        const response = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
}

async function fetchForecast(location) {
    try {
        const response = await fetch(`${forecastUrl}?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

export { fetchCurrentWeather, fetchForecast, getGeolocation };