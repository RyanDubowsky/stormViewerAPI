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
	chartEvents:function(req,res){
		var state = req.param('state');
		var type  = req.param('type');

			Storms.query(
			'select "YEAR","EVENT_TYPE",count(*) from stormevents where "STATE" = \''+state+'\' AND "EVENT_TYPE" = \''+type+'\' group by "YEAR","EVENT_TYPE" ORDER BY "YEAR" DESC',
			null,function(err,data){
						res.json({'state' : data});

			})



	},

	mapEvents:function(req,res){
		var state = req.param('state');
		var type = req.param('type');
		var startYear = req.param('startYear');
		var endYear = req.param('endYear');



				Storms.query('select "BEGIN_LAT","BEGIN_LON","YEAR","EVENT_TYPE","DAMAGE_PROPERTY","DAMAGE_CROPS","CZ_NAME","BEGIN_DATE_TIME","EVENT_ID" from stormevents WHERE "EVENT_TYPE" = \''+type+'\' AND "STATE" = \''+state+'\' AND "YEAR" >= \''+startYear+'\' AND "YEAR" <= \''+endYear+'\'',
					null,function(err,data){
						res.json({'state' : data});
					})

	}

};

