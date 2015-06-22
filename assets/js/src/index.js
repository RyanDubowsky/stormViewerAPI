    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");
    
    // -- Map Setup
    var map = L.map("map", {
      center: [42.76314586689494,-74.7509765625],
      zoom: 7,
      layers: [mapquestOSM],
      zoomControl: false
    });

    // Initial Load and Default parameters
    
    var mapParams = {state:"NEW YORK",eType:"All",startYear:"2012",endYear:"2014"};
    var chartParams = {state:"All",eType:"All"};


    var thousandsFormat = d3.format(".3f");
        millionsFormat = d3.format(".6f");
        billionsFormat = d3.format(".9f");
        commaFormat = d3.format(",");
        damageAxisFormat = d3.format("$.3s")

var sidebar = L.control.sidebar('sidebar', {
     position: 'left',
     closeButton:false
    });

    map.addControl(sidebar);
    sidebar.show();




    $('#select_event').on('click',function(d,e){
        var type = $(this).val();

        mapParams = {state:"NEW YORK",eType:type,startYear:"2012",endYear:"2014"};
        chartParams = {state:"All",eType:type};

        syncMap(syncMapDraw);
        syncChart(syncChartDraw);
    })








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




