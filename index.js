const apiKey = "95914d617163c9b2273af399f26007f0";


//sets up local storage for first use
if(!localStorage.getItem("cities")) {
//sets local storage items into array
    localStorage.setItem("cities", JSON.stringify([]))
}
createButtons();

function createButtons() {
    const list = document.getElementById("cityList");
    //clears list to prevent duplicates
    list.innerHTML = "";
    //grabs cities from local storage if any
    let cityArray = JSON.parse(localStorage.getItem("cities"));
    cityArray.forEach(city => {
        list.innerHTML += `
        <div class="cityButton">
            <button onclick="getWeather('${city}')">${city}</button>
        </div>
        `
    })
} 

function clearCities() {
    localStorage.setItem("cities", JSON.stringify([]))
    document.getElementById("current").innerHTML = "";
    document.getElementById("fiveDays").innerHTML = "";
    createButtons()
}

function storeCity(city) {
    let cityArray = JSON.parse(localStorage.getItem("cities"));

    if(!cityArray.includes(city)) {
        cityArray.push(city);
    }
    localStorage.setItem("cities", JSON.stringify(cityArray))
    createButtons()
}


//pull city Coordinates
async function getWeather(cityName) {
    const cityCoordinates = await getCoordinates(cityName);
    getCurrent(cityCoordinates);
    getForecast(cityCoordinates);
}

async function getCoordinates(cityName) {
    var lon;
    var lat;
    //takes the city name but if there is none then it takes it from the search bar
    let city = cityName || document.getElementById("city").value;
    document.getElementById("city").value = "";
    const url1 = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    await fetch(url1)
        .then(result => result.json())
        .then(data => {
            storeCity(data[0].name)
            lat = data[0].lat
            lon = data[0].lon
        });
    return [lat, lon]
}

//destructuring array of getCurrent lat and lon
function getCurrent([lat, lon]) {
    var url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(url2)
        .then(res => res.json())
        .then(data => {
            let name = data.name;
            let date = new Date().toLocaleDateString()
            let temp = data.main.temp;
            let wind = data.wind.speed;
            let humidity = data.main.humidity;
            let icon = data.weather[0].icon;
            document.getElementById("current").innerHTML = `
                <div id="border">
                    <h2>${name} ${date} <img src="http://openweathermap.org/img/wn/${icon}@2x.png"></h2>
                    <p>Temp: ${temp} °F</p>
                    <p>Wind: ${wind} MPH</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
                <h3>5-Day Forecast:</h3>
            `
        }) 
}

function getForecast([lat, lon]) {
    let windSpeed;
    let temperature;
    let humidity;
    let icon;
    let dateText;
    document.getElementById("fiveDays").innerHTML = "";

    var url3 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(url3)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            //8 for every 3hours to equal 24 hours for a day
            for(let i = 2; i <= 34; i+= 8) {
                windSpeed = data.list[i].wind.speed;
                temperature = data.list[i].main.temp;
                humidity = data.list[i].main.humidity;
                icon = data.list[i].weather[0].icon;
                dateText = data.list[i]["dt_txt"];
                document.getElementById("fiveDays").innerHTML += `
                <section class="card">
                    <div class="date">${new Date(dateText).toLocaleDateString()}</div>
                        <img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png">
                        <p class="temp">Temp: ${temperature} °F</p>
                        <p class="wind">Wind: ${windSpeed} MPH</p>
                        <p class="humidity">Humidity: ${humidity} %</p>
                    </div>
                `;
            }
        });
}




    // const cityName = document.getElementById('search').value;
    // const url1 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    // var location = await fetch(url1).then(result => result.json());
    // var lon = location[0].lon;
    // var lat = location[0].lat;
    // var url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    // var location = await fetch(url2).then(result => result.json());
    // console.log(location.list[0].main.temp);
    // console.log(location.list[0].wind.speed);
    // console.log(location.list[0].main.humidity);
    // document.getElementById("cityName").innerHTML = cityName.list + ":";
    // //need to add fahrenheit later
    // document.getElementById("temp").innerHTML = location.list[0].main.temp + " Kelvin";
    // document.getElementById("wind").innerHTML = location.list[0].wind.speed + " MPH";
    // document.getElementById("humidity").innerHTML = location.list[0].main.humidity + "% Humidity";



//create array for checking local storage and making them into buttons
//erase parts of array using a clear function
//