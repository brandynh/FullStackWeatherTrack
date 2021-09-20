const nearbyButtonEl = document.getElementById('nearMeBtn');
const trackButtonEl = document.getElementById('trackBtn');
const todayTempEl = document.getElementById('todayTemp');
const todayHumidityEl = document.getElementById('todayHumidity');
const todayWindSpeedEl = document.getElementById('todayWindSpeed');
const todayUVEl = document.getElementById('todayUV');
const cityInputEl = document.getElementById('city');
const cityFormEl = document.getElementById('city-form');
const searchCardEl = document.getElementById('searchCard');
const myWeatherKey = "4f5d3556a1b8d12b4e6fd29d3701426e"

var nearLat;
var nearLon;

var userCityLat;
var userCityLon;

nearbyButtonEl.addEventListener('click', getNearbyWeatherInfo);
trackButtonEl.addEventListener('click', getWeatherByCity);


function getNearbyWeatherInfo() {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    //The function displays the Lat and Longitude for users position
    function showPosition(position) {
        nearLat = position.coords.latitude;
        nearLon = position.coords.longitude;
        console.log("Latitude: " + position.coords.latitude +
            " Longitude: " + position.coords.longitude);
        console.log("I've got your position!");
        nearMeWeather();

    }

    // Prompts user to allow or deny location access if allowed reveals nearby button 
    navigator.geolocation.watchPosition(function (position) {
        getLocation();
        nearbyButtonEl.classList.remove('hide');
    },

        // If permission denied hides nearby button
        function (error) {
            if (error.code == error.PERMISSION_DENIED)
                nearbyButtonEl.classList.add('hide');
            console.log("you denied location access");
        });

    function nearMeWeather() {
        var nearWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + nearLat + '&lon=' + nearLon + '&units=metric&appid=' + myWeatherKey;

        fetch(nearWeatherUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        displayTodaysWeather(data);

                        for (var i = 0; i < data.daily.length; i++) {
                            console.log(Math.round(data.daily[i].temp.day * 1.8 + 32));
                        }
                        console.log(data)
                    });

                } else {
                    alert('Error: ' + response.statusText);
                }
            }).catch(function (error) {
                alert('Error');
            });

    }

    function displayTodaysWeather(data) {
        todayTempEl.textContent = "Temperature: " + (Math.round(data.current.temp * 1.8 + 32));
        todayHumidityEl.textContent = "Humidity: " + (data.current.humidity) + "%";
        todayWindSpeedEl.textContent = "Wind Speed: " + (data.current.wind_speed) + "mph";
        todayUVEl.textContent = "UV Index: " + (data.current.uvi);
    }

}

function getWeatherByCity(event) {
    event.preventDefault();

    var userCity = cityInputEl.value.trim();
    console.log("User Input= " + userCity);
    if (userCity) {
        console.log(userCity);
        byCityWeather();
        userPreviousCity(userCity);

    } else {
        alert('Please enter a city');
    }



    function byCityWeather() {
        var userCityUrl1 = 'https://api.openweathermap.org/data/2.5/weather?q=' + userCity + '&units=metric&appid=' + myWeatherKey;

        fetch(userCityUrl1)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        displayTodaysCityWeather(data);
                        userCityLat = data.coord.lat;
                        userCityLon = data.coord.lon;

                        var userCityUrl2 = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + userCityLat + '&lon=' + userCityLon + '&appid=' + myWeatherKey;

                        fetch(userCityUrl2)
                            .then(function (response) {
                                if (response.ok) {
                                    response.json().then(function (data) {
                                        displayTodaysUVI(data);
                                        console.log(userCityLat);
                                        console.log(userCityLon);

                                    });

                                } else {
                                    alert('Error: ' + response.statusText);
                                }
                            }).catch(function (error) {
                                alert('Error');
                            });
                    });

                } else {
                    alert('Error: ' + response.statusText);
                }
            }).catch(function (error) {
                alert('Error');
            });


    }
    function displayTodaysCityWeather(data) {
        todayTempEl.textContent = "Temperature: " + (Math.round(data.main.temp * 1.8 + 32));
        todayHumidityEl.textContent = "Humidity: " + (data.main.humidity) + "%";
        todayWindSpeedEl.textContent = "Wind Speed: " + (data.wind.speed) + "mph";
    }

    function displayTodaysUVI(data) {
        todayUVEl.textContent = "UV Index: " + (data.current.uvi);
    }

    function userPreviousCity(userCity) {
        var createDiv = document.createElement('div');
        var createChipClass = document.createAttribute('class');
        var createId = document.createAttribute('id');
        var createBr = document.createElement('br');

        createChipClass.value = "chip";
        createId.value = "historyChip";
        createDiv.setAttributeNode(createChipClass);
        createDiv.setAttributeNode(createId);
        createDiv.innerText = userCity;

        if(searchCardEl.lastChild.innerText !== userCity ) {
        
        searchCardEl.appendChild(createBr);
        searchCardEl.appendChild(createDiv);
    }

    }
}

