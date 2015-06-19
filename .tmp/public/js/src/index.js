    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");
    
    // -- Map Setup
    var map = L.map("map", {
      center: [42.76314586689494,-74.7509765625],
      zoom: 7,
      layers: [mapquestOSM],
      zoomControl: true
    });




    var thousandsFormat = d3.format(".3f");
        millionsFormat = d3.format(".6f");
        billionsFormat = d3.format(".9f");
        commaFormat = d3.format(",");
        damageAxisFormat = d3.format("$.3s")




    $('#bar_select').on('click',function(d,e){
        var type = $(this).val();
        allEventsQuery(type);
    })



    // Initial Load and Default parameters
    
    var mapParams = {state:"NEW YORK",eType:"All",startYear:"2012",endYear:"2014"};
var chartParams = {state:"All",eType:"All"};

//Uses another d3.json call to force syncronicity
    // d3.json(chartQuery(chartParams),function(err,chartData){
    //     console.log("index log of chartData",chartData);
    //     //Call to chartDraw
    // })




function syncChart(callback){
    //GET THE DATA
    chartQuery(chartParams,callback);
}

function syncChartDraw(params){
    //console.log("index log of chart data",params);
    chartDraw(params);
}

function syncMap(callback){

    mapQuery(mapParams,callback);

}

function syncMapDraw(params){
    //console.log("index log of map data",params);
    mapDraw(params);
}

syncMap(syncMapDraw);
syncChart(syncChartDraw);  // foo will run, then calls bar after foo is finished.
    // d3.json(mapQuery(mapParams),function(err,mapData){
    //     console.log("index log of mapData",mapData);
    //     //Call to mapDraw
    // })



