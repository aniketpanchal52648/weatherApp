import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import apiKeys from "../apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

const giveIcon=(des)=>{
  let Icon="";
  switch (des) {
    case "Haze":
      Icon="CLEAR_DAY";
      break;
    case "Clouds":
      Icon="CLOUDY";
      break;
    case "Rain":
      Icon="RAIN";
      break;
    case "Snow":
      Icon="SNOW";
      break;
    case "Dust":
       Icon="WIND";
      break;
    case "Drizzle":
      Icon="SLEET";
      break;
    case "Fog":
    case "Smoke":
      Icon="FOG";
      break;
    case "Tornado":
      Icon="WIND";
      break;
    default:
      Icon="CLEAR_DAY";
  }
  return Icon;

}
function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [icon,setIcon]=useState('');

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${
          city != "[object Object]" ? city : query
        }&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        console.log(response.data);
        setWeather(response.data);
        // console.log(response.data.weather[0].ma);
        setIcon(giveIcon(response.data.weather[0].main))
        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    search(query);
  }, []);

  return (
    <div className='forecast'>
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={!weather?props.icon:icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{!weather?props.weather:weather.weather[0].main}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            {" "}
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={search}
            />
          </div>
        </div>
        <ul>
          { weather ? (
            <div>
              {" "}
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Forcast;
