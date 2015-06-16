function allEventsQuery(type){

	var mapData;
	var locationEvents;

    var url = "http://localhost:1337/storms/allEvents";
    console.log("URL in all events query function:",url);




    d3.json(url,function(err,dataFromServer){
        //console.log('data',data[0],data.length)
        //console.log(data);
        console.log("hello");
        //console.log(dataFromServer.state.rows);
        mapData = dataFromServer.state.rows;
        locationEvents = mapData.filter(function(event){
            return event.YEAR != null;
        })



        var talliedEvents = [];
        var curYear = 0;
        //console.log(locationEvents[0].count);

        if(type=="All"){
            for(var i=1950; i<2015; i++){
                locationEvents.forEach(function(entry){

                    if(entry.YEAR == i){
                        //console.log(entry.count)
                        curYear = curYear + +entry.count;
                    }

                });
                talliedEvents.push({year:i,count:curYear});
                //console.log(curYear);
            }


            console.log("talliedEvents",talliedEvents);
            allEvents(talliedEvents);
        }else{
            var barEvents;
            barEvents = locationEvents.filter(function(barEvent){
                return barEvent.EVENT_TYPE == type;
            });

            barEvents.forEach(function(bEvent){
                talliedEvents.push({year:bEvent.YEAR,count:bEvent.count});


            })




            console.log("barEvents",talliedEvents)
            allEvents(talliedEvents);



        }

    });// end d3.json




}