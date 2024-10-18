self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('can-i-ride').then((cache) => {
            return cache.addAll([
                'index.html',
                'can-I-ride.css',
                'can-I-ride.js',
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
