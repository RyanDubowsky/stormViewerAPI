
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



        chartParams.state = $('#select_state').val();
        chartParams.eType = type;

        //Redraw chart and map
        syncMap(syncMapDraw);
        syncChart(syncChartDraw);
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

        chartParams.state = state;
        chartParams.eType = $('#select_event').val();


        d3.json("../data/stateLatLong.json",function(err,latLonObj){

            latLonObj.forEach(function(stateObj){
               if (stateObj.key == state){
                    console.log(stateObj);
                    map.panTo(L.latLng(stateObj.latitude,stateObj.longitude));
               }
            })

            //Redraw chart and map
            syncMap(syncMapDraw);
            syncChart(syncChartDraw);
        })
    })

    $('#allEvents').on('mouseup',function(d,e){

        console.log("global filter var in index",brushFilter);
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


        chartParams.state = $('#select_state').val();
        chartParams.eType = $('#select_event').val();

        console.log("chartParams in index", mapParams);
        console.log("mapParams in index", chartParams);  


        setTimeout(syncMap(syncMapDraw),250);

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




