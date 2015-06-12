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
    $('#executeQuery').on('click',function(d,e){

        var state = $("#select_state").val();

        var yearAPI = $("#select_year").val();

        var exactYear = $("#exactYear input[type='radio']:checked");
        if (exactYear.length > 0) {
            exact = exactYear.val();
        }
        else{
            exact = "exact";
        }

        d3.json("../data/stateLatLong.json",function(err,latLonObj){
            console.log(yearAPI,exact);
            var params = {state:state, year: yearAPI,exact:exact}
            var url = "http://localhost:1337/storms/mapRoute/"+params.state+"/"+params.year+"/"+params.exact;
            console.log(latLonObj);

            latLonObj.forEach(function(stateObj){
                if (stateObj.key == state){
                    console.log(stateObj);
                    map.panTo(L.latLng(stateObj.latitude,stateObj.longitude));
                }
            })
        queryDb(params);
        })

    })

    $('#showAPI').on('click',function(d,e){
        sidebarAPI.toggle();
    })




    // Initial Load and Default parameters
    var params = {year:"2012",state:"NEW YORK",exact:"younger"};
    queryDb(params);

