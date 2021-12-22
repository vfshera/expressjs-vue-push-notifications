const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = require("./database");
app.use(bodyParser.json());
app.use(cors());

//WEBPUSH KEYS

const publicVapidKey =
  "BHV8oc8MiG_wBviBREanxjZEPLlzAg7wgYq43as1dBhbr49gUiGuSlhfGJwMghTn7JKsO-XwrIvsLbifMhOT1k4";
const privateVapidKey = "VKm-1Lqk2BsF53WUKa7ExhugzaWtJlViYSWBzva_9QQ";

webPush.setVapidDetails(
  "http://mysite.com/contact",
  publicVapidKey,
  privateVapidKey
);

app.get("/", (req, res) => {
  res.send("Push Notification Server!");
});

//SUBSCRIBTION ROUTE
app.post("/subscribe", (req, res) => {
  // get subscription object
  const subscription = req.body;

  params = [JSON.stringify(subscription)];

  let sql = "INSERT INTO subscribers (user) VALUES (?)";

  db.run(sql, params, (result, err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
  });

  res.status(201).json("Thanks for Subscribing");

});

//NOTIFY SIMULATION ROUTE
app.post("/notify", (req, res) => {
  
  let sql = "SELECT * FROM subscribers";
  let params = [];


  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    notify(rows);

    res.status(200).json({ message: "Preparing Notifications!" });
  });

  
});

function notify(subscribers) {
  console.log(`Sending Notifications to ${subscribers.length} Subscribers`);

  subscribers.forEach((sub) => {

    subscription = JSON.parse(sub.user);

    const payload = JSON.stringify({
      title: `Express Push Notification ${sub.id}`,
      description: "Push notifications from Database",
    });

    webPush
      .sendNotification(subscription, payload)
      .catch((err) => console.error(err));

    console.log(`User ${sub.id} Notified!`);
  });
}

app.listen(3000, () =>
  console.log(
    "Express Push Notification Server Listening at http://localhost:3000"
  )
);
