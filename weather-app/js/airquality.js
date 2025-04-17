// airquality.js

const airQualityApiKey = 'YOUR_AIR_QUALITY_API_KEY'; // Replace with your actual API key
const airQualityApiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';

async function fetchAirQuality(lat, lon) {
    try {
        const response = await fetch(`${airQualityApiUrl}?lat=${lat}&lon=${lon}&appid=${airQualityApiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch air quality data');
        }
        const data = await response.json();
        displayAirQuality(data);
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        alert('Could not retrieve air quality data. Please try again later.');
    }
}

function displayAirQuality(data) {
    const aqiValue = data.list[0].main.aqi;
    const aqiElement = document.getElementById('aqi-value');
    const aqiRecommendation = document.getElementById('aqi-recommendation');

    aqiElement.textContent = `AQI: ${aqiValue}`;
    aqiRecommendation.textContent = getAQIRecommendation(aqiValue);
}

function getAQIRecommendation(aqi) {
    switch (aqi) {
        case 1:
            return 'Good: Air quality is considered satisfactory, and air pollution poses little or no risk.';
        case 2:
            return 'Moderate: Air quality is acceptable; however, for some pollutants, there may be a moderate health concern for a very small number of people.';
        case 3:
            return 'Unhealthy for Sensitive Groups: Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
        case 4:
            return 'Unhealthy: Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
        case 5:
            return 'Very Unhealthy: Health alert: everyone may experience more serious health effects.';
        case 6:
            return 'Hazardous: Health warnings of emergency conditions. The entire population is more likely to be affected.';
        default:
            return 'No data available.';
    }
}

// Example usage: fetch air quality for a specific location
// fetchAirQuality(latitude, longitude);