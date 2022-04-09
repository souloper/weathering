let express = require('express');
let app = express();

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
const fetch = require('node-fetch');




app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
app.use(express.static('public'));


app.get("/", (req, res) => {
    const sendData = {location: "Fetching..", country: "Country", temp: "Temp", desc: "Description", feel: "Feel-like", humidity: "Humidity", speed: "Speed", imageURL: "icon"};
    res.render("index", {sendData: sendData});
});


app.post("/", async (req, res) => {
    let location = await req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
    const response = await fetch(url);

    const weatherData = await response.json();

    //console.log(weatherData);
    
    const temp = Math.floor(weatherData.main.temp);
    const desc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imageURL =  `http://openweathermap.org/img/wn/${icon}@2x.png`;



    const sendData = {};
    sendData.temp = temp;
    sendData.desc = desc;
    sendData.location = location;
    sendData.feel = weatherData.main.feels_like;
    sendData.humidity = weatherData.main.humidity;
    sendData.speed = weatherData.wind.speed;
    sendData.country = weatherData.sys.country;
    //sendData.imageURL = weatherData.

    res.render('index', {sendData: sendData});

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});