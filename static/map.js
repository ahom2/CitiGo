function loadMap(){
    Plotly.setPlotConfig({
  mapboxAccessToken: 'pk.eyJ1IjoiYWhvbSIsImEiOiJjam83emF1OGIwNGU5M3FvNjR3c2FsMmFpIn0.PiiwsBI02awxW6QmfGQ7TA'});
  
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            var mapParams = getMapParams(this.response);
            Plotly.plot('map', mapParams.data, mapParams.layout);
        }
    };
    xhttp.open("GET", "/bikes");
    xhttp.send();
}

function setupMapData(map_data){
    var latitude = [];
    var longitude = [];
    var desc = [];
    
    for (var i of map_data){
        latitude.push(i[3]);
        longitude.push(i[4]);
        desc.push(i[1] + ', Available bikes: ' +  i[5] + ', Available docks: ' + i[2]);;
    }
    
return [{
  'type':'scattermapbox',
  'lat':latitude,
  'lon':longitude,
  'mode':'markers',
  'marker': {
    'size':5,
    "color":"rgb(255,0,0)"
  },
  'text':desc
    }];
}

function findCenter(coor){
    var minLatitude = coor[3][3];
    var minLongitude = coor[3][4];
    var maxLatitude = coor[3][3];
    var maxLongitude = coor[3][4];
    
    for (var i of coor){
        //ternary conditionals make this easier
        minLatitude = i[3] < minLatitude? i[3]:minLatitude;
        minLongitude = i[4] < minLongitude? i[4]:minLongitude;
        maxLatitude = i[3] > maxLatitude? i[3]:maxLatitude;
        maxLongitude = i[4] > maxLongitude? i[4]:maxLongitude;
    }

    return [(minLatitude + maxLatitude) / 2,(minLongitude + maxLongitude) / 2];
}

function setupMapLayout(layout){
  return {"mapbox":{
            "style":"satellite-streets",
            "zoom":5,
            "center":{
                "lat":findCenter(layout)[3],
                "lon":findCenter(layout)[4]
            }
        }
    };
}

function getMapParams(params){
    var info = JSON.parse(params);
    return {'data':setupMapData(info),'layout':setupMapLayout(info)};
}