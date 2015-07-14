function lineChartQuery(params,callback){
	var mapData; //1st Process of data from DB
	var locationEvents; //Filtered out null-years

    var url = "/storms/lineChart/"+params.state+"/"+params.eType
    var thousandsFormat = d3.format(".3f");
    //Scale to make numbers look normal
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
            realDamage = thousandsFormat(damage.substr(0,damage.length-1));
            realDamage = realDamage.replace(".","");
            return realDamage;
        }
        else{   
            //Should not reach this
        }
    }

    //Queries the DB, modifies data to work with app
    d3.json(url,function(err,dataFromServer){
        mapData = dataFromServer.state.rows;

        ///Filter out null data
        locationEvents = mapData.filter(function(event){
            return event.DAMAGE_PROPERTY != null && event.DAMAGE_PROPERTY != "0.00K" ;
        })

        locationEvents.forEach(function(event){
            event.DAMAGE_PROPERTY = damagePopScale(event.DAMAGE_PROPERTY);
        })

        ///Draw line chart
        callback(locationEvents);
    });// end d3.json
}