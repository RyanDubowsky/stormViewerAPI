function barChartDraw(data){
	//Draws bar chart

	//Create crossfilter of data
	allEventFilter = crossfilter(data),
	//Create bar chart
	allEventChart = dc.barChart("#yearChart","barGroup"),

	//Create a dim over year
	eventDimension = allEventFilter.dimension(function(d){return d.year }),
	//Group by year, sum count
	eventGroup = eventDimension.group().reduceSum(function(d){ return d.count});

	//Formatting
	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);

	//Creates the chart
	allEventChart
		.width(1350)
		.height(265)
		.x(d3.scale.linear().domain([1950,2015]))
		.brushOn(true)
		.dimension(eventDimension)
		.group(eventGroup)
		.title(function(d){return d.x+": "+comma(d.y); })
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)

	//Format Y axis
	allEventChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll("barGroup");

	//Modify x axis display
	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');

	//Set initial brush
	allEventChart.brush().extent(brushFilter);
	dc.redrawAll("barGroup");


	//Function to set global filter variable
	function sendFilter(filter){
		brushFilter = filter;
	}

	//Event listener for brush modification
	//Calls function to modify global filter variable
	allEventChart.on("filtered",function(chart,filter){
        dc.events.trigger(function(){
        	sendFilter(filter);
        })
    })





}