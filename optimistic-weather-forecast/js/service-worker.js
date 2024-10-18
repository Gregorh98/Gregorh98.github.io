self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('optimistic-weather-forecast').then((cache) => {
            return cache.addAll([
                '../index.html',
                '../css/optimistic-weather-forecast.css',
                '../js/optimistic-weather-forecast.js',
                '../js/three.min.js',
                '../js/vanta.fog.min.js',
                '../assets/favicon.ico',
                '../assets/icon_512.png',
                '../assets/icon_192.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
