function countyChorDraw(queryData){
	var geojson;

	var clorMapParams = {eType:"All",startYear:"2000",endYear:"2015"};


    var damageDensity = d3.scale.sqrt()
        .domain([0,100000000000])
        .range([0,1200]);
    var comma = d3.format(",");

//console.log(queryData)


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

d3.json("../data/usCounties.json",function(topology){
 var demo = topojson.feature(topology, topology.objects.counties)
console.log("original states",statesData)
console.log("new counties",demo);


//Get the lat/long and density object
newStatesData = demo;

	

// var filteredEvents;


// newStatesData.features.forEach(function(state){
// 				state.properties.density = 0;
// 	queryData.forEach(function(curState){
// 		if (curState.state == state.properties.name.toUpperCase()){
// 				state.properties.density = state.properties.density + curState.damage
// 		}
// 	})
// 	state.properties.density = Math.round(state.properties.density);
// })






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




function updateMap(){
    var type = $('#select_event').val()

    //queryData has type/state combo
    //If we want a specific type, make a new collection with ONLY that type

    //if type == 'All', reset to original
    if(type == 'All'){
        //Remove old storm layer, add new one with full dataset

        map.removeLayer(geojson);

		newStatesData.features.forEach(function(state){
			state.properties.density = 0;
			queryData.forEach(function(curState){
				if (curState.state == state.properties.name.toUpperCase()){
						state.properties.density = state.properties.density + curState.damage
				}
			})
			state.properties.density = Math.round(state.properties.density);
		})

        console.log("Original all events per state data",newStatesData)

		geojson = L.geoJson(newStatesData, {
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);
		info.update();
    }
    //Otherwise, filter for desired event type
    //Scale/legend IS GOING TO BE MESSED UP
    else{
        newStatesData = statesData;
    	newStatesData.features.forEach(function(state){
			state.properties.density = 0;
			queryData.forEach(function(curState){
				if (curState.state == state.properties.name.toUpperCase() && curState.type == type){
						state.properties.density = curState.damage
				}
			})
			state.properties.density = Math.round(state.properties.density);

		})
    	console.log("Event Filtered Events",newStatesData);
        //Remove old layer, make a new one, add the new one
        map.removeLayer(geojson);
		geojson = L.geoJson(newStatesData, {
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);
		info.update();
    }
}

// Uppdates map and charts when event type changes
$('#select_event').on('click',function(d,e){
	updateMap();
})


$('#yearButton').on('click',function(d,e){
	console.log("onyong")

	var startYear = +$('#startYear').val()
	var endYear = +$('#endYear').val()

	console.log(startYear,endYear);

	if(startYear < 1950 || startYear > 2014){
		console.log("start year eror")
    	document.getElementById("error").innerHTML = "Start Year out of Bounds";
	}
	else if(endYear < 1950 || startYear > 2014){
		console.log("end year eror")
    	document.getElementById("error").innerHTML = "End Year out of Bounds";
	}
	else if(startYear > endYear){
		console.log("start/end year is in wrong order")
    	document.getElementById("error").innerHTML = "Start Year is after End Year";
	}
	else if(endYear-startYear > 15){
		console.log("year range too big")
    	document.getElementById("error").innerHTML = "Year Range greater than 15";
	}
	else{
		console.log("no errors")
    	document.getElementById("error").innerHTML = " ";

		brush.extent([startYear,endYear]);
    	svg.select(".brush").call(brush);
    	document.getElementById("year_display").innerHTML = "Year(s) displayed: " + startYear + "-" + endYear;

		clorMapParams.startYear = startYear;
		clorMapParams.endYear = endYear;
		clorQuery(clorMapParams,yearSelect);
}





})



function yearSelect(newQueryData){
	//console.log(newQueryData);

	queryData = newQueryData;
	//console.log(queryData);

	updateMap();
}


legend.addTo(map);

info.addTo(map)

geojson = L.geoJson(newStatesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);




//Slider for year select


var margin = {top: 0, right: 100, bottom: 80, left: 225},
    width = 1250 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom-150;

var timeScale = d3.scale.linear()
  .domain([1950, 2015])
  .range([0, width])
  .clamp(true);

//initial brush
var startValue = 2000;
startingValue = 2000;

var endValue = 2015;
endingValue = 2015;



var y = d3.random.normal(height / 2, height / 2);

var brush = d3.svg.brush()
    .x(timeScale)
    .extent([startingValue, endingValue])
   	.on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend);

var arc = d3.svg.arc()
    .outerRadius(height / 2)
    .startAngle(0)
    .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

var svg = d3.select("#sliderDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis().scale(timeScale).orient("bottom").tickFormat(d3.format("")).tickSize(5));

    
var brushg = svg.append("g")
    .attr("class", "brush")
    .call(brush);

brushg.selectAll(".resize").append("path")
    .attr("transform", "translate(0," +  height / 2 + ")")
    .attr("d", arc);

brushg.selectAll("rect")
    .attr("height", height);

brushstart();
brushmove();



function brushstart() {
  svg.classed("selecting", true);
}

function brushmove() {
}

function brushend() {
	var s = brush.extent();
  	console.log(s);

	if(Math.round(s[1]) - Math.round(s[0]) > 15 ){
		brush.extent([Math.round(s[1]),Math.round(s[1]-15)]) (d3.select(this));
	}
	else{
		brush.extent([Math.round(s[1]),Math.round(s[0])])(d3.select(this));
	}
	s = brush.extent();
    document.getElementById("year_display").innerHTML = "Year(s) displayed: " + Math.round(s[1]) + "-" + Math.round(s[0]);

	$('#startYear').val(Math.round(s[1]))
	$('#endYear').val(Math.round(s[0]))

    clorMapParams.startYear = Math.round(s[1]);
    clorMapParams.endYear = Math.round(s[0]);
    clorQuery(clorMapParams,yearSelect);

	svg.classed("selecting", !d3.event.target.empty());
}

})
}