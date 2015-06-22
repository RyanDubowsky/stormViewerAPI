    window.brushFilter = [2012,2014];

function chartDraw(data){
	//Draws chart
		//console.log("allevents",data);

	allEventFilter = crossfilter(data),
	allEventChart = dc.barChart("#allEvents"),

	eventDimension = allEventFilter.dimension(function(d){return d.year }),
	eventGroup = eventDimension.group().reduceSum(function(d){ return d.count});

	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);


		allEventChart
		.width(1350)
		.height(150)
		.x(d3.scale.linear().domain([1950,2015]))
		.brushOn(true)
		.dimension(eventDimension)
		.group(eventGroup)
		.title(function(d){return d.x+": "+comma(d.y); })
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)
	//allEventChart.yAxis().ticks();
	allEventChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll();


	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');




	allEventChart.brush().extent([2012,2014])
	dc.redrawAll();

	allEventChart.on("filtered",function(chart,filter){
        dc.events.trigger(function(){
            brushFilter = filter;
            console.log("global var in chartDraw",brushFilter);
        })
    })

}