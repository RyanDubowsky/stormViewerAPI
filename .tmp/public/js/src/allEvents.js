function allEvents(data){
	console.log("allevents",data);

	allEventFilter = crossfilter(data),
	allEventChart = dc.barChart("#allEvents"),

	eventDimension = allEventFilter.dimension(function(d){return d.year }),
	eventGroup = eventDimension.group().reduceSum(function(d){ return totalEventScale(d.count)});

    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([1,1000]);


		allEventChart
		.width(1350)
		.height(150)
		.x(d3.scale.linear().domain([1950,2015]))
		.brushOn(false)
		.dimension(eventDimension)
		.group(eventGroup)
		.title(function(d){return d.x+": "+comma(totalEventScale.invert(d.y)); })
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)
	allEventChart.yAxis().ticks(4);

	dc.renderAll();


	d3.selectAll('.x text').attr('transform','rotate(65)').attr('dx','20');








}

