document.addEventListener("DOMContentLoaded", async () => {
  const city = "paris";
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
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
    ).then((response) => response.json());

    
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
        console.log(response, "response");
        const date = new Date(response.list[i].dt_txt.toString());
        const options = { hour: "numeric", minute: "2-digit", hour12: true };
        const dateFormated = date.toLocaleTimeString("en-US", options);
        console.log(dateFormated, "dateFormated");
        console.log(response.list[i].dt_txt, "really date");

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

  const getWeather = async () => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0e1cc6e24661f917b43a7d4c41bbe50b&units=metric&`
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

  // const date = new Date("2023-02-10 00:00:00");
  // const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  // const dateFormated = (date.toLocaleTimeString('en-US', options));
  getWeather();
  getHourlyForecast();
});
