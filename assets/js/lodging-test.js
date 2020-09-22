
//date formatted year-month-day
fetch('https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=LON&checkinDate2020-10-10&checkOutDate=2020-10-13')

var Amadeus = require('amadeus');

//token Authorization
var amadeus = new Amadeus({
  clientId: 'pKHlLF8HDwpSmANti64bp9vjMXIOWXro',
  clientSecret: 'NIdV68vFUEXKAsj1'
});
// Get list of Hotels by city code
amadeus.shopping.hotelOffers.get({
  cityCode: 'PAR'
}).then(function (response) {
  console.log(response);
}).catch(function (response) {
  console.error(response);
});
