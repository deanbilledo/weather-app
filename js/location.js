// location.js

const locationInput = document.getElementById('location-input');
const locationList = document.getElementById('location-list');
const favoritesList = document.getElementById('favorites-list');
const currentLocationButton = document.getElementById('current-location-button');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to fetch location data based on user input
async function fetchLocationData(query) {
    const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=YOUR_API_KEY&q=${query}&format=json`);
    const data = await response.json();
    displayLocationSuggestions(data);
}

// Function to display location suggestions
function displayLocationSuggestions(locations) {
    locationList.innerHTML = '';
    locations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location.display_name;
        li.onclick = () => selectLocation(location);
        locationList.appendChild(li);
    });
}

// Function to select a location
function selectLocation(location) {
    saveToFavorites(location);
    updateWeather(location);
    locationInput.value = '';
    locationList.innerHTML = '';
}

// Function to save location to favorites
function saveToFavorites(location) {
    if (!favorites.some(fav => fav.place_id === location.place_id)) {
        favorites.push(location);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
    }
}

// Function to update favorites list display
function updateFavoritesList() {
    favoritesList.innerHTML = '';
    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.textContent = fav.display_name;
        li.onclick = () => updateWeather(fav);
        favoritesList.appendChild(li);
    });
}

// Function to get current location using Geolocation API
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to fetch weather by coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`);
    const data = await response.json();
    updateWeather(data);
}

// Event listeners
locationInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 2) {
        fetchLocationData(query);
    } else {
        locationList.innerHTML = '';
    }
});

currentLocationButton.addEventListener('click', getCurrentLocation);

// Initialize favorites list on load
updateFavoritesList();