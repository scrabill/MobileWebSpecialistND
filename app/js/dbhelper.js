/* 
 * Common database helper functions.
 */

class DBHelper {
 
  /* 
   * Database URL.
   * Change this to restaurants   location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}`;
  }

  /* 
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    // Fetch restaurant data from server
    fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then(function(response) {
        // If response returns ok, return json of restaurant data
        if (response.ok) return response.json();
        
        // If not returned, there is an error - or offline mode
        throw new Error("Fetch repsponse Error");
      })
      .then(function(restaurantData) {
        callback(null, restaurantData);
      })
      .catch(function(error) {
        console.log("In fetchRestaurants catch, error:", error.message);
        // Retrieve data from IndexedDB
        idb.open('restaurantReviews', 1)
          .then(db => {
            return db.transaction("restaurantData")
            .objectStore("restaurantData")
            .getAll();
        })
        .then(restaurantData => {
          callback(null,restaurantData);
        });
      });
    }

  /* 
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /*
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /*
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /*
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /*
   * Fetch reviews by restaurant ID
   */
  static fetchReviewsByRestaurantID(id) {
    return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${id}`).then(response => {
      if (!response.ok) return Promise.reject("Fetching reviews by ID failed.");
      return response.json();
    }).then(fetchedReviews => {
      // If fetch successful
      // TODO: store reviews on idb
      console.log(fetchedReviews);
      return fetchedReviews;
    }).catch(error => {
      // Error handling
      // TODO: try to get reviews from idb
      console.log(`Error in fetch reviews by ID: ${error}`);
      return null;
    });
  }

  /*
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null); 
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /*
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /*
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) { 
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /*
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /*
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
