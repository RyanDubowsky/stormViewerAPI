function clorQuery(params,callback){

	var url = "/storms/clorMap/"+params.eType+"/"+params.startYear+"/"+params.endYear;
	console.log("URL in clorQuery",url);

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
	var stateSumArray=[]
	var unique = true
	d3.json(url,function(err,dataFromServer){
        mapData = dataFromServer.state.rows;

        ///Filter out null data
        locationEvents = mapData.filter(function(event){
            return event.DAMAGE_PROPERTY != null && event.DAMAGE_PROPERTY != "0.00K";
        })

        locationEvents.forEach(function(event){
            event.DAMAGE_PROPERTY = +damagePopScale(event.DAMAGE_PROPERTY);
        })

        //Now sum per state
        usStates.forEach(function(state){
        	stateSumArray.push({state:state.name,damage:0});
        })


        stateSumArray.forEach(function(state){

        	locationEvents.forEach(function(item){
        		if(item.STATE == state.state){
        			if(!isNaN(item.DAMAGE_PROPERTY)){
        				state.damage = state.damage + item.DAMAGE_PROPERTY;
        			}
        		}
        	})
        })




        //console.log("Data in clorMap query", stateSumArray)
		callback(stateSumArray)
    });// end d3.json

}