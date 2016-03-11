// Get the user's w3w API key via prompt
if (!localStorage.getItem('w3wkey')) {
    localStorage.setItem(
        'w3wkey',
		prompt('What is your w3w API key?')
    );
}

//Get the user's API key via prompt
if (!localStorage.getItem('uc_api_key')) {
    localStorage.setItem(
    	'uc_api_key',
        prompt('What is your UC API key?')
    );
}

// Get the user's API secret via prompt
if (!localStorage.getItem('uc_api_secret')) {
    localStorage.setItem(
        'uc_api_secret',
		prompt('What is your UC API secret?')
    );
}

// Confirm we've got 'em by displaying them to the screen
var apiKey = localStorage.getItem('uc_api_key'),
    apiSecret = localStorage.getItem('uc_api_secret');

var dragging = false;
var lang = 'en';
var key = localStorage.getItem('w3wkey');


L.Marker.prototype.animateDragging = function() {

  var iconMargin, shadowMargin;

  this.on('dragstart', function() {
    dragging = true;
    if (!iconMargin) {
      iconMargin = parseInt(L.DomUtil.getStyle(this._icon, 'marginTop'));
      shadowMargin = parseInt(L.DomUtil.getStyle(this._shadow, 'marginLeft'));
    }

    this._icon.style.marginTop = (iconMargin - 15) + 'px';
    this._shadow.style.marginLeft = (shadowMargin + 8) + 'px';
  });

  return this.on('dragend', function() {
    dragging = false;
    this._icon.style.marginTop = iconMargin + 'px';
    this._shadow.style.marginLeft = shadowMargin + 'px';
  });
};

var map = L.map('map').setView([45.21433, 5.80749], 15);

var Stamen_Toner = L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);

// Create a simple UC tile layer - global map, no restrictions
var url = `//tile-{s}.urthecast.com/v1/rgb/{z}/{x}/{y}?api_key=${apiKey}&api_secret=${apiSecret}`;
// Append it to the map
var ucTiles = L.tileLayer(url).addTo(map);

var w3wmarker = L.marker([45.21433, 5.80749], {
    draggable: true
  })
  .on('dragend', updateW3w2)
  .on('move', updateW3w)
  .animateDragging()
  .addTo(map);

updateW3w();

$('#lang').on('change', function() {
  lang = $('#lang').val();
  updateW3w();
});

map.on('click', onMapClick);

function onMapClick(evt) {
  var latlon = evt.latlng;
  var lat = latlon.lat;
  var lon = latlon.lng;
  w3wmarker.setLatLng(L.latLng(lat,lon));
}

function updateW3w2(e) {
  dragging = false;
  updateW3w(e);
}
function updateW3w(e) {
  if( dragging ) {
    return ;
  }
  data = {
    'key': key,
    'lang': lang,
    'position': '\'' + w3wmarker.getLatLng().lat + ',' + w3wmarker.getLatLng().lng + '\''
  };

  $.post('http://api.what3words.com/position', data, function(response) {
    console.log(response);
    $('#w3w').text(response.words[0] + '.' + response.words[1] + '.' + response.words[2]);
  });
}
