function queryDb(params){

	var mapData;
	var locationEvents;
	var state = params.state;
	var beginYear = params.year;

    var url = "http://localhost:1337/storms/mapRoute/"+state+"/"+beginYear;
    console.log("URL in query function:",url);





    d3.json(url,function(err,dataFromServer){
        //console.log('data',data[0],data.length)
        //console.log(data);
        console.log("hello");
        //console.log(dataFromServer.state.rows);
        mapData = dataFromServer.state.rows;
        locationEvents = mapData.filter(function(event){
            return event.BEGIN_LAT != null && event.BEGIN_LON != null && event.DAMAGE_PROPERTY != null && event.DAMAGE_CROPS != null && event.YEAR != null;
        })

        //Change damage numbers to proper form before sending the data along
        locationEvents.forEach(function(event){
            event.DAMAGE_PROPERTY = damagePopScale( event.DAMAGE_PROPERTY);
            event.DAMAGE_CROPS = damagePopScale(event.DAMAGE_CROPS);
        })


        drawMap(locationEvents,beginYear);
	    crossData(locationEvents,beginYear);



    });// end d3.json




}