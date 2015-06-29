

function lineComposite(data){
	//Draws chart
		//console.log("allevents",data);

		
	console.log("in composite chart",data);
	allEventFilter = crossfilter(data),
	countyDamageChart = dc.compositeChart("#countyChart"),

	eventDimension = allEventFilter.dimension(function(d){return d.YEAR }),
	eventGroup = eventDimension.group().reduceSum(function(d){ return d.DAMAGE_PROPERTY});

	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);


	countyDamageChart
		.width(1350)
		.height(150)
		.x(d3.scale.linear().domain([1950,2015]))
        .yAxisLabel("The Y Axis")
		.dimension(eventDimension)
		.group(eventGroup)
        .renderHorizontalGridLines(true)
        .brushOn(false)
        .render();

	countyDamageChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll();


	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');


	dc.redrawAll();






}