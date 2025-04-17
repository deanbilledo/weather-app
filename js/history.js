// This file handles historical weather data, allowing users to compare previous days and view specific past dates.

const historyContainer = document.getElementById('history-container');
const historyButton = document.getElementById('history-button');
const historyData = JSON.parse(localStorage.getItem('weatherHistory')) || [];

// Function to render historical weather data
function renderHistory() {
    historyContainer.innerHTML = '';
    if (historyData.length === 0) {
        historyContainer.innerHTML = '<p>No historical data available.</p>';
        return;
    }

    historyData.forEach(entry => {
        const historyCard = document.createElement('div');
        historyCard.classList.add('history-card');
        historyCard.innerHTML = `
            <h3>${entry.date}</h3>
            <p>Temperature: ${entry.temperature}°${entry.unit}</p>
            <p>Condition: ${entry.condition}</p>
            <p>Humidity: ${entry.humidity}%</p>
            <p>Wind Speed: ${entry.windSpeed} km/h</p>
        `;
        historyContainer.appendChild(historyCard);
    });
}

// Function to save weather data to history
function saveToHistory(data) {
    const entry = {
        date: data.date,
        temperature: data.temperature,
        condition: data.condition,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        unit: data.unit
    };
    historyData.push(entry);
    localStorage.setItem('weatherHistory', JSON.stringify(historyData));
}

// Event listener for history button
historyButton.addEventListener('click', () => {
    renderHistory();
});

// Initial render
renderHistory();