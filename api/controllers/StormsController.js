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
		Storms.query('select "DAMAGE_PROPERTY" from stormevents where "DAMAGE_PROPERTY" IS NOT NULL AND "STATE" = \''+"NEW YORK"+'\' AND "YEAR" >= \''+"2005"+'\'order by "DAMAGE_PROPERTY" desc limit 5',null,function(err,data){
			res.json(data);
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

