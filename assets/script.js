// Global variables and api key

var searchButton = document.querySelector('.searchBtn');
var cityText = document.querySelector('#city-text');
var fiveDayForecast = document.querySelector('.forecast-5');
var cityWeather = document.querySelector('.city-weather');
let history = document.querySelector('.history');
var weatherSearch = document.querySelector('#weather-search');
const APIKey = '5292a248e8acdb206f3b3112df2113a7';

// this is the function to call the api and populate the div
function findCity(event) {
	event.preventDefault();
	clearData();
	var cityVal = cityText.value || event.target.innerText;
	cityText.value = '';

	// builds the api request root
	var queryURL =
		'https://api.openweathermap.org/data/2.5/weather?q=' +
		cityVal +
		'&appid=' +
		APIKey +
		'&units=imperial';

	// Calls API

	// Grabs response from API and converts it to JSON
	fetch(queryURL)
		.then(function (response) {
			return response.json();
		})
		//grabs specific data from the request body
		.then(function (data) {
			let lat = data.coord.lat;
			let long = data.coord.lon;
			let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${APIKey}&units=imperial`;
			let uvURL =
				'https://api.openweathermap.org/data/2.5/uvi?appid=' +
				APIKey +
				'&lat=' +
				lat +
				'&lon=' +
				long;

			// Same with the five day forecast
			fetch(forecastURL)
				.then((response) => {
					return response.json();
				})

				.then((forecastData) => {
					let index = [0, 8, 16, 24, 32];
					// for loop that iterates over our div to give the five day forecast
					for (x of index) {
						let date = document.createElement('h3');
						// Creates elements for the div in our index
						let icon = document.createElement('img');
						let humidity = document.createElement('p');
						let temp = document.createElement('p');
						let windSpeed = document.createElement('p');
						date.textContent = moment(forecastData.list[x].dt_txt).format(
							'MM/DD/YY'
						);
						// Grabs all of the extra data that was parsed
						icon.src =
							'https://openweathermap.org/img/wn/' +
							data.weather[0].icon +
							'@2x.png';
						temp.textContent = 'Temp: ' + forecastData.list[x].main.temp + ' F';
						windSpeed.textContent =
							'Wind: ' + forecastData.list[x].wind.speed + ' MPH';
						humidity.textContent =
							'Humidity: ' + forecastData.list[x].main.humidity + ' %';

						fiveDayForecast.append(date, icon, temp, windSpeed, humidity);
					}
				});

			// Grabs the request data and adds it to elements
			var cityCurrent = document.createElement('h2');
			var cityHumidity = document.createElement('p');
			var cityUV = document.createElement('p');
			var cityWind = document.createElement('p');
			var cityImage = document.createElement('img');
			var cityTemp = document.createElement('p');
			cityCurrent.textContent = data.name + ' ' + moment().format('MM/DD/YY');
			cityTemp.textContent = ' Temp: ' + data.main.temp + ' F ';
			cityWind.textContent = ' Wind: ' + data.wind.speed + ' MPH ';
			cityHumidity.textContent = ' Humidity: ' + data.main.humidity + ' % ';

			cityImage.src =
				'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';

			// Fetches UV data from the API and turns it into JSON. Also grabs styling
			fetch(uvURL)
				.then((response) => {
					return response.json();
				})
				.then((uvData) => {
					cityUV.textContent = 'UV: ' + uvData.value + ' %';
					if (uvData.vaue < 3) {
						cityUV.classList.add('UVGood');
					}
					if (uvData.value < 7) {
						cityUV.classList.remove('UVGood');
						cityUV.classList.add('UVMod');
					}
					if (uvData.value > 7) {
						cityCurrent.classList.remove('UVMod');
						cityUV.classList.add('UVBad');
					}
				});

			cityWeather.append(cityCurrent);
			cityWeather.append(cityTemp);
			cityWeather.append(cityWind);
			cityWeather.append(cityHumidity);
			cityWeather.append(cityUV);
			cityWeather.append(cityImage);
		});

	var historyBtn = document.createElement('button');
	historyBtn.textContent = cityVal;
	historyBtn.setAttribute('class', 'buttonEl btn-dark col-8 mt-1');
	history.append(historyBtn);
}

function clearData() {
	cityWeather.innerHTML = '';
	fiveDayForecast.innerHTML = '';
}

$(document).on('click', '.buttonEl', findCity);
searchButton.addEventListener('click', findCity);
