const nearbyButtonEl = document.getElementById('nearMeBtn');
const todayTempEl = document.getElementById('todayTemp');
const todayHumidityEl = document.getElementById('todayHumidity');
const todayWindSpeedEl = document.getElementById('todayWindSpeed');
const todayUVEl = document.getElementById('todayUV');
const myWeatherKey = "4f5d3556a1b8d12b4e6fd29d3701426e"

var nearLat;
var nearLon;

nearbyButtonEl.addEventListener('click', getNearbyWeatherInfo);

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



}

