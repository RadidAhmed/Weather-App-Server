const express = require("express");
const fetch = require("node-fetch");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.listen(process.env.PORT || 3001, () => console.log(`Listening on port ${process.env.PORT}`));

async function fetchWeatherData(lat, long) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=minutely,daily&appid=6f33289062cfa0d218f0648e984201fb`
  );
  const data = await response.json();
  let weather_data = [
    {
      sr: data.current.sunrise,
      ss: data.current.sunset,
      time: data.current.dt,
      timezone: data.timezone_offset,
      temp: Math.round(data.current.temp),
      uv_index: data.current.uvi,
      weather_main: data.current.weather[0].main,
      weather_id: data.current.weather[0].id,
      weather_desc: data.current.weather[0].description,
    },
  ];
  data.hourly.forEach((entry) => {
    weather_data.push({
      time: entry.dt,
      temp: Math.round(entry.temp),
      uv_index: entry.uvi,
      weather_main: entry.weather[0].main,
      weather_id: entry.weather[0].id,
      weather_desc: entry.weather[0].description,
    });
  });

  return weather_data;
}

app.post("/location", async (request, response) => {
  const coords = request.body;
  console.log(coords);
  const data = await fetchWeatherData(coords.lat, coords.long);
  response.json(data);
});