var hotelKey = 'pKHlLF8HDwpSmANti64bp9vjMXIOWXro'

async function getHotelInfo(cityCode) {
var Response = await fetch('https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=' + cityCode + '&API_Key=' + hotelKey)
var data =await Response.json()
console.log(data)}
getHotelInfo('LON')

$(document).ready(function() {
    $( "#mySlider" ).slider({
      range: true,
      min: 10,
      max: 999,
      values: [ 200, 500 ],
      slide: function( event, ui ) {
     $( "#price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
     }
  });
      
  $( "#price" ).val( "$" + $( "#mySlider" ).slider( "values", 0 ) +
           " - $" + $( "#mySlider" ).slider( "values", 1 ) );
      
    });
