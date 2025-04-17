// This file handles weather alerts, including displaying notifications for severe weather and managing dismissible alerts.

const alertContainer = document.getElementById('alert-container');

// Function to display weather alerts
function displayAlert(alert) {
    const alertCard = document.createElement('div');
    alertCard.className = 'alert-card';
    alertCard.innerHTML = `
        <h3 class="alert-title">${alert.title}</h3>
        <p class="alert-description">${alert.description}</p>
        <button class="dismiss-alert" onclick="dismissAlert(this)">Dismiss</button>
    `;
    alertContainer.appendChild(alertCard);
}

// Function to dismiss an alert
function dismissAlert(button) {
    const alertCard = button.parentElement;
    alertCard.remove();
    saveDismissedAlert(alertCard.querySelector('.alert-title').innerText);
}

// Function to save dismissed alerts to localStorage
function saveDismissedAlert(alertTitle) {
    let dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts')) || [];
    dismissedAlerts.push(alertTitle);
    localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
}

// Function to check for severe weather alerts from the API
async function checkWeatherAlerts() {
    const response = await fetch('API_URL_FOR_ALERTS'); // Replace with actual API URL
    const data = await response.json();
    
    if (data.alerts) {
        data.alerts.forEach(alert => {
            if (!isAlertDismissed(alert.title)) {
                displayAlert(alert);
            }
        });
    }
}

// Function to check if an alert has been dismissed
function isAlertDismissed(alertTitle) {
    const dismissedAlerts = JSON.parse(localStorage.getItem('dismissedAlerts')) || [];
    return dismissedAlerts.includes(alertTitle);
}

// Initialize alerts on page load
document.addEventListener('DOMContentLoaded', checkWeatherAlerts);