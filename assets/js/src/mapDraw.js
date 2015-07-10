function mapDraw(data){

    //Create two sets of events, one filtered, one total
    locationEvents = data;
    var stormEvents = {type:'FeatureCollection',features:[]};
    var filteredEvents = {type:'FeatureCollection',features:[]};

    //Formatting and Scales   
    var thousands = d3.format(".3f");
    var millions = d3.format(".6f");
    var billions = d3.format(".9f");
    var comma = d3.format(",");

    var damageRadiusScale = d3.scale.sqrt()
        .domain([0,100000000])
        .range([5,35]);

    var opaScale = d3.scale.sqrt()
        .domain([3,30])
        .range([.3, .15]);
    
    var radiusScale = function(d){
        if(d.properties.DAMAGE_PROPERTY > 0){
            return damageRadiusScale(d.properties.DAMAGE_PROPERTY);
        }
        else{
            //Minimum radius
            return 3
        }
    }

    var countyColorScale = d3.scale.category20();

    var opacityScale = function(d){
        return opaScale(radiusScale(d));
    }

    var latLng = function(d){
        return [d.BEGIN_LAT,d.BEGIN_LON];
    }

    //Create points on the map according to lat/long
    //Also null checks
    stormEvents.features = locationEvents.map(function(stormevent){

        if(isNaN(+stormevent.BEGIN_LON) || isNaN(+stormevent.BEGIN_LAT)){
            console.log('invalid lat lng data',stormevent)
            return {
                type:"Feature",
                properties:stormevent,
                geometry:{
                  type:"Point",
                  coordinates:[+0,+0]
                }
            }
        }else{
            return {
                type:"Feature",
                properties:stormevent,
                geometry:{
                  type:"Point",
                  coordinates:[+stormevent.BEGIN_LON,+stormevent.BEGIN_LAT]
                }
            }
        }
    });

    //Set event type for each event
    var event_types = [];
    stormEvents.features.forEach(function(se){
        if(event_types.indexOf(se.properties.EVENT_TYPE) < 0 ){
            event_types.push(se.properties.EVENT_TYPE);
        }
    });

    //Set damages for each event
    var property_damages = [];
    stormEvents.features.forEach(function(se){
        if(property_damages.indexOf(se.properties.DAMAGE_PROPERTY) < 0 ){
            property_damages.push(+se.properties.DAMAGE_PROPERTY);
        }
    });

    //Parameters for drawing the popups
    var popupOptions = function(d){
        return {maxWidth:500};
    }

    //Set content for hoverover popup over dots
    var popupContent = function(d){
        var content = '<h4>'+d.properties.EVENT_TYPE+'</h4>';
        content += '<table class="table">';
        content += '<tr><td>Property Damage</td><td>'+comma(d.properties.DAMAGE_PROPERTY)+'</td></tr>';
        content += '<tr><td>Crops Damage</td><td>'+d.properties.DAMAGE_CROPS+'</td></tr>';
        content += '<tr><td>CZ Name</td><td>'+d.properties.CZ_NAME.toUpperCase()+'</td></tr>';
        content += '<tr><td>Begin Date</td><td>'+d.properties.BEGIN_DATE_TIME.substr(0,9)+'</td></tr>';
        content += '<tr><td>Event ID</td><td>'+d.properties.EVENT_ID+'</td></tr>';
        content += '</table>';
        return content;
    }


    //Parameters for drawing the dots
    var markerOptions = function(d){
        var curRadius = radiusScale(d);
        var curOpacity = opacityScale(d);
        var curColor = countyColorScale(d.properties.CZ_NAME.toUpperCase());
        return {radius:curRadius, fillOpacity:curOpacity, color:curColor, fillColor:curColor}
    }

    //Adding dots to layer
    var options = {
        layerId:'storms',
        classed:'storm_event',
        type:'point',
        attr_functions:{
            'r': radiusScale
        },
        pointToLayer: function(d,latLng) {
            var curCircle = new L.CircleMarker(latLng, markerOptions(d))
                                 .bindPopup(popupContent(d),popupOptions(d));

            curCircle.on('mouseover',function(){
                this.openPopup();
            })

            curCircle.on('mouseout',function(){
                this.closePopup();
            })

            return curCircle;
         }
    };

    //Removing layer on events
    $('#select_event').on('click',function(d,e){
            map.removeLayer(stormLayer);
    })

    $('#select_state').on('click',function(d,e){
            map.removeLayer(stormLayer);
    })

    $('#barChart').on('mouseup',function(d,e){
            map.removeLayer(stormLayer); 
    })     

    //Updating map depending on line chart changes
    lineMapSync = function(){

        var curCounties;
        //Get the data of objects(lines) that are highlighted
        curCounties = d3.selectAll('.highlight').data();

        //Reset county array and filtered evens array
        var countyNames = [];
        filteredEvents.features = [];

        //Make array of names of counties
        curCounties.forEach(function(item){
            countyNames.push(item.name);
        })


        //If there are no specific county names, we want all of them
        //Reset the map and draw it from the original data
        if(countyNames.length == 0){
            //Remove old storm layer, add new one with full dataset
            map.removeLayer(stormLayer);
            stormLayer = null;
            stormLayer = new L.GeoJSON(stormEvents,options);
            map.addLayer(stormLayer);

        }
        //Otherwise, filter full data for ONLY highlighted counties
        else{
            stormEvents.features.forEach(function(feat){
                countyNames.forEach(function(item){
                    if(item == feat.properties.CZ_NAME){
                        filteredEvents.features.push(feat);
                    }
                })
            });

            //Remove old layer, make a new one, add the new one
            map.removeLayer(stormLayer);
            stormLayer = null;
            stormLayer = new L.GeoJSON(filteredEvents,options);
            map.addLayer(stormLayer);
        }

    }

    //Event listener for line chart changes
    $('#countyChart').on('mouseup',function(d,e){
        map.removeLayer(stormLayer);
        setTimeout(lineMapSync,100);
    })

    //Create layer
    var stormLayer = new L.GeoJSON(stormEvents,options)

    //Add layer
    map.addLayer(stormLayer);

}
