// Service Worker

// Data
var myCache = "restauarantReview_100";
var cacheFiles = [
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  //"/img/",
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/swregister.js' 
];

// Event Listener for install - caching the files
self.addEventListener("install", function(event) {

  //console.log('In eventListener for install, event: ', event)
  event.waitUntil(caches.open(myCache).then(function(cache) {

    return cache.addAll(cacheFiles)
      //.then( function() { console.log('Cache worked'); } )
      .catch(function(error) {

        console.log("Caching failed, error: ", error);
      });
  }));
});


// Event Lstener for fetch - pull friles from cache and update with fetch is possible
self.addEventListener('fetch', function(event) {
  //console.log('In eventListener for fetch, event: ', event)

  event.respondWith(
    caches.match(event.request).then(function(response) {

      return response || fetch(event.request).then(function(fetchResponse) {

        return caches.open(myCache).then(function(cache) {

          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      })
    })
  );
});
