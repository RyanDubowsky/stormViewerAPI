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
    var lineChartParams = {state:"NEW YORK",eType:"Hail"};


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
        barChartParams.eType = type;

        //Redraw map
        syncMap(syncMapDraw);
        syncBarChart(syncBarChartDraw);
    })



    $('#select_state').on('click',function(d,e){
        state  = $(this).val();

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


        d3.json("../data/stateLatLong.json",function(err,latLonObj){

            latLonObj.forEach(function(stateObj){
               if (stateObj.key == state){
                    map.panTo(L.latLng(stateObj.latitude,stateObj.longitude));
               }
            })

            //Redraw chart and map
            syncMap(syncMapDraw);
            syncBarChart(syncBarChartDraw);
        })
    })

    $('#allEvents').on('mouseup',function(d,e){

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
        console.log("logging brush in index event",brushFilter);

        barChartParams.state = $('#select_state').val();
        barChartParams.eType = $('#select_event').val();




        setTimeout(syncMap(syncMapDraw),250);
    })



        // map.on('layeradd',function(d,e){
        //     console.log("hi");
        //     setTimeout(syncBarChart(syncBarChartDraw),400);
        // })



function syncBarChart(callback){
    //GET THE DATA
    barChartQuery(barChartParams,callback);
}

function syncBarChartDraw(params){
    //console.log("index log of chart data",params);
    barChartDraw(params);
}

function syncMap(callback){

    mapQuery(mapParams,callback);

}

function syncMapDraw(params){
    //console.log("index log of map data",params);
    mapDraw(params);
}

function syncLineChart(callback){
    //GET THE DATA
    lineChartQuery(lineChartParams,callback);
}

function synclineChartDraw(params){
    //console.log("index log of chart data",params);
    //lineChartDraw(params);
}

syncMap(syncMapDraw);
syncBarChart(syncBarChartDraw);  // foo will run, then calls bar after foo is finished.
syncLineChart(synclineChartDraw);

