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

    var sidebarAPI = L.control.sidebar('sidebarAPI', {
     position: 'right'
    });

    map.addControl(sidebar);
    map.addControl(sidebarAPI);
    sidebar.show();
    sidebarAPI.show();


    var thousandsFormat = d3.format(".3f");
        millionsFormat = d3.format(".6f");
        billionsFormat = d3.format(".9f");
        commaFormat = d3.format(",");
        damageAxisFormat = d3.format("$.3s")


    var damagePopScale = function(damage){
        var realDamage;

        if(damage.substr(0,4) == "0.00"){
            return 0;
        }
        else if(damage.substr(-1) == 'B'){
            //Billions Format
            realDamage = billionsFormat(damage.substr(0,damage.length-1));
            realDamage = realDamage.replace(".","");
            return realDamage;
        }
        else if(damage.substr(-1) == 'M'){
            //Millions Format
            realDamage = millionsFormat(damage.substr(0,damage.length-1));
            realDamage = realDamage.replace(".","");
            return realDamage;
        }
        else if(damage.substr(-1) == 'K'){
            //Thousands Format
            //console.log(damage);
            realDamage = thousandsFormat(damage.substr(0,damage.length-1));
            realDamage = realDamage.replace(".","");
            //console.log(realDamage);
            return realDamage;
        }
        else{   
            //Should not reach this
        }
    }
 $('#select_year').on('change',function(d,e){
        var yearAPI = $(this).val();
        var state ="NEW YORK";

        var params = {state:state, year: yearAPI}


        var mapData;
        var state = params.state;
        var beginYear = params.year;

        var url = "http://localhost:1337/storms/mapRoute/"+state+"/"+beginYear;
        console.log("URL in API Filter:",url);




        queryDb(params);


    })

    // -- Data Processing

    var params = {year:"2012",state:"NEW YORK"};



    // var url = "http://localhost:1337/storms/mapRoute/"+params.state+"/"+params.year;
    // d3.json(url,function(err,dataFromServer){
    //     mapData = dataFromServer.state.rows;
    //     var locationEvents = mapData.filter(function(event){
    //         return event.BEGIN_LAT != null && event.BEGIN_LON != null && event.DAMAGE_PROPERTY != null && event.DAMAGE_CROPS != null && event.YEAR != null;
    //     })

    //     //Change damage numbers to proper form before sending the data along
    //     locationEvents.forEach(function(event){
    //         event.DAMAGE_PROPERTY = damagePopScale( event.DAMAGE_PROPERTY);
    //         event.DAMAGE_CROPS = damagePopScale(event.DAMAGE_CROPS);
    //     })

    //     drawMap(locationEvents,params.year);
    //     crossData(locationEvents,params.year);


    // });// end d3.json

    // function visualize(data){
    //     drawMap(data,params.year);
    //     crossData(data,params.year);
    // }

    // function getEvents(queryParam,visualFunction){
    //     var locationEvents = queryDb(queryParam);
    //     console.log("Events after query function:",locationEvents);
    //     visualFunction(locationEvents);
    // }

    queryDb(params);

    //console.log(queryDb(params));


//    getEvents(params,visualize);


