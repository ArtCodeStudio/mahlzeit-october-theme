/**
 * Create Leaflet map with data attributes
 */
window.jumplink.partials['jumplink-location'] = function($partials, $partial, dataset, data) {
    var partialData = $partial.data();
    window.jumplink.debug.partials('jumplink-location', partialData);

    var $mapElement = $('#map-'+partialData.handle);
    var data = $mapElement.data();
    
    data.lat = parseFloat(data.lat);
    data.lon = parseFloat(data.lon);
    data.popupAddLat = parseFloat(data.popupAddLat);
    
    console.log('data', data);
    
    var icon = L.icon({
        iconUrl: data.markerIcon,    
        iconSize:     data.iconSize, // size of the icon
        iconAnchor:   data.iconAnchor, // point of the icon which will correspond to marker's location
    });
    
    var map = L.map('map-'+partialData.handle, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
    }
    ).setView([data.lat, data.lon], data.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var maker = L.marker([data.lat, data.lon], {icon: icon}).addTo(map);
    
    if(data.popupText) {
        var popup = L.popup()
            // set the popup a bit over the marker
            .setLatLng([data.lat + data.popupAddLat, data.lon])
            .setContent(data.popupText)
            .openOn(map);
    }
    
    map.on('click', function(e) {
        console.log("Lat: " + e.latlng.lat + ", Lon: " + e.latlng.lng);
    });    
};