    window.brushFilter = [2010,2013];
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
    var mapParams = {state:"NEW YORK",eType:"All",startYear:"2010",endYear:"2013"};
    var barChartParams = {state:"All",eType:"All"};
    var lineChartParams = {state:"NEW YORK",eType:"All"};

    //Formatting
    var thousandsFormat = d3.format(".3f");
        millionsFormat = d3.format(".6f");
        billionsFormat = d3.format(".9f");
        commaFormat = d3.format(",");
        damageAxisFormat = d3.format("$.3s")

    //Sidebar 
    var sidebar = L.control.sidebar('sidebar', {
        position: 'left',
        closeButton:false
    });
    map.addControl(sidebar);
    sidebar.show();



    // Uppdates map and charts when event type changes
    $('#select_event').on('click',function(d,e){
        var type = $(this).val();

        //Updating parameters for map and charts
        if($('#select_state').val() == 'All'){
           mapParams.eType = type;
        }
        else{
           mapParams.state = $('#select_state').val();
           mapParams.eType = type;
        }

        if(brushFilter != null){
           mapParams.startYear = Math.round(brushFilter[0]);
           mapParams.endYear = Math.round(brushFilter[1]);
        }

        barChartParams.state = $('#select_state').val();
        lineChartParams.eType = type;
        barChartParams.state = $('#select_state').val();
        lineChartParams.eType = type;

        //Redraw map
        syncMap(syncMapDraw);
        syncBarChart(syncBarChartDraw);
        syncLineChart(synclineChartDraw);
    })


    //Updates map and chart when state changes
    $('#select_state').on('click',function(d,e){
        state  = $(this).val();

        //Updating parameters for map and charts
        if($('#select_state').val() == 'All'){
           mapParams.eType = $('#select_event').val();
        }
        else{
           mapParams.state = state;
           mapParams.eType = $('#select_event').val();
        }

        if(brushFilter != null){
            mapParams.startYear = Math.round(brushFilter[0]);
            mapParams.endYear = Math.round(brushFilter[1]);
        }

        barChartParams.state = state;
        barChartParams.eType = $('#select_event').val();
        lineChartParams.state = state;
        lineChartParams.eType = $('#select_event').val();

        //Find where the new state is and pan to that spot
        d3.json("../data/stateLatLong.json",function(err,latLonObj){

            latLonObj.forEach(function(stateObj){
               if (stateObj.key == state){
                    map.panTo(L.latLng(stateObj.latitude,stateObj.longitude));
               }
            })

            //Redraw chart and map
            syncMap(syncMapDraw);
            syncBarChart(syncBarChartDraw);
            syncLineChart(synclineChartDraw);
        })
    })

    //Update map when bar chart brush (year) moves
    $('#barChart').on('mouseup',function(d,e){

        if($('#select_state').val() == 'All'){
           mapParams.eType = $('#select_event').val();
           mapParams.startYear = Math.round(brushFilter[0]);
           mapParams.endYear = Math.round(brushFilter[1]);
        }
        else{
           mapParams.state = $('#select_state').val();
           mapParams.eType = $('#select_event').val();
           mapParams.startYear = Math.round(brushFilter[0]);
           mapParams.endYear = Math.round(brushFilter[1]);
        }

        brushFilter[0] = mapParams.startYear;
        brushFilter[1] = mapParams.endYear;
        document.getElementById("year_display").innerHTML = "Year(s) displayed: " + brushFilter[0] + "-" + brushFilter[1];

        barChartParams.state = $('#select_state').val();
        barChartParams.eType = $('#select_event').val();

        setTimeout(syncMap(syncMapDraw),250);
    })

//Syncronous function for drawing and querying the bar chart
function syncBarChart(callback){
    barChartQuery(barChartParams,callback);
}

//Actual drawing of the bar chart
function syncBarChartDraw(params){
    //console.log("index log of chart data",params);
    barChartDraw(params);
}

//Syncronous function for drawing and querying the map
function syncMap(callback){
    mapQuery(mapParams,callback);
}

//Actual drawing of the map
function syncMapDraw(params){
    mapDraw(params);
}

//Syncronous function for drawing and querying the line chart
function syncLineChart(callback){
    lineChartQuery(lineChartParams,callback);
}

//Actual drawing of the line chart
function synclineChartDraw(params){
    lineChartDraw(params);
}

//Syncronous calls with callbacks for chart and map draws
syncMap(syncMapDraw);
syncBarChart(syncBarChartDraw);
syncLineChart(synclineChartDraw);


