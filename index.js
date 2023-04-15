async function getWeather() {
    const apiKey = "95914d617163c9b2273af399f26007f0";
    const cityName = document.getElementById('search').value;
    const url1 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    var location = await fetch(url1).then(result => result.json());
    var lon = location[0].lon;
    var lat = location[0].lat;
    var url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    var location = await fetch(url2).then(result => result.json());
    console.log(location.list[0].main.temp);
    console.log(location.list[0].wind.speed);
    console.log(location.list[0].main.humidity);
    document.getElementById("cityName").innerHTML = cityName.list. + ":";
    document.getElementById("temp").innerHTML = location.list[0].main.temp + " Kelvin";
    document.getElementById("wind").innerHTML = location.list[0].wind.speed + " MPH";
    document.getElementById("humidity").innerHTML = location.list[0].main.humidity + "% Humidity";
}


