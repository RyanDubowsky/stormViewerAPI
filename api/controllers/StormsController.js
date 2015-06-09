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

	byState:function(req,res){
		var state = req.param('state');
		Storms.query('select * from stormevents where "STATE" = \''+state+'\'',null,function(err,data){
			res.json({'state' : data});
		})
		
	},

	mapRoute:function(req,res){
		var state = req.param('state');
		var year = req.param('year');
		Storms.query('select * from stormevents where "STATE" = \''+state+'\' AND "YEAR" >= \''+year+'\'',null,function(err,data){
			res.json({'state' : data});
		})
	}

};

