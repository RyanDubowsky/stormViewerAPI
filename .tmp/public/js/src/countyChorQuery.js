function countyChorQuery(params,callback){

var url = "/storms/countyChorMap/"+params.startYear+"/"+params.endYear;
console.log("URL in clorQuery",url);
console.time("first");
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


        var theObj = {}
        //I want an object where key = id + type
        demo.features.forEach(function(item){
                eventTypeArray.forEach(function(eType){

                    theObj[item.id + eType] = {damage:0};
                    // stateEventSumArray.push(theObj);               
                })
        })
        //console.log(theObj);

            mapData = dataFromServer.state.rows;

            ///Filter out null data
            stateEventSumArray = mapData.filter(function(event){
                //Filters out new rows, passes it all to map function
                return event.DAMAGE_PROPERTY != null && event.DAMAGE_PROPERTY != "0.00K";
            }).map(function(event){
                //Map function creates the statecounty thing and new object, sends it to the last map
                if(event.CZ_FIPS.length < 3){
                    event.CZ_FIPS = "0" + event.CZ_FIPS
                }
                return{
                    STATECOUNTY: stateFips[event.STATE] + event.CZ_FIPS,
                    DAMAGE_PROPERTY: +damagePopScale(event.DAMAGE_PROPERTY),
                    EVENT_TYPE: event.EVENT_TYPE
                };
            }).reduce(function(newDataObject,curEvent){
                //Want to reduce from 1 event per year per type county
                //To 1 event per type county

                //If current event countyType = newDataObject[countyType]
                //Add damages
                var curCountyEvent = curEvent.STATECOUNTY + curEvent.EVENT_TYPE;
                //console.log(curCountyEvent)
                if(theObj[curCountyEvent] != null){
                    //console.log("we made it");
                    if(!isNaN(curEvent.DAMAGE_PROPERTY)){
                        theObj[curCountyEvent].damage = +theObj[curCountyEvent].damage + +curEvent.DAMAGE_PROPERTY
                    }
                }

                var curAll = curEvent.STATECOUNTY + "All"
                if(theObj[curAll] != null){
                    if(!isNaN(curEvent.DAMAGE_PROPERTY)){
                        theObj[curAll].damage = +theObj[curAll].damage + +curEvent.DAMAGE_PROPERTY
                    }
                }

            },theObj)

console.log(theObj);

//I have X number items for each state/county/event
//I want to reduce 


            //Now, need to GROUP BY STATE/COUNTY/EVENT

            //Clean up/format data so that we can use it

            //Make the damage number usable
            //Change from named state to state fips
            // //add STATE/COUNTY attribute
            // locationEvents.forEach(function(event){
        

            // //stateEventSumArray has 1 row per STATECOUNTY and EVENT_TYPE combo
            // //So if we go through each row of data, if STATECOUNTY and EVENT_TYPE match, push it
            //     stateEventSumArray.forEach(function(stateCountyEvent){
            //         if(event.STATECOUNTY == stateCountyEvent.id && event.EVENT_TYPE == stateCountyEvent.type){
            //             if(!isNaN(event.DAMAGE_PROPERTY)){
            //                 stateCountyEvent.damage = +event.DAMAGE_PROPERTY
            //             }
            //         }
            //         if(event.STATECOUNTY == stateCountyEvent.id && stateCountyEvent.type == "All"){
            //             if(!isNaN(event.DAMAGE_PROPERTY)){
            //                 stateCountyEvent.damage = stateCountyEvent.damage + +event.DAMAGE_PROPERTY
            //             }
            //         }
            //     })



            // })






            //console.log("final data",stateEventSumArray)





            console.timeEnd("first");

        	//callback(stateEventSumArray)
        });// end d3.json
    })

}