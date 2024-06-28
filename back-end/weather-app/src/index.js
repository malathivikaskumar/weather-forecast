const express = require('express');
const fetch = require("node-fetch");
const cors = require('cors');
const moment = require('moment');

const app = express();
app.use(cors());

app.listen(8000, function(err){
  if(err){
    console.log("Application Unable to start");
  } else {
    console.log("Application started on port 8000");
  }
});

app.get("/weather/:city" , function(req, res){
    let city = req.params.city;
    console.log("requested city: " + city);
    getWeatherData(city).then((data) => {
      if(data.list && data.list.length>0){
        filterWeatherData(data);
      }
      res.send(data);
    })
    .catch((error) => {
        console.error(error);
        res.send(error);
    });
});

async function getWeatherData(city) {
  // api key removed as git hub restrictions 
    const apiKey = "<api-key>";
    const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}&cnt=40`;
    try {
      const response = await fetch(weatherURL);
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.log("Error fetching weather data:", error);
      throw error;
    }
  }


  function filterWeatherData(data) {
    let list1 = [];
    let i = 0;

    let dateTime = String(data.list[0].dt_txt).split(" ");
    let date = moment(dateTime[0]);
    let time = dateTime[1];
    
    list1[i++] = updateDate(data.list[0]);
    for (weather of data.list) {
      let latestDateTime = String(weather.dt_txt).split(" ");
      let latestDate = moment(latestDateTime[0]);
      let nextTime = latestDateTime[1];
      if (latestDate.isAfter(date) && time == nextTime) {
        list1[i++] = updateDate(weather);;
        date = latestDate;
      }
    };

    if (list1.length < 5) {
      console.log("came");
      list1[i++] = updateDate(data.list[data.list.length - 1]);;
    }
    data.list = list1;
  }

  function updateDate(weather) {
    weather.dt_txt = moment(weather.dt_txt).format("ddd, MMMM DD, yyyy");
    return weather;
  }
