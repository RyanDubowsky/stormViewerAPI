function lineChartQuery(params,callback){
	var mapData; //1st Process of data from DB
	var locationEvents; //Filtered out null-years
	var talliedEvents = []; //Summed all types for each year
	var barEvents; //Filters out for type
	var finalLineEvents = []; //Process barEvents to work nice with charts

    var url = "/storms/lineChart/"+params.state+"/"+params.eType


    console.log("URL in chartQuery function:",url);




    d3.json(url,function(err,dataFromServer){
        mapData = dataFromServer.state.rows;

        locationEvents = mapData.filter(function(event){
            return event.DAMAGE_PROPERTY != null && event.DAMAGE_PROPERTY != "0.00K";
        })

        console.log(locationEvents);


    });// end d3.json





	//Returns Json of chart Data
}