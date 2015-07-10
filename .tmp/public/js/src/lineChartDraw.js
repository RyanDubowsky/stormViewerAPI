function lineChartDraw(data){
	//Draws a series of line charts, summing damags for desired state and event type


	//Formatting
	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);





	//Goes through every row of data to make them numbers
	//Changes all counties to all upper case
	data.forEach(function(curRow){
		curRow.YEAR = +curRow.YEAR;
		curRow.DAMAGE_PROPERTY = +curRow.DAMAGE_PROPERTY;
		curRow.CZ_NAME = curRow.CZ_NAME.toUpperCase();
	})

	//Filters out null rows
	finalData = data.filter(function(curEvent){
		return !isNaN(curEvent.DAMAGE_PROPERTY);
	})

	// Create crossfilter of the data
	var countyCross = crossfilter(finalData)
	//Create the series chart
	var	countySeriesChart = dc.seriesChart("#countyChart","seriesGroup")


	//Create a dimension on year AND name
	var dimensionCountyYear = countyCross.dimension(function(d){
		return [d.YEAR,d.CZ_NAME]
	})
	//Group by year/name dimension, sum by damage
	var groupYearCountyDamage = dimensionCountyYear.group().reduceSum(function(d){
		return d.DAMAGE_PROPERTY;
	});

	//Creating the chart
    countySeriesChart
		.width(1350)
		.height(265)
		.chart(function(c) {return dc.lineChart(c) }) //Each county is a line chart
        .yAxisLabel("Damage in USD")
	    .elasticX(true)
	    .elasticY(true)
        .renderHorizontalGridLines(true)
        .dimension(dimensionCountyYear,"year") //X axis is year portion of our Dim
        .group(groupYearCountyDamage)
		.x(d3.scale.linear().domain([1950,2015]))
        .brushOn(false)
		.colors(d3.scale.category20())
		.margins({ top: 10, left: 50, right: 30, bottom: 170 })    
	    .seriesAccessor(function(d) {return d.key[1];})
	    .keyAccessor(function(d) {return d.key[0];})
	    .valueAccessor(function(d) {return d.value;})
	    .colorAccessor(function(d) {return d.key[1];})
	    .title(function(d){return "County: " + d.key[1] +"\n"+ d.key[0] + ": $" + comma(d.value)})
	    .legend(dc.legend().x(25).y(130).itemHeight(7).gap(5).horizontal(1).legendWidth(1325).itemWidth(90));

	    //Format X Axis
		countySeriesChart.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)


	dc.renderAll("seriesGroup");

	//Format Y axis
	countySeriesChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });


	//Modify x axis label display
	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');
	dc.redrawAll("seriesGroup");

	//Override existing mouse events
	d3.selectAll(".dc-legend-item").on("mouseover",function(d){})
	d3.selectAll(".dc-legend-item").on("mouseout",function(d){})

	//Toggle legend is not part of a series chart
	//Manually created a similar function
	//Legend functions also sort/display by color, which does not work here due to sharing colors
	//Need to manually find the desired county

	//If a county is already selected, clicking will reset
	//Otherwise, adds a county to the highlighted ones
	d3.selectAll(".dc-legend-item").on("click",function(d){
		//If its already highlighted, reset the chart
		if(d.chart.g().selectAll('path.line, path.area').classed("highlight")){
				countySeriesChart.legendReset();
		}
		else{
			//If not highlighted, fade out everything else
			//Highlight this one
			countySeriesChart.g().selectAll('path.line, path.area').classed("fadeout",true);
			d.chart.g().selectAll('path.line, path.area').classed("highlight",true);
		}
	})
}