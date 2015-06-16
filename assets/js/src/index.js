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


    $('#bar_select').on('click',function(d,e){
        var type = $(this).val();
        allEventsQuery(type);
    })



    // Initial Load and Default parameters
    allEventsQuery("All");

    var params = {year:"2011",state:"NEW YORK",exact:"younger"};
    queryDb(params);

