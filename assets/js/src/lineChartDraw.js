function lineChartDraw(data){
	//Draws chart
		//console.log("allevents",data);
	console.log("in individual",data);

	var curLine; // Current Line Chart
	var lineChartArray=[]; //Line Chart Array
	var fipsArray = []; // Array of unique fips for this query
	var unique = true // Boolean for finding unique fips
	var countyDamage = []; // Array to hold json of county and damage aggregates
	var curAggDamage = 0; //Current aggregation

//Goes through every row of data to gather unique fips ID for this query
	data.forEach(function(curRow){

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
	//console.log(fipsArray)






	countyFilter = crossfilter(data),
	countyChart = dc.compositeChart("#countyChart"),

	countyDimension = countyFilter.dimension(function(d){return +d.YEAR }),
	countyGroup = countyDimension.group().reduceCount(function(d){ return +d.DAMAGE_PROPERTY});


		fipsArray.forEach(function(uniqueFips){
			curChart = dc.lineChart(countyChart);

			curChart
				.dimension(countyDimension)
				.group(countyGroup)

				lineChartArray.push(curChart);

		})

	var	damageAxisFormat = d3.format(".2s")
    var comma = d3.format(",f");
    var totalEventScale = d3.scale.sqrt()
	    .domain([0,1000000])
	    .range([0,1000]);


		countyChart
		.width(1350)
		.height(150)
		.x(d3.scale.linear().domain([1950,2015]))
		.dimension(countyDimension)
		.group(countyGroup)
		.compose(lineChartArray)
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-1950)
	//allEventChart.yAxis().ticks();
	countyChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });
	dc.renderAll();


	d3.selectAll('.x text').attr('transform','rotate(35)').attr('dx','20');

	dc.redrawAll();






}