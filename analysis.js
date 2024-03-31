var existingPolygons = [];

var map;
var mapLoaded = false;

function initMap() {
  if (!mapLoaded) {
    var center = { lat: 24.940651, lng: 84.846202 };

    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 15 // Adjust the initial zoom level
    });

    mapLoaded = true;
  }
}


function locateplot(button) {
    initMap();
    var row = $(button).closest('tr');

    var plotValue = row.find('.plot').val();
    var rajyaValue = row.find('.rajya').val(); 
    var districtValue = row.find('.district').val(); 
    var prakhandValue = row.find('.prakhand').val(); 
    var mouzaValue = row.find('.mouza').val(); 
    $.ajax({
        url: "getPlotLocation.php", 
        type: "GET",
        data: {
            plot: plotValue,
            rajya: rajyaValue,
            district: districtValue,
            prakhand: prakhandValue,
            mouza: mouzaValue
        },
        success: function(data) {
            clearMap();

            var cornerData = JSON.parse(data);

            if (cornerData) {
                var cornerLatLngs = [];
                for (var i = 1; i <= 6; i++) {
                    var cornerLat = parseFloat(cornerData['corner' + i + 'latitude']);
                    var cornerLng = parseFloat(cornerData['corner' + i + 'longitude']);

                    if (cornerLat !== 0 && cornerLng !== 0) {
                        cornerLatLngs.push({ lat: cornerLat, lng: cornerLng });
                    }
                }

                if (cornerLatLngs.length >= 2) {
                    // Add the first point to close the polygon
                    cornerLatLngs.push(cornerLatLngs[0]);

                    var polygon = new google.maps.Polygon({
                        paths: cornerLatLngs,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        fillColor: '#c1e8b3',
                        fillOpacity: 0.4 
                    });

                    polygon.setMap(map);

                    map.setCenter(cornerLatLngs[0]);

                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < cornerLatLngs.length; i++) {
                        bounds.extend(cornerLatLngs[i]);
                    }

                    map.fitBounds(bounds);

                    existingPolygons.push(polygon);
                } else {
                    alert('Not enough valid coordinates to plot the polygon.');
                }
            } else {
                alert('Location not found for the selected plot.');
            }
        }
    });
}

function clearMap() {
  
    for (var i = 0; i < existingPolygons.length; i++) {
        existingPolygons[i].setMap(null);
    }
    existingPolygons = [];
}
