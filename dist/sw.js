self.importScripts("js/dbhelper.js","js/idb.js");var myCache="restaurantReview_050",cacheFiles=["/index.html","/restaurant.html","/css/styles.css","/img/","/js/dbhelper.js","/js/main.js","/js/restaurant_info.js","/js/swregister.js","/js/idb.js"];self.addEventListener("install",function(e){console.log("In eventListener for install, event: ",e),e.waitUntil(caches.open(myCache).then(function(e){return e.addAll(cacheFiles).then(function(){console.log("Cache worked")}).catch(function(e){console.log("Caching failed, error: ",e)})}))}),self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(t){return t||fetch(e.request).then(function(t){return caches.open(myCache).then(function(n){return n.put(e.request,t.clone()),t})})}))}),self.addEventListener("activate",e=>{console.log("Event trigger - activate"),DBHelper.fetchRestaurants((e,t)=>{e?callback(e,null):idb.open("restaurantReviews",1,e=>{if(!e.objectStoreNames.contains("restaurantData")){let n=e.createObjectStore("restaurantData",{keyPath:"id"});console.log(t),t.map(e=>n.add(e))}})})});