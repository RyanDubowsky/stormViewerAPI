function mapQuery(params,callback){
	
	var mapData; //Proccesses damage numbers so they can play nice with rest of app

    var url = "/storms/mapEvents/"+params.state+"/"+params.eType+"/"+params.startYear+"/"+params.endYear;
    console.log("URL in map query function:",url);

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

        //Change damage numbers to proper form before sending the data along
        mapData.forEach(function(event){
            event.DAMAGE_PROPERTY = damagePopScale( event.DAMAGE_PROPERTY);
            event.DAMAGE_CROPS = damagePopScale(event.DAMAGE_CROPS);
        }) 

        //console.log("query log of map data",mapData);
   		callback(mapData);
    });// end d3.json

}