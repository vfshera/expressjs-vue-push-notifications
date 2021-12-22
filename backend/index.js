const express = require("express");
const webPush = require("web-push");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = require("./database");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'))



// GENERATE VERPID KEYS ONCE WITH --> webpush.generateVAPIDKeys()


//WEBPUSH CONFIG
webPush.setVapidDetails(
  "http://mysite.com/contact",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get("/", (req, res) => {
  res.send("Push Notification Server!");
});

//SUBSCRIBTION ROUTE
app.post("/subscribe", (req, res) => {
  // get subscription object
  const subscription = req.body;

  //STORE TO DB AS STRING
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


  // NB:THIS CAN BE UTILIZED TO  RUN WHEN NEW BLOG OR PRODUCT IS POSTED 
    //FETCHING SUBSCRIBERS FROM DB
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



//HANDLES SENDING OF NOTIFICATIONS TO ALL SUBSCRIBERS
function notify(subscribers) {
  console.log(`Sending Notifications to ${subscribers.length} Subscribers`);


  //LOOPING THROUGH EACH SUBSCRIBER
  subscribers.forEach((sub) => {
    subscription = JSON.parse(sub.user);

    const payload = JSON.stringify({
      title: `Express Push Notification ${sub.id}`,
      description: "Push notifications from Database",
    });

    //SENDING NOTIFICATION
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
