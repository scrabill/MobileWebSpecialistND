class DBHelper{static get DATABASE_URL(){return"http://localhost:1337"}static fetchRestaurants(e){fetch(`${DBHelper.DATABASE_URL}/restaurants`).then(function(e){if(e.ok)return e.json();throw new Error("Fetch repsponse Error")}).then(function(t){e(null,t)}).catch(function(t){console.log("In fetchRestaurants catch, error:",t.message),idb.open("restaurantReviews",1).then(e=>e.transaction("restaurantData").objectStore("restaurantData").getAll()).then(t=>{e(null,t)})})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.find(t=>t.id==e);r?t(null,r):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.cuisine_type==e);t(null,r)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.neighborhood==e);t(null,r)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,r){DBHelper.fetchRestaurants((n,a)=>{if(n)r(n,null);else{let n=a;"all"!=e&&(n=n.filter(t=>t.cuisine_type==e)),"all"!=t&&(n=n.filter(e=>e.neighborhood==t)),r(null,n)}})}static fetchReviewsByRestaurantID(e){return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${e}`).then(e=>e.ok?e.json():Promise.reject("Fetching reviews by IDfailed.")).then(e=>e).catch(e=>(console.log(`Error in fetch reviews by ID: ${e}`),null))}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,r)=>{if(t)e(t,null);else{const t=r.map((e,t)=>r[t].neighborhood),n=t.filter((e,r)=>t.indexOf(e)==r);e(null,n)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,r)=>{if(t)e(t,null);else{const t=r.map((e,t)=>r[t].cuisine_type),n=t.filter((e,r)=>t.indexOf(e)==r);e(null,n)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}`}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}}