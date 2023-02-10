const cityUserInput = "kochi";
let cityName = document.getElementById("city-name");
let mainTemp = document.getElementById("temp-main");
let descriptionMain = document.getElementById("description-main");

let high = document.getElementById("high");
let low = document.getElementById("low");

let timeHourly = document.getElementById("time-hourly");
let iconHourly = document.getElementById("icon-hourly");
let tempHourly = document.getElementById("temp-hourly");
let insideHourlyForecast = document.getElementById(
  "inside-hourly-forecast-div-id"
);

let insideFiveDayForecast = document.querySelector(".inside-five-day-forecast");

let dataListCity = document.getElementById("cities");
let searchInput = document.querySelector("#input-cites");

let feelsLike = document.getElementById("feels-like-h3");
let humidity = document.getElementById("humidity-h3");

const getForecast = async (city) => {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
  ).then((response) => response.json());
  return response;
};

const getHourlyForecast = async (response) => {
  for (let i = 1; i < 10; i++) {
    if (i === 1) {
      let hourlyInnerHtml = `
              <section>
                    <h4 ">Now</h4>
                    <img src=http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png>
                    <p>${response.list[i].main.temp}</p>
                  </section>
              `;
      insideHourlyForecast.innerHTML += hourlyInnerHtml;
    } else {
      const date = new Date(response.list[i].dt_txt.toString());
      const options = { hour: "numeric", minute: "2-digit", hour12: true };
      const dateFormated = date.toLocaleTimeString("en-US", options);

      let hourlyInnerHtml = `
              <section>
                    <h4 ">${dateFormated}</h4>
                    <img src=http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png>
                    <p>${response.list[i].main.temp}</p>
                  </section>
              `;
      insideHourlyForecast.innerHTML += hourlyInnerHtml;
    }
  }
};

const getFiveDayForecast = (response) => {
  for (let i = 1; i <= response.list.length; i += 8) {
    const dateString = response.list[i].dt_txt.toString();
    const date = new Date(dateString);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = daysOfWeek[date.getUTCDay()];

    if (i === 1) {
      let dailyForecast = `
              <section>
                    <h4 ">Today</h4>
                    <img src=http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png>
                    <p>${response.list[i].main.temp}</p>
                  </section>
              `;
      insideFiveDayForecast.innerHTML += dailyForecast;
    } else {
      let dailyForecast = `
              <section>
                    <h4 ">${dayName}</h4>
                    <img src=http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png>
                    <p>${response.list[i].main.temp}</p>
                  </section>
              `;
      insideFiveDayForecast.innerHTML += dailyForecast;
    }
  }
};

const getWeather = async () => {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityUserInput}&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
  ).then((response) => response.json());

  let {
    name,
    main: { temp },
    main,
    weather: [{ description }],
  } = response;

  cityName.textContent = name;
  mainTemp.textContent = temp;
  descriptionMain.textContent = description;
  high.textContent = `H: ${main.temp_max}`;
  low.textContent = `L: ${main.temp_min}`;

  feelsLike.textContent = `${main.feels_like} degrees`;
  humidity.textContent = `${main.humidity}%`;
};

const getGeoCities = async (searchTextCity) => {
  let city = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchTextCity}&limit=5&appid=0e1cc6e24661f917b43a7d4c41bbe50b`
  );
  return city.json();
  // console.log(city, "city")
  // let options = "";
  // console.log(city, "city name");
  // for (let { lat, lon, name, state, country } of city) {
  //   console.log(state, country);
  //   options += `<option value=${country}></option>`;
  //   dataListCity.innerHTML = options;
  // }
};

function debounce(func) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 500);
  };
}
const onSearchChange = async (event) => {
  let { value } = event.target;
  let listOfCites = await getGeoCities(value);
  console.log(listOfCites);
  let options = "";
  console.log(cityUserInput, "city name");

  for (let { lat, lon, name, state, country } of listOfCites) {
    options += `<option data-city-details='${JSON.stringify({
      lat,
      lon,
      name,
    })}' value="${name}, ${state}, ${country}"></option>`;
  }
  document.querySelector("#cities").innerHTML = options;
};

const debounceSearch = debounce((event) => onSearchChange(event));

document.addEventListener("DOMContentLoaded", async () => {
  searchInput.addEventListener("input", debounceSearch);
  const response = await getForecast("kochi");
  getWeather("kochi");
  getHourlyForecast(response);
  getFiveDayForecast(response);
});
