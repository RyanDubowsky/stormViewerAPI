/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");

// -- Map Setup
var map = L.map("map", {
  center: [37.76314586689494,-94],
  zoom: 5,
  layers: [mapquestOSM],
  zoomControl: false
});

//Sidebar 
var sidebar = L.control.sidebar('sidebar', {
    position: 'left',
    closeButton:false
});
map.addControl(sidebar);
sidebar.show();

var data=[]

var clorMapParams = {eType:"All",startYear:"2000",endYear:"2015"};


    //Formatting
    var thousandsFormat = d3.format(".3f");
        millionsFormat = d3.format(".6f");
        billionsFormat = d3.format(".9f");
        commaFormat = d3.format(",");
        damageAxisFormat = d3.format("$.3s")

//Syncronous function for drawing and querying the line chart
function syncClorMap(callback){
    clorQuery(clorMapParams,callback);
}

//Actual drawing of the line chart
function syncClorMapDraw(params){
    clorDraw(params);
}


    // Uppdates map and charts when event type changes
    $('#select_event').on('click',function(d,e){
        var type = $(this).val();


        clorMapParams.eType = type;



        //Redraw map
        syncClorMap(syncClorMapDraw);

    })

syncClorMap(syncClorMapDraw);