function barChartQuery(params,callback){
	var mapData; //1st Process of data from DB
	var locationEvents; //Filtered out null-years
	var talliedEvents = []; //Summed all types for each year
	var barEvents; //Filters out for type
	var finalBarEvents = []; //Process barEvents to work nice with charts

    var url = "/storms/barChart/"+params.state+"/"+params.eType

    //Queries the DB for data
    //Does modification and post-processing to prepare for charting
    d3.json(url,function(err,dataFromServer){
        mapData = dataFromServer.state.rows;

        //Filter out null years
        locationEvents = mapData.filter(function(event){
            return event.YEAR != null;
        })

        var curYear = 0;

        //Tallies events per year, if all event types are to be included
        if(params.eType=="All"){
            for(var i=1950; i<2015; i++){
                locationEvents.forEach(function(entry){
                    if(entry.YEAR == i){
                        curYear = curYear + +entry.count;
                    }

                });
                talliedEvents.push({year:i,count:curYear});
            }
        }
        //Otherwise, already in correct buckets, just filter for type
        else{
            //Filters for type
            barEvents = locationEvents.filter(function(barEvent){
                return barEvent.EVENT_TYPE == params.eType;
            });

            barEvents.forEach(function(bEvent){
                finalBarEvents.push({year:bEvent.YEAR,count:bEvent.count});
            })
        }
        //Send appropriate event array depending on parameter
        if(params.eType == "All"){
        	callback(talliedEvents);
        }
        else{
        	callback(finalBarEvents);
        }

    });// end d3.json
}