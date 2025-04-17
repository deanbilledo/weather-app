function formatTemperature(temp, unit) {
    return unit === 'C' ? `${Math.round(temp)}°C` : `${Math.round((temp * 9/5) + 32)}°F`;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentDate() {
    return new Date().toLocaleDateString();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

function showError(message) {
    alert(message);
}