function lineChartDraw(data){
	//Draws line charts
	//console.log("in individual",data);

	var curLine; // Current Line Chart
	var lineChartArray=[]; //Line Chart Array
	var fipsArray = []; // Array of unique fips for this query
	var unique = true // Boolean for finding unique fips



	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);


//Goes through every row of data to gather unique fips ID for this query
	data.forEach(function(curRow){
		curRow.YEAR = +curRow.YEAR;
		curRow.DAMAGE_PROPERTY = +curRow.DAMAGE_PROPERTY;
		curRow.CZ_FIPS = +curRow.CZ_FIPS;

		fipsArray.forEach(function(fipsCode){
			if(curRow.CZ_FIPS == fipsCode){
				unique = false;
			}
		})

		if(unique){
			fipsArray.push(curRow.CZ_FIPS);
		}

		unique = true;
	})

	finalData = data.filter(function(curEvent){
		return !isNaN(curEvent.DAMAGE_PROPERTY);
	})


	var countyCross = crossfilter(finalData)
	var	countyCompositeChart = dc.compositeChart("#countyChart")

	var	yearDim = countyCross.dimension(function(d){return d.YEAR });
	var damageDim = countyCross.dimension(function(d){return d.DAMAGE_PROPERTY});
	var countyDim = countyCross.dimension(function(d){return d.CZ_FIPS});

// damageDim.filter([1000,Infinity]);



// groupByCounty = countyDim.group();







	var curChart;
	var curGroup;



		//fipsArray.forEach(function(uniqueFips){
			curChart = dc.lineChart(countyCompositeChart);

			countyDim.filter(29)
			curGroup = yearDim.group().reduceSum(function(d){return d.DAMAGE_PROPERTY });




			curGroup.top(Infinity).forEach(function(p,i){
				console.log(p);
			})
			curChart
				.dimension(yearDim)
				.group(curGroup)
				.width(1350)
				.height(150)
        		.renderHorizontalGridLines(true)

				lineChartArray.push(curChart);

				// curChart = null;
				// curGroup = null;
				// yearDim.filterAll();

		//})






    countyCompositeChart
		.width(1350)
		.height(150)
        .yAxisLabel("Total Damages in USD")
        .xAxisLabel("Year")
        .renderHorizontalGridLines(true)
        .dimension(yearDim)
		.x(d3.scale.linear().domain([1950,2015]))
        .brushOn(false)
        .compose(lineChartArray)
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)






	countyCompositeChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll();


	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');

	dc.redrawAll();






}