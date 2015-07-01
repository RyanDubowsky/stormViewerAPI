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
		curRow.CZ_FIPS = +curRow.CZ_FIPS;
	})

	finalData = data.filter(function(curEvent){
		return !isNaN(curEvent.DAMAGE_PROPERTY);
	})


	var countyCross = crossfilter(finalData)
	var	countySeriesChart = dc.seriesChart("#countyChart","seriesGroup")

	var	yearDim = countyCross.dimension(function(d){return d.YEAR });
	var damageDim = countyCross.dimension(function(d){return d.DAMAGE_PROPERTY});
	var countyDim = countyCross.dimension(function(d){return d.CZ_FIPS});

// damageDim.filter([1000,Infinity]);



// groupByCounty = countyDim.group();

var dimensionCountyYear = countyCross.dimension(function(d){
	return [d.YEAR,d.CZ_FIPS]
})
// /'year='+d.YEAR+'county='+d.CZ_FIPS;
var groupYearCountyDamage = dimensionCountyYear.group().reduceSum(function(d){
	return d.DAMAGE_PROPERTY;
});

// groupYearCountyDamage.forEach(function(dummy){
// 	console.log(dummy);
// })

console.log(groupYearCountyDamage.top(10))


    countySeriesChart
		.width(1350)
		.height(150)
		.chart(function(c) {return dc.lineChart(c) })
        .yAxisLabel("Total Damages in USD")
        .xAxisLabel("Year")
	    .elasticX(true)
	    .elasticY(true)
        //.renderHorizontalGridLines(true)
        .dimension(dimensionCountyYear,"year")
        .group(groupYearCountyDamage)
		.x(d3.scale.linear().domain([1950,2015]))
        .brushOn(false)
	    .seriesAccessor(function(d) {return d.key[1];})
	    .keyAccessor(function(d) {return d.key[0];})
	    .valueAccessor(function(d) {return d.value;})
	    .colors(d3.scale.category20())
	    .title(function(d){return d.key[0] + ": $" + comma(d.value)})
	    .legend(dc.legend().x(1250).y(-20).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));

		countySeriesChart.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)

		countySeriesChart.render();





	countySeriesChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll("seriesGroup");


	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');

	dc.redrawAll("seriesGroup");
}