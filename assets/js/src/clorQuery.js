function clorQuery(params,callback){

	var url = "/storms/clorMap/"+params.eType+"/"+params.startYear+"/"+params.endYear;
	console.log("URL in clorQuery",url);

        eventTypeArray=["Hail","Thunderstorm Wind","Flood","Flash Flood","Lightning","Heavy Rain","Tornado"];

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
	var stateEventSumArray=[]
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
        //Going to sum per event type, then sum per state in draw function
        usStates.forEach(function(state){
        	eventTypeArray.forEach(function(eType){
        		stateEventSumArray.push({state:state.name,type:eType,damage:0});
        	})

        })


        stateEventSumArray.forEach(function(stateEvent){

        	locationEvents.forEach(function(item){
        		if(item.STATE == stateEvent.state && item.EVENT_TYPE == stateEvent.type){
        			if(!isNaN(item.DAMAGE_PROPERTY)){
        				stateEvent.damage = stateEvent.damage + item.DAMAGE_PROPERTY;
        			}
        		}
        	})

        })


        //Sum per State and Event Type combo



        //console.log(locationEvents)
        //console.log(eventTypeArray);
        //console.log(stateEventSumArray);


        //console.log("Data in clorMap query", stateSumArray)
		callback(stateEventSumArray)
    });// end d3.json

}