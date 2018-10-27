// Service Worker

// Include DBHelper function for fetching restaurants and putting in indexedDB
self.importScripts('js/dbhelper.js', 'js/idb.js');

// Data
var myCache = "restaurantReview_311";
var cacheFiles = [
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/img/',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/swregister.js' ,
  '/js/idb.js'
];

// Event Listener for install - caching the files
self.addEventListener("install", function(event) {

  //console.log('In eventListener for install, event: ', event)
  event.waitUntil(caches.open(myCache).then(function(cache) {

    return cache.addAll(cacheFiles)
      .then( function() { console.log('Cache worked'); } )
      .catch(function(error) {

        console.log("Caching failed, error: ", error);
      });
  }));
});


// Event Lstener for fetch - pull files from cache and update with fetch is possible
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

// Event Listener for activate - 
self.addEventListener('activate', event => {
  console.log("Event trigger - activate");
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Could use switch statement here to update IDB. Curretn Data set is static, needs just one init/.
      idb.open('restaurantReviews', 1, upgradeDB => {
        // If not there already, add restaurant data
        if(!upgradeDB.objectStoreNames.contains('restaurantData')) {
          let objStore = upgradeDB.createObjectStore('restaurantData', {keyPath: 'id'});
          console.log(restaurants);
          restaurants.map(restaurant => objStore.add(restaurant));
        }
      });
    }
  });
});
