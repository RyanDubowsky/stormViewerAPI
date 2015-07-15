function countyChorQuery(params,callback){

var url = "/storms/countyChorMap/"+params.startYear+"/"+params.endYear;
console.log("URL in clorQuery",url);

eventTypeArray=["Hail","Thunderstorm Wind","Flood","Flash Flood","Lightning","Heavy Rain","Tornado","All"];

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

//Each object will represent one state/county/event_Type
var stateEventSumArray=[]


d3.json(url,function(err,dataFromServer){

    d3.json("../data/usCounties.json",function(topology){
         var demo = topojson.feature(topology, topology.objects.counties)
        //console.log("new counties",demo);


        demo.features.forEach(function(item){
                eventTypeArray.forEach(function(eType){
                    stateEventSumArray.push({id:item.id,type:eType,damage:0});               
                })
        })


            mapData = dataFromServer.state.rows;

            ///Filter out null data
            locationEvents = mapData.filter(function(event){
                return event.DAMAGE_PROPERTY != null && event.DAMAGE_PROPERTY != "0.00K";
            })


            //Now, need to GROUP BY STATE/COUNTY/EVENT

            //Clean up/format data so that we can use it

            //Make the damage number usable
            //Change from named state to state fips
            //add STATE/COUNTY attribute
            locationEvents.forEach(function(event){
                event.DAMAGE_PROPERTY = +damagePopScale(event.DAMAGE_PROPERTY);
                event.STATE = stateFips[event.STATE];

                //Add leading zeroes where needed
                if(event.CZ_FIPS.length < 3){
                    event.CZ_FIPS = "0" + event.CZ_FIPS
                }
                //merge STATE/COUNTY                
                event.STATECOUNTY = event.STATE + event.CZ_FIPS;
            })


            //stateEventSumArray has 1 row per STATECOUNTY and EVENT_TYPE combo
            //So if we go through each row of data, if STATECOUNTY and EVENT_TYPE match, push it


            locationEvents.forEach(function(event){
                stateEventSumArray.forEach(function(stateCountyEvent){
                    if(event.STATECOUNTY == stateCountyEvent.id && event.EVENT_TYPE == stateCountyEvent.type){
                        if(!isNaN(event.DAMAGE_PROPERTY)){
                            stateCountyEvent.damage = +event.DAMAGE_PROPERTY
                        }
                    }
                    if(event.STATECOUNTY == stateCountyEvent.id && stateCountyEvent.type == "All"){
                        if(!isNaN(event.DAMAGE_PROPERTY)){
                            stateCountyEvent.damage = stateCountyEvent.damage + +event.DAMAGE_PROPERTY
                        }
                    }
                })
            })





            //console.log("final data",stateEventSumArray)







        	callback(stateEventSumArray)
        });// end d3.json
    })

}