"use strict";

const weatherBlock = document.querySelector('#weather');
const cityInput = document.querySelector('#cityInput');
const searchButton = document.querySelector('#searchButton');


const API_KEY = '2b6ad0cb2ee0ed2988dee6de85359413';


async function loadWeather(cityName) {
    if (!cityName) {
        weatherBlock.innerHTML = `<p class="weather__error">Введіть назву міста для пошуку.</p>`;
        return;
    }

    weatherBlock.innerHTML = `
        <div class="weather__loading">
            <img src="img/loading.gif" alt="Завантаження...">
        </div>`;

    const server = 'https://api.openweathermap.org/data/2.5/weather?';
    
    const url = `${server}q=${cityName}&appid=${API_KEY}&units=metric&lang=uk`;

    try {
        let response = await fetch(url, { method: 'GET' });
        let responseResult = await response.json();

        if (response.ok) {
            displayWeather(responseResult);
        } else {
            weatherBlock.innerHTML = `<p class="weather__error">Помилка: Місто "${cityName}" не знайдено.</p>`;
        }
    } catch (e) {
        weatherBlock.innerHTML = `<p class="weather__error">Помилка мережі. Спробуйте пізніше.</p>`;
    }
}


function displayWeather(data) {
    const location = data.name;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    
    const status = data.weather[0].description; 
    const icon = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    const template = `
        <div class="weather__header">
            <div class="weather__main">
                <div class="weather__city">${location}</div>
                <div class="weather__status">${statusText}</div>
            </div>
        </div>
        <div class="weather__icon">
            <img src="${iconUrl}" alt="${status}">
        </div>
        <div class="weather__temp">${temp}°C</div>
        <div class="weather__feels-like">Feels like: ${feelsLike}°C</div>
    `;

    weatherBlock.innerHTML = template;
}


searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    loadWeather(cityName);
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityName = cityInput.value.trim();
        loadWeather(cityName);
    }
});

if (weatherBlock && cityInput) {
    loadWeather(cityInput.value.trim()); 
}