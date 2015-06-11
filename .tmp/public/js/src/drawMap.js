function drawMap(data,startYear){
    locationEvents = data;
    var stormEvents = {type:'FeatureCollection',features:[]};
    var filteredEvents = {type:'FeatureCollection',features:[]};

    var comma = d3.format(",");

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
            //return
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


    var event_types = [];
    stormEvents.features.forEach(function(se){
        //console.log(se.properties.EVENT_TYPE);
        if(event_types.indexOf(se.properties.EVENT_TYPE) < 0 ){
            event_types.push(se.properties.EVENT_TYPE);
        }
    });

    console.log(event_types);

    var property_damages = [];
    stormEvents.features.forEach(function(se){
        if(property_damages.indexOf(se.properties.DAMAGE_PROPERTY) < 0 ){
            property_damages.push(+se.properties.DAMAGE_PROPERTY);
        }
    });

    
    var event_select = d3.select('#select_event')


       
    $('#select_event').on('change',function(d,e){
        
        var type = $(this).val();

        console.log(type);

        if(type === 'All'){
        
            //Remove old storm layer, add new one with full dataset
            map.removeLayer(stormLayer);
            stormLayer = new L.GeoJSON(stormEvents,options);
            map.addLayer(stormLayer);

            //redraw sidebar with original full dataset
            crossData(locationEvents,startYear);
        
        }else{
            
            filteredEvents.features = stormEvents.features.filter(function(feat){
                return feat.properties.EVENT_TYPE == type;
            });

            //Remove old layer, make a new one, add the new one
            map.removeLayer(stormLayer);
            stormLayer = new L.GeoJSON(filteredEvents,options);
            map.addLayer(stormLayer);

            //Filter events based on type, then redraw sidebar
            sidebarEvents = locationEvents.filter(function(sideEvent){
                return sideEvent.EVENT_TYPE == type;
            });


            crossData(sidebarEvents,startYear);

        }
        

    })

   
    $('#select_year').on('change',function(d,e){

            map.removeLayer(stormLayer);
    })



    
    var thousands = d3.format(".3f");
    var millions = d3.format(".6f");
    var billions = d3.format(".9f");

    var comma = d3.format(",");

    var damageRadiusScale = d3.scale.sqrt()
        .domain([0,100000000])
        .range([6,30]);

    var opaScale = d3.scale.sqrt()
        .domain([3,30])
        .range([.4, .20]);
    
    var radiusScale = function(d){
        //console.log(d.properties.DAMAGE_PROPERTY.substr(0,d.properties.DAMAGE_PROPERTY.length-1));
        if(d.properties.DAMAGE_PROPERTY > 0){
            return damageRadiusScale(d.properties.DAMAGE_PROPERTY);
        }
        else{
            return 3
        }
    }






    var latLng = function(d){
        return [d.BEGIN_LAT,d.BEGIN_LON];
    }


    var popupContent = function(d){

        var content = '<h4>'+d.properties.EVENT_TYPE+'</h4>';
        content += '<table class="table">';
        content += '<tr><td>Property Damage</td><td>'+comma(d.properties.DAMAGE_PROPERTY)+'</td></tr>';
        content += '<tr><td>Crops Damage</td><td>'+d.properties.DAMAGE_CROPS+'</td></tr>';
        content += '<tr><td>CZ Name</td><td>'+d.properties.CZ_NAME+'</td></tr>';
        content += '<tr><td>Begin Date</td><td>'+d.properties.BEGIN_DATE_TIME.substr(0,9)+'</td></tr>';
        content += '<tr><td>Event ID</td><td>'+d.properties.EVENT_ID+'</td></tr>';
        content += '</table>';

        return content;
    }

    var popupOptions = function(d){
        return {maxWidth:500};
    }

    var markerOptions = function(d){
        var curRadius = radiusScale(d);
        var curOpacity = opacityScale(d);

        return {radius:curRadius, fillOpacity:curOpacity}
    }

    var opacityScale = function(d){
        return opaScale(radiusScale(d));
    }



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

    var stormLayer = new L.GeoJSON(stormEvents,options)
    map.addLayer(stormLayer);
}
