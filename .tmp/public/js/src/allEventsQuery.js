function allEventsQuery(){

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


        //console.log(talliedEvents);
        allEvents(talliedEvents);
    });// end d3.json




}