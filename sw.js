// LOOFA Service Worker
const CACHE = 'loofa-v4';

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll([
            '/loofa/',
            '/loofa/loofa-footwears.html',
            '/loofa/loofa-admin-app.html',
            '/loofa/icon-loofa.png',
            '/loofa/icon-admin.png',
            '/loofa/manifest-loofa.json',
            '/loofa/manifest-admin.json',
        ]).catch(() => {}))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const clone = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
