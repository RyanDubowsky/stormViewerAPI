function clorDraw(data){
	var geojson;




    var damageDensity = d3.scale.sqrt()
        .domain([0,100000000000])
        .range([0,1200]);
    var comma = d3.format(",");

console.log(data)


function getColor(d) {
return d > 100000000000 ? '#800026' :
       d > 50000000000  ? '#BD0026' :
       d > 2000000000  ? '#E31A1C' :
       d > 100000000  ? '#FC4E2A' :
       d > 50000000   ? '#FD8D3C' :
       d > 2000000   ? '#FEB24C' :
       d > 100000   ? '#FED976' :
                  '#FFEDA0';
}


newStatesData = statesData;



newStatesData.features.forEach(function(state){

	data.forEach(function(curState){
		if (curState.state == state.properties.name.toUpperCase()){
				state.properties.density = curState.damage
		}
	})

})
console.log(newStatesData)

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Property Damage Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + "$" + comma(props.density) + ' Property Damage in USD'
        : 'Hover over a state');
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100000, 2000000, 50000000, 100000000, 2000000000, 50000000000, 100000000000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            "$" + comma(grades[i]) + (grades[i + 1] ? '&ndash;' + "$" + comma(grades[i + 1]) + '<br>' : '+');
    }

    return div;
};





legend.addTo(map);

info.addTo(map)

geojson = L.geoJson(newStatesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
}