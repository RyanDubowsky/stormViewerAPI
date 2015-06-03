function drawMap(data){
    locationEvents = data;

    var stormEvents = {type:'FeatureCollection',features:[]};
    var filteredEvents = {type:'FeatureCollection',features:[]};
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
        if(property_damages.indexOf(se.properties.DAMAGE_PROPERTY_NUM) < 0 ){
            property_damages.push(+se.properties.DAMAGE_PROPERTY_NUM);
        }
    });

    
    var event_select = d3.select('#select_event')


       
    $('#select_event').on('change',function(d,e){
        
        var type = $(this).val();

        console.log(type);

        if(type === 'All'){
        
            stormLayer.externalUpdate( stormEvents );
        
        }else{
            
            filteredEvents.features = stormEvents.features.filter(function(feat){
                return feat.properties.EVENT_TYPE == type;
            });
            console.log('test',type,filteredEvents.features.length)
            stormLayer.externalUpdate( filteredEvents );
        }
        

    })
    
    var thousands = d3.format(",");

    var damageScale = d3.scale.sqrt()
        .domain([0,100000000])
        .range([6,30]);
    
    var radiusScale = function(d){
        if(d.properties.DAMAGE_PROPERTY_NUM > 0){
            return damageScale(d.properties.DAMAGE_PROPERTY_NUM)
        }
        else{
            return 4
        }
    }


    var latLng = function(d){
        return [d.BEGIN_LAT,d.BEGIN_LON];
    }


    var popupContent = function(d){

        var content = '<h4>'+d.properties.EVENT_TYPE+'</h4>';
        content += '<table class="table">';
        content += '<tr><td>Property Damage</td><td>'+thousands(d.properties.DAMAGE_PROPERTY_NUM)+'</td></tr>';
        content += '<tr><td>Crops Damage</td><td>'+thousands(d.properties.DAMAGE_CROPS_NUM)+'</td></tr>';
        content += '<tr><td>CZ Name</td><td>'+d.properties.CZ_NAME_STR+'</td></tr>';
        content += '<tr><td>Begin Date</td><td>'+d.properties.BEGIN_DATE+'</td></tr>';
        content += '<tr><td>Event ID</td><td>'+d.properties.EVENT_ID+'</td></tr>';
        content += '</table>';

        return content;
    }

    var popupOptions = function(d){
        return {maxWidth:500};
    }

    var markerOptions = function(d){
        var curRadius = radiusScale(d);
        var curOpacity = .3;

        return {radius:curRadius, fillOpacity:curOpacity}
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
