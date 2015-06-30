function lineChartQuery(params,callback){
	var mapData; //1st Process of data from DB
	var locationEvents; //Filtered out null-years
	var talliedEvents = []; //Summed all types for each year
	var barEvents; //Filters out for type
	var finalLineEvents = []; //Process barEvents to work nice with charts

    var url = "/storms/lineChart/"+params.state+"/"+params.eType


    console.log("URL in chartQuery function:",url);


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


    d3.json(url,function(err,dataFromServer){
        mapData = dataFromServer.state.rows;

        locationEvents = mapData.filter(function(event){
            return event.DAMAGE_PROPERTY != null && event.DAMAGE_PROPERTY != "0.00K" ;
        })

        locationEvents.forEach(function(event){
            event.DAMAGE_PROPERTY = damagePopScale(event.DAMAGE_PROPERTY);
        })









        //console.log(locationEvents);
        callback(locationEvents);
    });// end d3.json





	//Returns Json of chart Data
}