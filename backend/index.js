const express = require("express")
const webPush = require("web-push")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express();

app.use(bodyParser.json())
app.use(cors())

//WEBPUSH KEYS

const publicVapidKey = 'BHV8oc8MiG_wBviBREanxjZEPLlzAg7wgYq43as1dBhbr49gUiGuSlhfGJwMghTn7JKsO-XwrIvsLbifMhOT1k4';
const privateVapidKey = 'VKm-1Lqk2BsF53WUKa7ExhugzaWtJlViYSWBzva_9QQ';

webPush.setVapidDetails('http://mysite.com/contact', publicVapidKey,privateVapidKey);



app.get('/',(req,res) =>{
    res.send("Push Notification Server!")
})

//SUBSCRIBTION ROUTE
app.post('/subscribe',(req,res) =>{

    // get subscription object
    const subscription = req.body;

    res.status(201).json({})

    const payload = JSON.stringify({title: "Express Push", description: "Express Push Notification with WebPush"})

    webPush.sendNotification(subscription,payload).catch(err => console.error(err))
})


app.listen(3000 ,() => console.log('Express Push Notification Server Listening at http://localhost:3000'))