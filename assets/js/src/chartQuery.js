function chartQuery(params,callback){
	var mapData; //1st Process of data from DB
	var locationEvents; //Filtered out null-years
	var talliedEvents = []; //Summed all types for each year
	var barEvents; //Filters out for type
	var finalBarEvents = []; //Process barEvents to work nice with charts

    var url = "http://localhost:1337/storms/chartEvents/"+params.state+"/"+params.eType


    console.log("URL in chartQuery function:",url);




    d3.json(url,function(err,dataFromServer){
        mapData = dataFromServer.state.rows;
        locationEvents = mapData.filter(function(event){
            return event.YEAR != null;
        })




        var curYear = 0;

        if(params.eType=="All"){
            for(var i=1950; i<2015; i++){
                locationEvents.forEach(function(entry){
                    if(entry.YEAR == i){
                        curYear = curYear + +entry.count;
                    }

                });
                talliedEvents.push({year:i,count:curYear});
            }
        }else{
            //Filters for type
            barEvents = locationEvents.filter(function(barEvent){
                return barEvent.EVENT_TYPE == params.eType;
            });

            barEvents.forEach(function(bEvent){
                finalBarEvents.push({year:bEvent.YEAR,count:bEvent.count});
            })
        }


    if(params.eType == "All"){
    	//console.log("query log of tallied chart events",talliedEvents);
    	callback(talliedEvents);
    }
    else{
    	//console.log("query log of one type chart events ",finalBarEvents);
    	callback(finalBarEvents);
    }

    });// end d3.json





	//Returns Json of chart Data
}