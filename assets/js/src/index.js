    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");
    
    // -- Map Setup
    var map = L.map("map", {
      center: [42.76314586689494,-74.7509765625],
      zoom: 7,
      layers: [mapquestOSM],
      zoomControl: true
    });

    var sidebar = L.control.sidebar('sidebar', {
     position: 'left'
    });

    map.addControl(sidebar);
    sidebar.show();

    // -- Data Processing

    d3.json('./data/eventsTEST.json',function(err,data){
        //console.log('data',data[0],data.length)
        //console.log(data);
        console.log("hello");
        var locationEvents = data.filter(function(event){
            return event.BEGIN_LAT != " " && event.BEGIN_LON != " ";
        })
        drawMap(locationEvents);
        crossData(data);

    });// end d3.json

//data/stormEventsFromZips/newStormEvents.json
//data/eventsTEST.json


// New Data Set damage_property_num field is named differently
// Same difference with damage_crops
//CZ_Name WE NEED CZ_Name_string
// Begin date wrong
//