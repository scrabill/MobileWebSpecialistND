class DBHelper{static get DATABASE_URL(){return"http://localhost:1337"}static fetchRestaurants(e){fetch(`${DBHelper.DATABASE_URL}/restaurants`).then(function(e){if(e.ok)return e.json();throw new Error("Fetch repsponse Error")}).then(function(t){e(null,t)}).catch(function(t){console.log("In fetchRestaurants catch, error:",t.message),idb.open("restaurantReviews",1).then(e=>e.transaction("restaurantData").objectStore("restaurantData").getAll()).then(t=>{e(null,t)})})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((r,a)=>{if(r)n(r,null);else{let r=a;"all"!=e&&(r=r.filter(t=>t.cuisine_type==e)),"all"!=t&&(r=r.filter(e=>e.neighborhood==t)),n(null,r)}})}static fetchReviewsByRestaurantID(e){return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${e}`).then(e=>e.ok?e.json():Promise.reject("Fetching reviews by ID failed.")).then(e=>(console.log(e),e)).catch(e=>(console.log(`Error in fetch reviews by ID: ${e}`),null))}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}`}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}}