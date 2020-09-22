/* eslint-disable no-undef */
$(function() { 
    var locaton =  getLocation();
  });
  var mainCard = $("#weatherRow");
  var searchHistory = [];

  var getItems = function () {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
      searchHistory = storedCities;
      for(var i=0;i<searchHistory.length;i++) {
          if(i==8){
              break;
          }
        //  creates links/buttons https://getbootstrap.com/docs/4.0/components/list-group/
        cityListButton = $("<a>").attr({
          class: "list-group-item list-group-item-action",
          href: "#",
          "data-btn-num": i
        });
          // appends history as a button below the search field
          cityListButton.text(searchHistory[i]);
          $(".list-group").append(cityListButton);      
      }
    }
  };


  function getData(city) {
    var isError=false;
        mainCard.empty();
    $("#weeklyForecast").empty();
    if(!city){
        return;
    }
  var weatherQueryApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=bb777764badc46ea953835d44e32dc53";
  fetch(weatherQueryApiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        if(response.cod !== 200){
            alert("City Not Found!");
            $("#city").val("");
            isError=true;
            getLocation();
            return;
        }
        if(!isError){
            saveNewCity(city);
        }
    
        var newCurrentWeatherCard = $("<div>").attr("class","card mr-4");

        mainCard.append(newCurrentWeatherCard);

      var date = moment().format(" MM/DD/YYYY");
      var wIcon = response.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + wIcon + ".png";
      var cardHeader = $("<header>").attr("class","card-header");
      var cityName = $("<p>").attr("class","card-header-title").html(city + date);
      console.log(cityName);
      cityName.append($("<img>").attr("src", iconUrl));

      cardHeader.append(cityName);
      var cardContent = $("<div>").attr("class","card-content");
      var cardBody = $("<div>").attr("class","content");

      newCurrentWeatherCard.prepend(cardHeader);
      cardContent.append(cardBody);
      newCurrentWeatherCard.append(cardContent);
      

      var temp = Math.ceil(response.main.temp);
      cardBody.append($("<p>").attr("class","mx-4 my-4").html("Temperature: <strong>" + temp + " &#8457" +"</strong>"));
      var feelsLikeTemp = Math.ceil(response.main.feels_like);
      cardBody.append($("<p>").attr("class","mx-4 my-4").html("Feels Like: <strong>" + feelsLikeTemp + " &#8457" +"</strong>"));
      var humidity = response.main.humidity + "&#37;";
      cardBody.append($("<p>").attr("class","mx-4 my-4").html("Humidity: <strong>" + humidity +"</strong>" ));
      var windSpeed = response.wind.speed;
      cardBody.append($("<p>").attr("class","mx-4 my-4").html("Wind Speed: <strong>" + windSpeed + " MPH</strong"));

      /* Get UV Index from Weather API */
      var fullWeatherUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon +
        "&exclude=minutely,hourly&units=imperial&appid=bb777764badc46ea953835d44e32dc53";
      return fetch(fullWeatherUrl)
        .then(function (fullResponse) {
          return fullResponse.json();
        })
        .then(function (fullResponse) {
            cardBody.append(
            $("<p>").attr("class","mx-4 my-4").html(
              "UV Index: <span>" + fullResponse.current.uvi + "</span>"
            )
          );
          /* Set UV Priority Warning */
          if (fullResponse.current.uvi <= 2) {
            $("span").attr("class", "button is-success mb-4");
          } else if (
            fullResponse.current.uvi > 2 &&
            fullResponse.current.uvi <= 7
          ) {
            $("span").attr("class", "button is-warning mb-4");
          } else {
            $("span").attr("class", "button is-danger mb-4");
          }

          /* Get 5 Day Forecast From Weather API */
          for (var i = 1; i < 6; i++) {
              var newForcastCard =  $("<div>").attr("class","card mr-4");
              mainCard.append(newForcastCard);
              var cardFCHeader = $("<header>").attr("class","card-header");  
              var myDate = new Date(
                fullResponse.daily[i].dt * 1000
              ).toLocaleDateString("en-US");
              /* Display Date */ 
              var dateTitle = $("<p>").attr("class","card-header-title").html(myDate);
              var iconFCCode = fullResponse.daily[i].weather[0].icon;
              var iconFCURL =
                "http://openweathermap.org/img/w/" + iconFCCode + ".png";
              dateTitle.append($("<img>").attr("src", iconFCURL));
        
              cardFCHeader.append(dateTitle);
              var cardFCContent = $("<div>").attr("class","card-content");
              var cardFCBody = $("<div>").attr("class","content");
        
              newForcastCard.append(cardFCHeader);
                cardFCContent.append(cardFCBody);
              newForcastCard.append(cardFCContent);


              var temp = Math.ceil(fullResponse.daily[i].temp["day"]);
              cardFCBody.append($("<p>").attr("class","mx-4 my-4").html("Temperature: " + temp + " &#8457" )); 

              var humidity = fullResponse.daily[i].humidity;
              cardFCBody.append($("<p>").attr("class","mx-4 my-4").html("Humidity: " + humidity ));
                      
          }
        });
    });
}

/* Save City Name to LocalStorage */
var saveNewCity = function(city){
    var inArray = searchHistory.includes(city);
    if(!inArray && city !==""){
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var cityListButton = $("<a>").attr(
            {
                class:"list-group-item list-group-item-action",
                href: "#",
                "data-btn-num": searchHistory.length
            }
        );
        cityListButton.text(city);
        $(".list-group").append(cityListButton);

    }
};

getItems();

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
function showPosition(position) {
    fetch("https://geolocation-db.com/json/697de680-a737-11ea-9820-af05f4014d91")
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            getData(response.city);
            $("#city").val(response.city);
            saveNewCity(response.city);
        });
}
