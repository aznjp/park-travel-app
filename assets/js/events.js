var ticketMasterKey = "	i0lp5oGx0Qea9JsArRlgvsGMyB83Ovgp"

async function getEventInfo(city) {
    var eventURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + city + "&apikey=" + ticketMasterKey;

    var response = await fetch(eventURL)

    var data = await response.json()
    for (let index = 0; index < 6; index++) {

        var eventName = data._embedded.events[index].name

        var eventType = data._embedded.events[index].classifications[0].segment.name
            // This is for the type of entertainment they want (Music, Sports, etc...)
        var eventGenre = data._embedded.events[index].classifications[0].genre.name
            // This is the for the actual genre of said entertainment (Music: Pop, Rock, etc...)

        console.log(eventName, eventType, eventGenre)

        var newCard = $("<div>").attr(
            "class",
            "card column is-one-third is-full-mobile is-half-desktop is-rounded box mt-6 mb-0 my-4 has-text-centered"
        );
        $("#eventList").append(newCard);


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
            "class": "card-content",
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
        newCardContent1.append($("<h3>").html("<strong> Activity: </strong>" + eventType).attr("class", "is-size-3-desktop is-size-5"));
        newCardContent1.append($("<h4>").html("<strong> Genre: </strong>" + eventGenre).attr("class", "is-size-3-desktop is-size-5"));

        for (let j = 0; j < 10; j++) {
            // const element = array[index];
            var imageItemRatio = data._embedded.events[index].images[j].ratio
            if (imageItemRatio === "3_2") {
                console.log(imageItemRatio)
                var eventImage = data._embedded.events[index].images[j].url
                newCardContentImg.append($("<img>").attr("src", eventImage));
                break
            }
        }

        var eventStartDate = data._embedded.events[index].dates.start.localDate
        var eventStartDateFormat = moment(eventStartDate, 'YYYY-MM-DD').format('dddd, MMM Do YYYY')
        var eventStartTime = data._embedded.events[index].dates.start.localTime
        var eventStartTimeFormat = moment(eventStartTime, 'HH:mm:ss').format('h:mm a')

        var eventAddress = data._embedded.events[index]._embedded.venues[0].address.line1
        var eventCity = data._embedded.events[index]._embedded.venues[0].city.name
        var eventState = data._embedded.events[index]._embedded.venues[0].state.stateCode
        var eventAddressName = data._embedded.events[index]._embedded.venues[0].name

        // var eventCurrencyType = data._embedded.events[index].priceRanges[0].currency
        // var eventPriceMin = data._embedded.events[index].priceRanges[0].min
        // var eventPriceMax = data._embedded.events[index].priceRanges[0].max

        var eventTicketURL = data._embedded.events[index].url


        newCardContent2.append($("<p>").html("<strong>Date: </strong>" + eventStartDateFormat).attr("class", "is-size-6"));
        newCardContent2.append($("<p>").html("<strong>Time: </strong>" + eventStartTimeFormat).attr("class", "is-size-6"));
        newCardContent2.append($("<p>").html("<strong>Location: </strong>" + eventAddress + "</br> " + eventCity + ", " + eventState).attr("class", "is-size-6"));
        newCardContent2.append($("<p>").html("<strong>Venue Name: </strong>" + eventAddressName).attr("class", "is-size-6"));
        // newCardContent.append($("<li>").html("<strong>Price: </strong>" + eventPriceMin + " - " + eventPriceMax + " " + eventCurrencyType).attr("class", "is-size-5"));

        newCardFooter.append($("<a>").html("<strong>Ticket Links</strong>").attr({
            "href": eventTicketURL,
            "class": "is-size-4"
        }));

    }
    console.log(data)

}

getEventInfo("orlando")