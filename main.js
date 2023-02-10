API_KEY = "0e1cc6e24661f917b43a7d4c41bbe50b";
const cityUserInput = "kochi";

let selectedCityText;
let selectedCity;

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

const getForecast = async ({ lat, lon, name: city }) => {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    // `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
  ).then((response) => response.json());
  return response;
};

const getCurrentWeatherData = async ({ lat, lon, name: city }) => {
  
  const url =  `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${API_KEY}&units=metric`
  const response = await fetch(url);

  return response.json();
};

const getHourlyForecast = async (response) => {
  insideHourlyForecast.innerHTML = "";
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
  insideFiveDayForecast.innerHTML = "";
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

const getWeather = async (responses) => {
  // let response = await fetch(
  //   `https://api.openweathermap.org/data/2.5/weather?q=${responses}&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
  // ).then((response) => response.json());

  let {
    name,
    main: { temp },
    main,
    weather: [{ description }],
  } = responses;

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

  if (!value) {
    selectedCity = null;
    selectedCityText = "";
  }

  if (value && selectedCityText !== value) {
    let listOfCites = await getGeoCities(value);
    let options = "";

    for (let { lat, lon, name, state, country } of listOfCites) {
      options += `<option data-city-details='${JSON.stringify({
        lat,
        lon,
        name,
      })}' value="${name}, ${state}, ${country}"></option>`;
    }
    document.querySelector("#cities").innerHTML = options;
  }
};

const handleCitySelection = (event) => {
  selectedCityText = event.target.value;
  let options = document.querySelectorAll("#cities > option");
  if (options?.length) {
    let selectedOption = Array.from(options).find(
      (opt) => opt.value === selectedCityText
    );
    selectedCity = JSON.parse(selectedOption.getAttribute("data-city-details"));
    console.log(selectedCity, "selectedCity: ");
    loadData();
  }
};
const loadForecastUsingGeoLocation = () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude: lat, longitude: lon } = coords;
      selectedCity = { lat, lon, name: "kochi" };
      // console.log(selectedCity, "selectedCity");
      loadData();
    },
    (error) => console.log(error)
  );
};

const loadData = async () => {
  console.log(selectedCity, "inload data");
  let response = await getCurrentWeatherData(selectedCity);
  let hourlyForestResponse = await getForecast(selectedCity);
  console.log(response, "response");
  console.log(hourlyForestResponse, "hourlyrespone");
  getWeather(response);
  getHourlyForecast(hourlyForestResponse);
  getFiveDayForecast(hourlyForestResponse);
};

const debounceSearch = debounce((event) => onSearchChange(event));

document.addEventListener("DOMContentLoaded", async () => {
  searchInput.addEventListener("input", debounceSearch);
  searchInput.addEventListener("change", handleCitySelection);
  // const response = await getForecast("kochi");
  // getWeather("kochi");
  // getHourlyForecast(response);
  // getFiveDayForecast(response);
  loadData();
  loadForecastUsingGeoLocation()
});
