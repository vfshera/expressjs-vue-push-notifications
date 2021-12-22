
workbox.setConfig({
  debug: true
})


//PREFIX TO CACHE NAME
workbox.core.setCacheNameDetails({prefix: "pwatest"});


//LISTEN TO MESSAGE FROM UPDATE BANNER ie UpdateBanner.vue
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});




//PUSH NOTIFICATION LISTENER
let click_open_url;

self.addEventListener("push", function(event){

  //GETS NOTIFICATION PAYLOAD IN JSON
  let push_message = event.data.json();


  //CAN COME FROM SERVER ie link to blog or product
  click_open_url = "https://vuejs.org";

  const options = {
    body: push_message.description,
    icon: './img/logo.82b9c7a5.png',
    image: './img/banner.jpg',
    vibrate: [200,100,200,100,200,100,200],
    tag: "vibration-sample"
   };

   //showNotification(<NOTIFICATION TITLE>,options)
   event.waitUntil(self.registration.showNotification(push_message.title,options));

});


// WHEN NOTIFICATION IS CLICKED
self.addEventListener("notificationclick",function(event){
  const clickedNotification = event.notification;

  clickedNotification.close();

  if(click_open_url){
    const promiseChain = clients.openWindow(click_open_url);
    
    event.waitUntil(promiseChain);
  }
});





//CACHING FONTS
workbox.routing.registerRoute(
  new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
  new workbox.strategies.CacheFirst({
    cacheName: "googleapis",
    plugins:[
      new workbox.expiration.Plugin({
        maxEntries: 30
      })
    ],
    method: "GET",
    cachableResponse:{ statuses: [0,200]}
  })
)



