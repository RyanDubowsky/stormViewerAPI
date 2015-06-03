
function crossData(data){


	var width = 380,
		height = 380,

		startYear = 2000,
		endYear = 2014,

		millionFormat = d3.format(".3s"),
		thousands = d3.format(","),

		stormFilter = crossfilter(data),

		yearChart = dc.barChart("#yearChart"),
		eventTypeChart = dc.barChart('#eventTypeChart'),
		regionChart = dc.barChart('#regionChart'),
		yearDamageChart = dc.barChart('#yearDamageChart');
	

	var yearDimension = stormFilter.dimension(function(d){ return d.BEGIN_DATE.substr(-4) }),
		yearGroup = yearDimension.group().reduceCount(),
		yearPropDamageGroup = yearDimension.group().reduceSum(function(d){ return d.DAMAGE_PROPERTY_NUM; }),
		eventTypeDimension = stormFilter.dimension(function(d){ return d.EVENT_TYPE }),
		eventTypeGroup = eventTypeDimension.group().reduceCount()
		regionDimension = stormFilter.dimension(function(d){ return d.CZ_NAME_STR }),
		regionGroup = regionDimension.group().reduceCount()

	yearChart
		.width(width)
		.height(height)
		.x(d3.scale.linear().domain([startYear,endYear]))
		.brushOn(false)
		.xAxisLabel("Year")
		.yAxisLabel("Enrollment")
		.dimension(yearDimension)
		.group(yearGroup);

	yearDamageChart
		.width(width)
		.height(height)
		.x(d3.scale.linear().domain([startYear,endYear]))
		.brushOn(false)
		.xAxisLabel("Year")
		.yAxisLabel("Property Damage")
		.dimension(yearDimension)
		.group(yearPropDamageGroup);


		var yearDamageChartYAxis = yearDamageChart.yAxis().tickFormat(function(d) { return millionFormat(d).replace('G', 'B'); });


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
		.xAxisLabel("Region ")
		.yAxisLabel("Count")
		.dimension(regionDimension)
		.group(regionGroup)		
	dc.renderAll();

	d3.selectAll('.x text').attr('transform','rotate(65)').attr('dx','20');
}