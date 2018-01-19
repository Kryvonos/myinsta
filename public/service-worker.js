function log () {
  console.log('[ServiceWorker]', ...arguments)
}

const CACHE_STATIC_NAME = 'static-v3'
const CACHE_DYNAMIC_NAME = 'dynamic-v2'

self.addEventListener('install', event => {
  log('Installing Service Worker ...', event)
  
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        log('Caching App Shell')
        cache.addAll([
          '/',
          '/index.html',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/material.min.js',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ])
      })
      .catch(err => {
        console.log(err)
      })
  )
})
// 

self.addEventListener('activate', event => {
  log('Activating Service Worker ...', event)
  
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(keys.map(key => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            log('Removing old cache.', key)
            return caches.delete(key)
          }
        }))
      })
  )
  
  return self.clients.claim()
})

self.addEventListener('fetch', event => {
  console.log(event.request.url)
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        } else {
          return Promise.all([
            fetch(event.request),
            caches.open(CACHE_DYNAMIC_NAME)
          ])
            .then(results => {
              const [fetchResponse, cache] = results
              
              return Promise.all([
                Promise.resolve(fetchResponse),
                // cache.put(event.request.url, fetchResponse.clone())
              ])
            })
            .then(results => {
              const [fetchResponse] = results
              
              return fetchResponse
            })
            .catch(err => {
              log(err)
            })
        }
      })
  )
})