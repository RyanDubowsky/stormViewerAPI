/**
 * StormsController
 *
 * @description :: Server-side logic for managing storms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req,res){
		res.view();
	},
	barChart:function(req,res){
		var state = req.param('state');
		var type  = req.param('type');

		var queryBase = 'select "YEAR","EVENT_TYPE",count(*) from stormevents'
		var queryEnd = ' group by "YEAR","EVENT_TYPE" ORDER BY "YEAR" DESC'
		var queryState; // May be all states
		var queryType; // May be all types
		var finalQuery;

		//If state is all, compare to wildcard
		if(state == "All"){
			queryState = ' where "STATE" LIKE \''+"%"+'\''
		}
		else{
			queryState = ' where "STATE" = \''+state+'\''
		}
		//Type is last param. If it is all, simply do not include
		if(type == "All"){
			queryType = '';
		}
		else{
			queryType =  ' AND "EVENT_TYPE" = \''+type+'\''
		}

		//Base + state param + type param + end`
		finalQuery = queryBase + queryState + queryType + queryEnd;

		//console.log(finalQuery);
		Storms.query(finalQuery,null,function(err,data){
			res.json({'state' : data});
		})

	},

	mapEvents:function(req,res){
		var state = req.param('state');
		var type = req.param('type');
		var startYear = req.param('startYear');
		var endYear = req.param('endYear');

		var queryBase = 'select "BEGIN_LAT","BEGIN_LON","YEAR","EVENT_TYPE","DAMAGE_PROPERTY","DAMAGE_CROPS","CZ_NAME","BEGIN_DATE_TIME","EVENT_ID" from stormevents';
		var queryState = ' WHERE "STATE" = \''+state+'\' AND ';
		var queryType; //May be all types
		var queryYear =  ' AND "YEAR" >= \''+startYear+'\' AND "YEAR" <= \''+endYear+'\'';
		var queryEnd = ' AND "BEGIN_LAT" IS NOT NULL AND "BEGIN_LON" IS NOT NULL AND "DAMAGE_PROPERTY" IS NOT NULL AND "DAMAGE_CROPS" IS NOT NULL'
		var finalQuery;

		//If type is all, compare to wildcard
		if(type == "All"){
			queryType = '"EVENT_TYPE" LIKE \''+"%"+'\''
		}
		else{
			queryType = '"EVENT_TYPE" = \''+type+'\''
		}

		//Base + State param + type Param + year range + lat/long null check
		finalQuery = queryBase + queryState + queryType + queryYear + queryEnd;

		//console.log(finalQuery);
		Storms.query(finalQuery,null,function(err,data){
				res.json({'state' : data});
			})

	},
	lineChart:function(req,res){
		var state = req.param('state');
		var type  = req.param('type');

		var queryBase = 'select "YEAR","CZ_FIPS","DAMAGE_PROPERTY" from stormevents';
		var queryEnd = ' ORDER BY "YEAR" DESC';
		var queryState = ' where "STATE" = \''+state+'\'';
		var queryType; // May be all types
		var finalQuery;

		//Type is last param. If it is all, simply do not include
		if(type == "All"){
			queryType = '';
		}
		else{
			queryType =  ' AND "EVENT_TYPE" = \''+type+'\''
		}

		//Base + state param + type param + end
		finalQuery = queryBase + queryState + queryType + queryEnd;

		console.log(finalQuery);
		Storms.query(finalQuery,null,function(err,data){
			res.json({'state' : data});
		})

	}

};

