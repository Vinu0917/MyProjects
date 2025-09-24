/**
 * Study Tracker Service Worker
 * Provides offline functionality and caching for PWA
 */

const CACHE_NAME = 'study-tracker-v2.0';
const STATIC_CACHE = 'study-tracker-static-v2.0';
const DYNAMIC_CACHE = 'study-tracker-dynamic-v2.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Dynamic assets to cache on demand
const CACHE_STRATEGIES = {
  // Cache first, then network
  cacheFirst: [
    '/styles.css',
    '/app.js',
    '/icons/'
  ],
  // Network first, then cache
  networkFirst: [
    '/api/',
    '/'
  ]
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for specific CDNs)
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleFetch(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Determine caching strategy
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request);
    } else {
      return await networkFirst(request);
    }
  } catch (error) {
    console.error('Service Worker: Fetch failed', error);
    return await handleOffline(request);
  }
}

/**
 * Cache first strategy - check cache, then network
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateCache(request);
    return cachedResponse;
  }
  
  return await fetchAndCache(request, STATIC_CACHE);
}

/**
 * Network first strategy - try network, fallback to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Fetch and cache a request
 */
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  
  if (response.ok) {
    await cacheResponse(request, response.clone(), cacheName);
  }
  
  return response;
}

/**
 * Cache a response
 */
async function cacheResponse(request, response, cacheName) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
}

/**
 * Update cache in background
 */
function updateCache(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        return cacheResponse(request, response, STATIC_CACHE);
      }
    })
    .catch((error) => {
      console.log('Service Worker: Background update failed', error);
    });
}

/**
 * Handle offline scenarios
 */
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Return cached version if available
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match('/');
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // Return a basic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Please check your connection.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * Check if a pathname is a static asset
 */
function isStaticAsset(pathname) {
  return CACHE_STRATEGIES.cacheFirst.some(pattern => 
    pathname.startsWith(pattern)
  );
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'study-session-sync') {
    event.waitUntil(syncStudySessions());
  }
});

/**
 * Sync study sessions when back online
 */
async function syncStudySessions() {
  try {
    // This would sync with a backend API in a real app
    console.log('Service Worker: Syncing study sessions...');
    
    // For now, just log that sync would happen
    const studyLogs = JSON.parse(localStorage.getItem('studyTracker_logs') || '[]');
    console.log('Service Worker: Would sync', studyLogs.length, 'sessions');
    
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

/**
 * Handle push notifications (for future implementation)
 */
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Time to study!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Study Tracker',
        options
      )
    );
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
