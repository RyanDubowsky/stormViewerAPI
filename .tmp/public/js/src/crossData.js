
function crossData(data,beginYear){


	var width = 380,
		height = 380,
		startYear = beginYear,
		endYear = 2015,
		stormFilter = crossfilter(data),
		yearChart = dc.barChart("#yearChart"),
		yearDamageChart = dc.barChart('#yearDamageChart'),
		eventTypeChart = dc.barChart('#eventTypeChart'),
		regionChart = dc.barChart('#regionChart');

	var	damageAxisFormat = d3.format("$.3s")





	var yearDimension = stormFilter.dimension(function(d){return d.YEAR }),
		yearGroup = yearDimension.group().reduceCount();
		
	var yearPropDamageGroup = yearDimension.group().reduceSum(function(d){ return d.DAMAGE_PROPERTY });
		
	var eventTypeDimension = stormFilter.dimension(function(d){ return d.EVENT_TYPE }),
		eventTypeGroup = eventTypeDimension.group().reduceCount();
		
	var regionDimension = stormFilter.dimension(function(d){ return d.CZ_NAME }),
		regionGroup = regionDimension.group().reduceCount();

	yearChart
		.width(width)
		.height(height)
		.x(d3.scale.linear().domain([startYear,endYear]))
		.brushOn(false)
		.xAxisLabel("Year")
		.yAxisLabel("Enrollment")
		.dimension(yearDimension)
		.group(yearGroup)
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-startYear);

	yearDamageChart
		.width(width)
		.height(height)
		.x(d3.scale.linear().domain([startYear,endYear]))
		.brushOn(false)
		.xAxisLabel("Year")
		.yAxisLabel("Property Damage")
		.dimension(yearDimension)
		.group(yearPropDamageGroup)
		.title(function(d){return d.x+": "+damageAxisFormat(d.y).replace("G","B"); })
		.xAxis()
			.tickFormat(d3.format("d"))
			.ticks(2015-startYear);


		var yearDamageChartYAxis = yearDamageChart.yAxis().tickFormat(function(d) { return damageAxisFormat(d).replace("G","B"); });


	eventTypeChart
		.width(width)
		.height(height)
		.x(d3.scale.ordinal())
		.colors(d3.scale.category20().range())
		.xUnits(dc.units.ordinal)
		.brushOn(false)
		.xAxisLabel("Event Type")
		.yAxisLabel("Count")
		.dimension(eventTypeDimension)
		.group(eventTypeGroup)

	regionChart
		.width(width)
		.height(height)
		.x(d3.scale.ordinal())
		.colors(d3.scale.category20().range())
		.xUnits(dc.units.ordinal)
		.brushOn(false)
		.xAxisLabel("Region")
		.yAxisLabel("Count")
		.dimension(regionDimension)
		.group(regionGroup)		

	dc.renderAll();

	d3.selectAll('.x text').attr('transform','rotate(70)').attr('dx','20');

}