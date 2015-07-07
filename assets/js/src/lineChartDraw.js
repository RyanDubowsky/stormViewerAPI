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

// damageDim.filter([1000,Infinity]);



// groupByCounty = countyDim.group();

var dimensionCountyYear = countyCross.dimension(function(d){
	return [d.YEAR,d.CZ_NAME]
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
		.height(265)
		.chart(function(c) {return dc.lineChart(c) })
        .yAxisLabel("Damage in USD")
	    .elasticX(true)
	    .elasticY(true)
        //.renderHorizontalGridLines(true)
        .dimension(dimensionCountyYear,"year")
        .group(groupYearCountyDamage)
		.x(d3.scale.linear().domain([1950,2015]))
        .brushOn(false)

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




	countySeriesChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll("seriesGroup");


	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');
	d3.selectAll('legend text').attr('text','hello');
	dc.redrawAll("seriesGroup");

//READ ME
//ATEMPTING TO HIGHLIGHT BY COUNTY NAME, NOT BY COLOR

//Need to somehow select the single chart
//Chart name is gathered from legend item click event
//change that chart to highlight
//change the rest to fade

//div countyChart
	//svg width 1350
		//g
			//g class sub = XXXX
				//g class = chart body
					//g class = stack list
						// g class = stack 0
							//g class = line highlight (OR FADE)



d3.selectAll(".dc-legend-item").on("mouseover",function(d){countySeriesChart.legendHighlight(d);});//THIS IS WHERE MAP FILTER FUNCTION WILL GO});
//d3.selectAll(".dc-legend-item").on("mouseover",function(d){})
d3.selectAll(".dc-legend-item").on("mouseout",function(d){})
d3.selectAll(".dc-legend-item").on("click",function(d){
	var demo = d3.select(this); 
	console.log(demo[0][0])
	console.log(d);
	//console.log(countySeriesChart.seriesAccessor(demo[0][0]));
})
}//d3.select(this).classed('highlight',true)