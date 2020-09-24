/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$(function() {
    var localStorage = getTravelDetails();
    if (!destionationDetails || destionationDetails.length == 0) {
        var locaton = getLocation();
    } else {
        getData(destionationDetails[0]);
        getEventInfo(destionationDetails[0]);
    }
});
var mainCard = $("#weatherRow");
var destionationDetails = [];

var destinationCity;
var departureDate;
var arrivalDate;

// Events Global Variables
var ticketMasterKey = "i0lp5oGx0Qea9JsArRlgvsGMyB83Ovgp";
var data;
var pageNumber = 1;

var getTravelDetails = function() {
    var storedTravelDetails = JSON.parse(
        localStorage.getItem("storedDestinationDetails")
    );
    if (storedTravelDetails !== null) {
        destionationDetails = storedTravelDetails;
        $("#modalCity").val(destionationDetails[0]);
        $("#modalArrivalDt").val(destionationDetails[1]);
        $("#modalDepartureDt").val(destionationDetails[2]);
        $("#navCity").text(destionationDetails[0]);
    }
};

function getData(city) {
    mainCard.empty();
    $("#weeklyForecast").empty();
    if (!city) {
        return;
    }
    var weatherQueryApiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=bb777764badc46ea953835d44e32dc53";
    fetch(weatherQueryApiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            if (response.cod !== 200) {
                alert("City Not Found!");
                $("#city").val("");
                isError = true;
                getLocation();
                return;
            }
            var newCurrentWeatherCard = $("<div>").attr("class", "card mr-4");

            mainCard.append(newCurrentWeatherCard);

            var date = moment().format(" MM/DD/YYYY");
            var wIcon = response.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + wIcon + ".png";
            var cardHeader = $("<header>").attr("class", "card-header");
            var cityName = $("<p>")
                .attr("class", "card-header-title")
                .html(city + date);
            console.log(cityName);
            cityName.append($("<img>").attr("src", iconUrl));

            cardHeader.append(cityName);
            var cardContent = $("<div>").attr("class", "card-content");
            var cardBody = $("<div>").attr("class", "content");

            newCurrentWeatherCard.prepend(cardHeader);
            cardContent.append(cardBody);
            newCurrentWeatherCard.append(cardContent);

            var temp = Math.ceil(response.main.temp);
            cardBody.append(
                $("<p>")
                .attr("class", "mx-4 my-4")
                .html("Temperature: <strong>" + temp + " &#8457" + "</strong>")
            );
            var feelsLikeTemp = Math.ceil(response.main.feels_like);
            cardBody.append(
                $("<p>")
                .attr("class", "mx-4 my-4")
                .html(
                    "Feels Like: <strong>" + feelsLikeTemp + " &#8457" + "</strong>"
                )
            );
            var humidity = response.main.humidity + "&#37;";
            cardBody.append(
                $("<p>")
                .attr("class", "mx-4 my-4")
                .html("Humidity: <strong>" + humidity + "</strong>")
            );
            var windSpeed = response.wind.speed;
            cardBody.append(
                $("<p>")
                .attr("class", "mx-4 my-4")
                .html("Wind Speed: <strong>" + windSpeed + " MPH</strong")
            );

            /* Get UV Index from Weather API */
            var fullWeatherUrl =
                "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                response.coord.lat +
                "&lon=" +
                response.coord.lon +
                "&exclude=minutely,hourly&units=imperial&appid=bb777764badc46ea953835d44e32dc53";
            return fetch(fullWeatherUrl)
                .then(function(fullResponse) {
                    return fullResponse.json();
                })
                .then(function(fullResponse) {
                    cardBody.append(
                        $("<p>")
                        .attr("class", "mx-4 my-4")
                        .html("UV Index: <span>" + fullResponse.current.uvi + "</span>")
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
                        var newForcastCard = $("<div>").attr("class", "card mr-4");
                        mainCard.append(newForcastCard);
                        var cardFCHeader = $("<header>").attr("class", "card-header");
                        var myDate = new Date(
                            fullResponse.daily[i].dt * 1000
                        ).toLocaleDateString("en-US");
                        /* Display Date */
                        var dateTitle = $("<p>")
                            .attr("class", "card-header-title")
                            .html(myDate);
                        var iconFCCode = fullResponse.daily[i].weather[0].icon;
                        var iconFCURL =
                            "http://openweathermap.org/img/w/" + iconFCCode + ".png";
                        dateTitle.append($("<img>").attr("src", iconFCURL));

                        cardFCHeader.append(dateTitle);
                        var cardFCContent = $("<div>").attr("class", "card-content");
                        var cardFCBody = $("<div>").attr("class", "content");

                        newForcastCard.append(cardFCHeader);
                        cardFCContent.append(cardFCBody);
                        newForcastCard.append(cardFCContent);

                        var temp = Math.ceil(fullResponse.daily[i].temp["day"]);
                        cardFCBody.append(
                            $("<p>")
                            .attr("class", "mx-4 my-4")
                            .html("Temperature: " + temp + " &#8457")
                        );

                        var humidity = fullResponse.daily[i].humidity;
                        cardFCBody.append(
                            $("<p>")
                            .attr("class", "mx-4 my-4")
                            .html("Humidity: " + humidity)
                        );
                    }
                });
        });
}

/* Save Travel Details to LocalStorage */
var saveTravelDetails = function() {
    localStorage.setItem("storedDestinationDetails", JSON.stringify(destionationDetails));
};



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


async function getEventInfo(city) {

    var eventURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city + "&apikey=" + ticketMasterKey;

    var response = await fetch(eventURL);

    data = await response.json();
    generateEventCards(data, 0);
    console.log(data);
}

function generateEventCards(data, startingIndex) {
    $("#eventList").empty();
    $('#navbar').removeClass("hide");
    let endingIndex = Math.min(startingIndex + 6, data._embedded.events.length);
    for (let index = startingIndex; index < endingIndex; index++) {

        var eventName = data._embedded.events[index].name;

        var eventType = data._embedded.events[index].classifications[0].segment.name;
        // This is for the type of entertainment they want (Music, Sports, etc...)
        var eventGenre = data._embedded.events[index].classifications[0].genre.name;
        // This is the for the actual genre of said entertainment (Music: Pop, Rock, etc...)

        console.log(eventName, eventType, eventGenre);

        var newCard = $("<div>").attr({
            "class": "card column is-one-third is-full-mobile is-half-desktop is-rounded box mt-6 mb-0 my-4 has-text-centered",
            "id": "eventCard"
        });

        var newCardHeader = $("<div>").attr(
            "class",
            "card-header"
        );
        var newCardContent1 = $("<div>").attr({
            "class": "card-content",
            "id": "card1"
        });
        var newCardContentImg = $("<figure>").attr({
            "class": "card-content image is-4by3",
            "id": "cardimg"
        });
        var newCardContent2 = $("<div>").attr({
            "class": "card-content mb-3",
            "id": "card2"
        });
        var newCardFooter = $("<div>").attr(
            "class",
            "card-footer"
        );

        $(newCard).append(newCardHeader);
        $(newCard).append(newCardContent1);
        $(newCard).append(newCardContentImg);
        $(newCard).append(newCardContent2);
        $(newCard).append(newCardFooter);


        newCardHeader.append($("<h2>").html("<strong>" + eventName + "</strong>").attr("class", "is-size-3-desktop is-size-4"));
        newCardContent1.append($("<h3>").html("<strong> Activity: </strong>" + eventType).attr("class", "is-siz3-desktop is-size-5"));
        newCardContent1.append($("<h4>").html("<strong> Genre: </strong>" + eventGenre).attr("class", "is-siz3-desktop is-size-5"));

        for (let j = 0; j < 10; j++) {
            var imageItemRatio = data._embedded.events[index].images[j].ratio;
            if (imageItemRatio === "3_2") {
                console.log(imageItemRatio);
                var eventImage = data._embedded.events[index].images[j].url;
                newCardContentImg.append($("<img>").attr("src", eventImage));
                break;
            }
        }

        var eventStartDate = data._embedded.events[index].dates.start.localDate;
        var eventStartDateFormat = moment(eventStartDate, 'YYYY-MM-DD').format('dddd, MMM Do YYYY');
        var eventStartTime = data._embedded.events[index].dates.start.localTime;
        var eventStartTimeFormat = moment(eventStartTime, 'HH:mm:ss').format('h:mm a');

        var eventAddress = data._embedded.events[index]._embedded.venues[0].address.line1;
        var eventCity = data._embedded.events[index]._embedded.venues[0].city.name;
        var eventState = data._embedded.events[index]._embedded.venues[0].state.stateCode;
        var eventAddressName = data._embedded.events[index]._embedded.venues[0].name;


        if (data._embedded.events[index].priceRanges) {
            var eventCurrencyType = data._embedded.events[index].priceRanges[0].currency;
            var eventPriceMin = data._embedded.events[index].priceRanges[0].min;
            var eventPriceMax = data._embedded.events[index].priceRanges[0].max;
        }

        var eventTicketURL = data._embedded.events[index].url;


        newCardContent2.append($("<p>").html("<strong>Date: </strong>" + eventStartDateFormat).attr("class", "is-size-6"));
        newCardContent2.append($("<p>").html("<strong>Time: </strong>" + eventStartTimeFormat).attr("class", "is-size-6"));
        newCardContent2.append($("<p>").html("<strong>Location: </strong>" + eventAddress + "</br> " + eventCity + ", " + eventState).attr("class", "is-size-6"));
        newCardContent2.append($("<p>").html("<strong>Venue Name: </strong>" + eventAddressName).attr("class", "is-size-6"));

        if (eventPriceMin && eventPriceMin && eventCurrencyType) {
            newCardContent2.append($("<p>").html("<strong>Price: </strong>" + eventPriceMin + " - " + eventPriceMax + " " + eventCurrencyType).attr("class", "is-size-6"));
        }

        newCardFooter.append($("<a>").html("<strong>Ticket Links</strong>").attr({
            "href": eventTicketURL,
            "class": "is-size-4"
        }));


        $("#eventList").append(newCard);
    }
}

function selectEventPage() {

    pageNumber = $(this).data("page");
    pageNumber = parseInt(pageNumber);

    var startingIndex = pageNumber * 6 - 6;
    generateEventCards(data, startingIndex);
}

function previousPage() {
    if (pageNumber === 1) {
        return;
    } else {
        pageNumber--;
        var startingIndex = pageNumber * 6 - 6;
        generateEventCards(data, startingIndex);
    }
}

function nextPage() {
    var endingPageNumber = Math.floor(data._embedded.events.length / 6);
    if (pageNumber === endingPageNumber) {
        return;
    } else {
        pageNumber++;
        var startingIndex = pageNumber * 6 - 6;
        generateEventCards(data, startingIndex);
    }
}


function showPosition(position) {
    fetch("https://geolocation-db.com/json/697de680-a737-11ea-9820-af05f4014d91")
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            getData(response.city);
            getEventInfo(response.city);
            $("#city").val(response.city);
            $("#navCity").text(response.city);
        });
}

var closeModals = function() {
    $("html").removeClass("is-clipped");
    $("#modal").removeClass("is-active");
    $("#modal-weather").removeClass("is-active");
};

$(".modal-button").click(function() {
    var target = $(this).data("target");
    $("html").addClass("is-clipped");
    $(target).addClass("is-active");
    getTravelDetails();
});

$(".delete").click(function() {
    closeModals();
});

$(".btn-cancel").on("click", function() {
    closeModals();
});

$("#submit").on("click", function() {
    console.log("SUBMIT");
    destinationCity = $("#modalCity").val().trim();
    arrivalDate = $("#modalArrivalDt").val().trim();
    departureDate = $("#modalDepartureDt").val().trim();
    destionationDetails = [destinationCity, arrivalDate, departureDate];
    saveTravelDetails();
    $("#navCity").text(destinationCity);
    closeModals();
    getData(destinationCity);
    getEventInfo(destinationCity);
    pageNumber = 1;
});


$(".pagination-link").on("click", selectEventPage);
$(".pagination-previous").on("click", previousPage);
$(".pagination-next").on("click", nextPage);



/* Lodging Section */
var lodging = function() {
    var lodingApiUrl = "https://tripadvisor1.p.rapidapi.com/locations/search?location_id=1&limit=10&sort=relevance&offset=0&lang=en_US&currency=USD&units=mi&query=Orlando";
    fetch(lodingApiUrl, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "2a1bf2a5a1msh2f58415ea00fba6p180464jsn98f5bb866a17"
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            if (response.data[0].result_type === "geos") {
                console.log(response.data[1].result_object.address);
                var areaDescriptionEL = response.data[0].result_object.geo_description
                $("#area-description").html(areaDescriptionEL)
            }
            if (response.data[0].result_type === "geos") {
                console.log(response.data[0].result_object.name)
            } else {
                console.log('city info not found')
            }
            //cards 
            createLodgingCards(response.data)
        })
        .catch(err => {
            console.log(err);
        });


};

var createLodgingCards = function(data) {
    $('#lodgingList').empty()

    console.log(data[0].result_object.name)
        //lodging cards
    var newLodgingCard = $("<div>").attr("class", "card mr-4");
    var cardHeader = $("<header>").attr("class", "card-header");
    var cardContent = $("<div>").attr("class", "card-content");
    var cardBody = $("<div>").attr("class", "content");
    var image = data[i].result_object.photo.images.thumbnail.url
    var hotelAddress = data[i].result_object.address
    var rating = data[i].result_object.rating
    var hotelName = data[i].result_object.name
        //hotel picture

    //TODO:loop for cycling images
    for (var i = 1; i < 6; i++) {
        var newCard = $("<div>").attr({
            "class": "card column is-one-third is-full-mobile is-half-desktop is-rounded box mt-6 mb-0 my-4 has-text-centered",
            "id": "lodgingCard"
        });

        var newCardHeader = $("<div>").attr(
            "class",
            "card-header"
        );
        var newCardContent1 = $("<div>").attr({
            "class": "card-content",
            "id": "card1"
        });
        var newCardContentImg = $("<figure>").attr({
            "class": "card-content image is-4by3",
            "id": "cardimg"
        });
        var newCardContent2 = $("<div>").attr({
            "class": "card-content mb-3",
            "id": "card2"
        });
        var newCardFooter = $("<div>").attr(
            "class",
            "card-footer"
        );
        //renders card
        $(newCard).append(newCardHeader);
        $(newCard).append(newCardContent1);
        $(newCard).append(newCardContentImg);
        $(newCard).append(newCardContent2);
        $(newCard).append(newCardFooter);

        //inserts card data

        newCardHeader.append($("<h2>").html("<strong>" + hotelName + "</strong>").attr("class", "is-size-3-desktop is-size-4"));
        newCardContent1.append($("<h3>").html("<strong>" + rating + " out of 5: </strong>").attr("class", "is-siz3-desktop is-size-5"));
        newCardContent1.append($("<h4>").html("<strong> location: </strong>" + hotelAddress).attr("class", "is-siz3-desktop is-size-5"));

        console.log(image)
            //hotel address
        console.log(hotelAddress)
            //hotel rating
        console.log(rating)
            //hotel name
        console.log(hotelName)
        $("#lodgingList").append(newCard);
    }

}


lodging();