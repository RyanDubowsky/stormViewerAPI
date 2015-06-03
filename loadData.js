
var Converter=require("csvtojson").core.Converter;
var fs=require("fs");
var request = require('superagent');
console.log('starting');
//var csvFileName="allStormEventsZips.json";
var csvFileName="./csv/newStormEvents2004.csv";
var fileStream=fs.createReadStream(csvFileName);
//new converter instance
var csvConverter=new Converter({constructResult:true});


//end_parsed will be emitted once parsing finished
csvConverter.on("end_parsed",function(jsonObj){
   //console.log('data loaded',jsonObj[0]); //here is your result json object
   //console.log("s",jsonObj[0]);
   	var start = 4664,
   		finish = 12000;
   		//(Object.keys(jsonObj).length)/2 
   	console.log("Starting outside for loop. Initial start: ",start,"Total number of elements: ",Object.keys(jsonObj).length);
   	console.log("");
   	//for(var j = start; j<finish; j+=999){

	   //console.log("Starting. Total number of elements: ",Object.keys(jsonObj).length);
	   	// console.log("Starting inner for loop. Current start: ",j);
	   	// console.log("Last Element of this pass: ",(j+998));

	 	for(var i = start; i < finish; i++){

	 		//console.log(jsonObj[Object.keys(jsonObj)[i]]);
			request
			  .post('http://localhost:1337/stormevents')
			  .send(jsonObj[Object.keys(jsonObj)[i]])
			  .set('Accept', 'application/json')
			  .timeout(0)
			  .end(function(error, res, body){
			  		if(error){
			    		console.log('err',error);
			    	}
			    	//console.log(res.body)
			  });
	 		if(i === finish-1){
	 			console.log('finished. Last element posted is:', jsonObj[Object.keys(jsonObj)[i]])
	 		}
	 	}  
	 	
	 	// console.log("End of pass");
	 	// console.log("");
	//}
console.log("End of whole thing");

});

fileStream.pipe(csvConverter);

//newStormEvents2004.csv

// jsonfile (npm install json file)