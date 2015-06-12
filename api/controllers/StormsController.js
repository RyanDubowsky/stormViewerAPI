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
	allEvents:function(req,res){



			Storms.query(
			'select "YEAR","EVENT_TYPE",count(*) from stormevents group by "YEAR","EVENT_TYPE" ORDER BY "YEAR" DESC',
			null,function(err,data){
				res.json({'state' : data});
			})



	},

	mapRoute:function(req,res){
		var state = req.param('state');
		var year = req.param('year');
		var exact = req.param('exact');


		if(exact == "exact"){
			Storms.query('select * from stormevents where "STATE" = \''+state+'\' AND "YEAR" = \''+year+'\'',
						  null,function(err,data){
						  	res.json({'state' : data});
						  })

		}
		else if(exact =="younger"){
			Storms.query('select * from stormevents where "STATE" = \''+state+'\' AND "YEAR" >= \''+year+'\'',
						  null,function(err,data){
				res.json({'state' : data});
			})

		}
		else if(exact == "older"){
			Storms.query('select * from stormevents where "STATE" = \''+state+'\' AND "YEAR" <= \''+year+'\'',
						  null,function(err,data){
				res.json({'state' : data});
			})
		}


	}

};

