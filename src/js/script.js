
import {
    getEstado,
    tempConverser,
    updateData,
    getCidade,
    getNameEstado,
    fetchAPI,
} from "./functions.js";

window.onload = function() {
    // show the states options and create a event that when the state selected changes, the city changes too.
    fetchAPI(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`).then(estados => {
    const estadosSelect = document.querySelector("#estados");
    estadosSelect.innerHTML = estados.map((estado) => {
        return `
        <option value='${estado.id}'>
        ${estado.nome}
        </option>
        `;
    }).join('');
    estadosSelect.addEventListener("change", () => {
        getEstado(estadosSelect)
    });
    getEstado(estadosSelect);
})
}

// Use the state and city to get and show data. The main function.
function takeAndShowWeatherCity() {
    const estadosSelect = document.querySelector("#estados");
    const cidadesSelect = document.querySelector("#cidades");
    const city = getCidade(cidadesSelect);
    const state = getNameEstado(estadosSelect);
    const cityElements = document.querySelectorAll(".city-name");
    const stateElements = document.querySelectorAll(".state-name");
    stateElements.forEach((element) => {
        element.innerHTML = state;
    })
    cityElements.forEach((element) => {
        element.innerHTML = city;
    })
    
    // Take the longitude and latitude of the city selected.
    fetchAPI(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=a8964c08f0867f5163d14200e7698d52`).then(response => { 
        response.every(function(local) {
            globalThis.lat = local.lat; 
            globalThis.lon = local.lon;
        })
        
        // Take the weather data from the city selected by using his longitude and latitude.
        fetchAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a8964c08f0867f5163d14200e7698d52`).then(response => {
            const weatherMain = response.weather[0].main;
            const weatherDesc = response.weather[0].description;
            const weatherIcon = response.weather[0].icon;

            // convert the temps to celsius.
            const temp = tempConverser(response.main.temp);
            const feels_like = tempConverser(response.main.feels_like);
            const tempMax = tempConverser(response.main.temp_max);
            const tempMin = tempConverser(response.main.temp_min);
            
            const humidity = response.main.humidity;
            const pressure = response.main.pressure;
            const visibility = response.visibility;
            const windSpeed = response.wind.speed;
            const windDeg = response.wind.deg;
            const clouds = response.clouds.all;

            const timezone = response.timezone;
            let sunrise = response.sys.sunrise;
            let sunset = response.sys.sunset;

            // Transform the soconds in hours.
            const sunriseHours = (new Date(sunrise*1000-(timezone)).getHours() + (new Date(sunrise*1000-(timezone)).getMinutes() / 60)).toFixed(2);
            const sunsetHours = (new Date(sunset*1000-(timezone)).getHours() + (new Date(sunset*1000-(timezone)).getMinutes() / 60)).toFixed(2);

            sunrise = new Date(sunrise*1000-(timezone)).toLocaleTimeString();
            sunset = new Date(sunset*1000-(timezone)).toLocaleTimeString();

            // Update the HTML with new data.
            updateData(temp, ".temp");
            updateData(weatherDesc, ".weather");
            updateData(sunrise, ".sunrise");
            updateData(sunset, ".sunset");
            updateData(feels_like, ".feels-like");
            updateData(humidity+"%", ".humidity");
            updateData(pressure+" hPa", ".pressure");
            updateData(clouds+"%", ".clouds");
            updateData(windSpeed+" m/s", ".wind-speed");
            updateData(windDeg+"°", ".wind-deg");
            updateData(visibility+"m", ".visibility");

            const nowHours = (new Date().getHours() + (new Date().getMinutes() / 60)).toFixed(2); 
            const weatherConditions = document.querySelector(".weather-conditions");
            const body = document.getElementById("body");

            // Changes the background color depending if is night or day.
            if (nowHours > sunsetHours || nowHours < sunriseHours) {
                weatherConditions.classList.add("bg-night");
                weatherConditions.classList.remove("bg-day");
                body.classList.add("bg-night");
                body.classList.remove("bg-day");

            } else {
                weatherConditions.classList.add("bg-day");
                weatherConditions.classList.remove("bg-night");
                body.classList.add("bg-day");
                body.classList.remove("bg-night");
            }

            const weatherIconElement = document.querySelector(".weather-icon");
            weatherIconElement.src = `icons/${weatherIcon}.png`; 
        })
    })
}

// When the submit button is clicked, the main functions is called.
const btnSubmit = document.querySelector(".btn-send");
btnSubmit.addEventListener("click", () => {
    takeAndShowWeatherCity();
})