self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('weather-app-cache-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/styles.css',
                '/css/themes.css',
                '/css/animations.css',
                '/js/app.js',
                '/js/api.js',
                '/js/weather.js',
                '/js/location.js',
                '/js/forecast.js',
                '/js/alerts.js',
                '/js/map.js',
                '/js/airquality.js',
                '/js/history.js',
                '/js/recommendations.js',
                '/js/utils.js',
                '/assets/icons/weather-icons/sunny.svg',
                '/assets/icons/weather-icons/rainy.svg',
                '/assets/icons/weather-icons/cloudy.svg',
                '/assets/icons/ui-icons/location.svg',
                '/assets/icons/ui-icons/refresh.svg',
                '/assets/icons/ui-icons/settings.svg',
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open('weather-app-cache-v1').then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = ['weather-app-cache-v1'];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});