function allEvents(data){
	console.log(data);
		var width = "100%",
			height = "20%",
			allEventFilter = crossfilter(data),
			allEventChart = dc.barChart("#allEventChart"),

			eventDimension = allEventFilter.dimension(function(d){return d.YEAR }),
			eventGroup = eventDimension.group().reduceCount();

		allEventChart
		.width(1500)
		.height(90)
		.x(d3.scale.linear().domain([1950,2014]))
		.brushOn(false)
		.xAxisLabel("Year")
		.yAxisLabel("Number of Events")
		.dimension(eventDimension)
		.group(eventGroup)
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950);

	dc.renderAll();

	d3.selectAll('.x text').attr('transform','rotate(70)').attr('dx','20');



}

