function lineChartDraw(data){
	//Draws a series of line charts, summing damags for desired state and event type



	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);





//Goes through every row of data to make them numbers
	data.forEach(function(curRow){
		curRow.YEAR = +curRow.YEAR;
		curRow.DAMAGE_PROPERTY = +curRow.DAMAGE_PROPERTY;
		curRow.CZ_NAME = curRow.CZ_NAME.toUpperCase();
	})

	finalData = data.filter(function(curEvent){
		return !isNaN(curEvent.DAMAGE_PROPERTY);
	})


	var countyCross = crossfilter(finalData)
	var	countySeriesChart = dc.seriesChart("#countyChart","seriesGroup")

	var	yearDim = countyCross.dimension(function(d){return d.YEAR });
	var damageDim = countyCross.dimension(function(d){return d.DAMAGE_PROPERTY});
	var countyDim = countyCross.dimension(function(d){return d.CZ_NAME});

	var dimensionCountyYear = countyCross.dimension(function(d){
		return [d.YEAR,d.CZ_NAME]
	})
	// /'year='+d.YEAR+'county='+d.CZ_FIPS;
	var groupYearCountyDamage = dimensionCountyYear.group().reduceSum(function(d){
		return d.DAMAGE_PROPERTY;
	});


	console.log(groupYearCountyDamage.top(10))


    countySeriesChart
		.width(1350)
		.height(265)
		.chart(function(c) {return dc.lineChart(c) })
        .yAxisLabel("Damage in USD")
	    .elasticX(true)
	    .elasticY(true)
        .renderHorizontalGridLines(true)
        .dimension(dimensionCountyYear,"year")
        .group(groupYearCountyDamage)
		.x(d3.scale.linear().domain([1950,2015]))
        .brushOn(false)
		.colors(d3.scale.category20c())
		.margins({ top: 10, left: 50, right: 30, bottom: 170 })    
	    .seriesAccessor(function(d) {return d.key[1];})
	    .keyAccessor(function(d) {return d.key[0];})
	    .valueAccessor(function(d) {return d.value;})
	    .colorAccessor(function(d) {return d.key[1];})
	    .title(function(d){return "County: " + d.key[1] +"\n"+ d.key[0] + ": $" + comma(d.value)})
	    .legend(dc.legend().x(25).y(130).itemHeight(7).gap(5).horizontal(1).legendWidth(1325).itemWidth(90));


		countySeriesChart.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)

		countySeriesChart.render();

	dc.renderAll("seriesGroup");


	countySeriesChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });



	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');


	dc.renderAll("seriesGroup");

	d3.selectAll(".dc-legend-item").on("mouseover",function(d){})
	d3.selectAll(".dc-legend-item").on("mouseout",function(d){})
	d3.selectAll(".dc-legend-item").on("click",function(d){
		//If its already highlighted, reset the chart
		//Attempting to allow to add/remove things NOT FUNCTIONAL ATM, CANNOT TOGGLE
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