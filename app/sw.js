/*
 * Service Worker
 */

// Include DBHelper functions for fetching restaurants and putting in indexedDB
// self.importScripts('./js/dbhelper.js', './js/idb.js');

// Cache Information
var myCache     = 'restaurantReview_301';
var cacheFiles  = [
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

// IDB Information
// const dbPromise = idb.open('restaurantReviews', 3, upgradeDb => {
//   switch(upgradeDb.oldVersion) {
//     case 0: upgradeDb.createObjectStore('restaurantData', {keyPath: 'id'});
//     case 1: upgradeDb.createObjectStore('reviewData',     {keypath: 'id'}).createIndex('restaurant_id', 'restaurant_id');
//     case 2: upgradeDb.createObjectStore('updateData',     {keyPath: 'id', autoIncrement: true});
//   }
// });

/*
 * Event Listener for install - caching the files
 */
self.addEventListener('install', function(event) {
  console.log('In eventListener for install, event: ', event)
  event.waitUntil(caches.open(myCache)
  .then(function(cache) {
    return cache.addAll(cacheFiles)
      .then(function()      { console.log('Cache worked!'); } )
      .catch(function(error) { console.log('Caching failed, error: ', error);  } );
  }));
});


/*
 * Event Listener for fetch - pull files from cache and update with fetch is possible
 */
self.addEventListener('fetch', function(event) {
  console.log('In eventListener for fetch, event: ', event);
  // Separating fetch requests
  let requestURL = new URL(event.request.url);
  if (requestURL.port === '1337') {
    let id = requestURL.searchParams.get('restaurant_id') - 0;
    if(!id) {
      if(requestURL.pathname.indexOf('restaurants')) {
        let pathArr = requestURL.pathname.split('/');
        id = pathArr[pathArr.length - 1] === 'restaurants' ? '-1' : pathArr[pathArr.length -1];
      }
      else {  id = requestURL.searchParams.get('restaurant_id');  }
      apiFetch(event, id);
    }
    else {
      let cacheRequest = event.request;
      if(cacheRequest.url.indexOf('restaurant.html') > -1) cacheRequest = new Request('restaurant.html');
      cacheFetch(event, cacheRequest);  }
  }
});

function apiFetch(event, id) {
  console.log(`In apiFetch - event: ${event} id: ${id}`);
  if (event.request.method == 'POST' || event.request.method == 'PUT') {
    // Post & Put methods are not cached. Process request without further action.
    return fetch(event.request)
      .then(function(response) {  return response.json();  });
  }

  // Restaurant and Review information are now being kept in separate stores: restaurantData & reviewData

  // Restaurant Request -------------------------------------------------------------------------------
  if(event.request.url.indexOf('restaurants') > -1) {
    event.respondWith(dbPromise.then(function(db) {
      return db.transaction('restaurantData').objectStore('restaurantData').get(id);
    })
    .then(function(data) {
      return (data && data.data) || fetch(event.request)

        .then(function(response) {
          return dbPromise

            .then(function(db) {
              db.transaction('restaurantData', 'readwrite').objectStore('restaurantData').put({ id: id, data: response.json() });
              return response.json();
            });
        });
    })
    .then(function(endResponse) { return new Response(JSON.stringify(endResponse)); })
    .catch(function(error)      { console.log(`In apiFetch catch-restaurantData, error: ${error.message}`); }));
  }

  // Review Request -----------------------------------------------------------------------------------
  event.respondWith(dbPromise.then(function(db) {
    return db.transaction('reviewData').objectStore('reviewData').index('restaurant_id').getAll(id);
  })
  .then(function(data) {
    return (data && data.data) || fetch(event.request)

      .then(function(response) {
        return dbPromise

          .then(function(db) {
            let store = db.transaction('reviewData', 'readwrite').objectStore('reviewData');
            response.json().forEach(function(review) {
            store.put({id: review.id, 'restaurant_id': review.restaurant_id, data: review});
            })
            return response.json();
          });
      });
  })
  .then(function(endResponse) {
    if(endResponse[0].data) {
      let formatted = endResponse.map(review => review.data);
      return new Response(JSON.stringify(formatted));
    }
    return new Response(JSON.stringify(endResponse));
  })
  .catch(function(error) {  console.log(`In apiFetch catch-reviewData, error: ${error.message}`);  }));
}

function cacheFetch(event, request) {
  console.log(`In cacheFetch - event: ${event} request: ${request}`);
  // Check the cache before fetching.
  // If fetched, store in the cache.
  event.respondWith(caches.match(request))
    .then(function(response) {
      return response || fetch(event.request)

        .then(function(fetchResponse) {
          return caches.open(myCache)

            .then(function(cache) {
              if(fetchResponse.url.indexOf('browsersync') === -1) cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
        })
        .catch(function(error) {  console.log(`In cacheFetch catch, error: ${error.message}`);  });
    })
}

// /*
//  * Event Listener for activate
//  */
// self.addEventListener('activate', event => {
//   console.log('Event trigger - activate');
//   DBHelper.fetchRestaurants((error, restaurants) => {
//     if (error) {
//       callback(error, null);
//     } else {
//       const dbPromise = idb.open('restaurantReviews', 3, upgradeDb => {
//         switch(upgradeDb.oldVersion) {
//           case 0: upgradeDb.createObjectStore('restaurantData', {keyPath: 'id'});
//           case 1: upgradeDb.createObjectStore('reviewData',     {keypath: 'id'}).createIndex('restaurant_id', 'restaurant_id');
//           case 2: upgradeDb.createObjectStore('updateData',     {keyPath: 'id', autoIncrement: true});
//         }
//       });
//     }
//   });
// });
