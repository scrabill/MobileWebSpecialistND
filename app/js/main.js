
let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/*
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/*
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/*
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/*
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/*
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/*
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/*
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/*
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/*
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/*
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = `/img/${restaurant.id}@1x.webp`;
  image.srcset = `/img/${restaurant.id}@1x.webp 300w,
                  /img/${restaurant.id}@2x.webp 600w,
                  /img/${restaurant.id}@3x.webp 900w`;
  image.alt = `Image of ${restaurant.name} restaurant`;
  li.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  li.append(name);

  // Inserting favorite here
  const favButton = document.createElement('button');
  favButton.className = 'favButton';
  let isFavorite = (restaurant.is_favorite && restaurant.is_favorite.toString() === "true") ? true : false;
  console.log(`${restaurant.name}, ${restaurant.is_favorite}`);
  favButton.setAttribute('aria-pressed', isFavorite);
  favButton.setAttribute('aria-label', `Make ${restaurant.name} a favorite!`);
  favButton.innerHTML = isFavorite ? '&#9829;' : '&#9825;'; 
  favButton.onclick = event => favoriteClicked(restaurant, favButton);

  li.append(favButton);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

favoriteClicked = (restaurant, button) => {
  console.log(`Data: ${restaurant.name}, ${restaurant.is_favorite}, ${button}`);
  console.log(`favClicked. Entering state: ${button.getAttribute("aria-pressed")}`);
  //TODO: use background sync to sync data with API server
  let fav = (button.getAttribute("aria-pressed") && button.getAttribute("aria-pressed") === "true") ? true : false;
  return fetch(`${DBHelper.DATABASE_URL}/restaurants/${restaurant.id}/?is_favorite=${!fav}`, {method: 'PUT'})
    .then(response => {
      if(!response.ok) return Promise.reject("Favorite could not be updated.");
      return response.json();
    }).then(updatedRestaurant => {
      // TODO : Update restaurant on idb

      // change state of toggle button
      console.log(`Exiting state: ${!fav}`);
      button.setAttribute('aria-pressed', !fav);
      button.innerHTML = !fav ? '&#9829;' : '&#9825;'; 
      button.onclick = event => favoriteClicked(restaurant, button);
    });
}

/*
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
