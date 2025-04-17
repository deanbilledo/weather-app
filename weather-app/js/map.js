// This file integrates a third-party weather map API, providing interactive features like zooming, panning, and layer toggling.

const mapContainer = document.getElementById('map');
let map;
let weatherLayer;

// Initialize the map
function initMap() {
    map = L.map(mapContainer).setView([0, 0], 2); // Default view

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add weather layer
    weatherLayer = L.layerGroup().addTo(map);
}

// Fetch weather data and update the map
function updateWeatherMap(lat, lon) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherIcon = data.weather[0].icon;
            const weatherDescription = data.weather[0].description;

            // Clear previous weather markers
            weatherLayer.clearLayers();

            // Add weather marker
            const marker = L.marker([lat, lon]).addTo(weatherLayer);
            marker.bindPopup(`<b>${weatherDescription}</b><br><img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}">`).openPopup();
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Toggle weather layers
function toggleWeatherLayer(layerType) {
    if (layerType === 'precipitation') {
        // Logic to toggle precipitation layer
    } else if (layerType === 'temperature') {
        // Logic to toggle temperature layer
    }
}

// Event listeners for map interactions
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    updateWeatherMap(lat, lon);
});

// Initialize the map on page load
document.addEventListener('DOMContentLoaded', initMap);