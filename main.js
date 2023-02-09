document.addEventListener("DOMContentLoaded", async () => {
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

  let feelsLike = document.getElementById("feels-like-h3");
  let humidity = document.getElementById("humidity-h3");

  const getHourlyForecast = async () => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=kochi&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
    ).then((response) => response.json());

    for (let i = 0; i < 10; i++) {
      if (i === 0) {
        let hourlyInnerHtml = `
              <section>
                    <h4 ">Now</h4>
                    <img src=http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png>
                    <p>${response.list[i].main.temp}</p>
                  </section>
              `;
        insideHourlyForecast.innerHTML += hourlyInnerHtml;
      } else {
        let hourlyInnerHtml = `
              <section>
                    <h4 ">${response.list[i].dt_txt}</h4>
                    <img src=http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png>
                    <p>${response.list[i].main.temp}</p>
                  </section>
              `;
        insideHourlyForecast.innerHTML += hourlyInnerHtml;
      }
    }
  };

  const getWeather = async () => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=kochi&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
    ).then((response) => response.json());
    console.log(response);

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

  getWeather();
  getHourlyForecast();
});
