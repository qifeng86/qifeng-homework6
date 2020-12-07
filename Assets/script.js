$("#searchButton").click(function () {
    //api key and query urls
    var apiKey = "1c8779bc071517ca5d4222a4475485d7";
    var city = document.getElementById("searchCity").value;
    var queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

    //storage input value to local storage and retrieve to create buttons
    localStorage.setItem("searchedcity", city);
    var retriveSearchedcities = localStorage.getItem("searchedcity");

    $("#searchHistory").append("<ul>" + "<button>" + retriveSearchedcities + "</button>" + "</ul>");

    // get temp, wind speed, humidity and weather icon from API and append to HTML under current weather container
    $.ajax({
        url: queryCurrentURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        $("#currentWeather").html(response.name);
        $('#currentDay').text(moment().format('l'));
        $("#weatherIcon").html("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='current weather.'>");
        $("#wind").text(response.wind.speed + " MPH");
        $("#humidity").text(response.main.humidity + "%");

        var currentTemp = (response.main.temp - 273.15) * 1.80 + 32;
        $("#temperature").text((currentTemp).toFixed(1) + " °F");

        //get uv index from API based on lat and lon
        var lon = response.coord.lon;
        var lat = response.coord.lon;
        var queryURLUv = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

        $.ajax({
            url: queryURLUv,
            method: "GET"
        }).then(function (response) {

            $("#uv").text(response.value);

        });

    });

    //get next 5 days from API and append to HTML under 5-day forecast cards
    $.ajax({
        url: queryForecastURL,
        method: "GET"
    }).then(function (response) {

        var days = [1, 9, 17, 25, 33];

        days.forEach(function (day) {

            var futureday = moment(response.list[day].dt_txt).format('l');
            var temp = (response.list[day].main.temp - 273.15) * 1.80 + 32;

            $("#futureday" + [day]).html(futureday);
            $("#futureweatherIcon" + [day]).html("<img src='https://openweathermap.org/img/w/" + response.list[day].weather[0].icon + ".png' alt='weather icon'>");
            $("#futuredayTemp" + [day]).text((temp).toFixed(1) + " °F");
            $("#futuredayHumidity" + [day]).text(response.list[day].main.humidity + "%");

        });


    });

});
