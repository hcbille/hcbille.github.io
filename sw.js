// The old Homer dashboard installed a service worker that cached the site.
// This replacement clears that cache, unregisters itself, and reloads open
// tabs so returning visitors get the new site. Safe to delete in a year or so.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) await caches.delete(key);
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
  })());
});
