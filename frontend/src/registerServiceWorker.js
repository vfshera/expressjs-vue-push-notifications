/* eslint-disable no-console */

import { register } from "register-service-worker";

const publicVapidKey =
  "BHV8oc8MiG_wBviBREanxjZEPLlzAg7wgYq43as1dBhbr49gUiGuSlhfGJwMghTn7JKsO-XwrIvsLbifMhOT1k4";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(registration) {
      // if (!Notification.permission == "granted") {
        //IF PERMISSION NOT GRANTED
        //REQUEST PUSH NOTIFICATION PERMISSION
        Notification.requestPermission().then((status) => {
          if (status === "granted") {
            //IF PERMISSION GRANTED
            console.log("Notification Permission Granted!");

            //SUBSCRIBE TO NOTIFICATION
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
              })
              .then(
                (subscription) => {
                  //PUSH TO BACKEND
                  sendSubsciption(subscription);
                },
                (err) => console.log("Subscription Error : ", err)
              );
          }
        });
      // }
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      console.log("New content is available; please refresh.");

      //CUSTOM EVENT WHEN A NEW UPDATE IS AVAILABLE ie its handled in App.vue at created() hook

      document.dispatchEvent(
        new CustomEvent("serviceWorkerUpdateEvent", { detail: registration })
      );
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+") /* eslint-disable-line */
    .replace(/_/g, "/"); /* eslint-disable-line */

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubsciption(subscription) {
  fetch("http://localhost:3000/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => console.log("Post to Server Subscribe", res))
    .catch((err) => console.log("Sub Post Error", err));
}
