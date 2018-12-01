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
//    [[35.6763257, 139.6993177, "Meiji Shrine"],[35.7101456, 139.8105814, "Skytree"],[35.6950532, 139.7017945, "Godzilla Head"]]
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
    var minLatitude = coor[0][0];
    var minLongitude = coor[0][1];
    var maxLatitude = coor[0][0];
    var maxLongitude = coor[0][1];
    
    for (var i of coor){
        //ternary conditionals make this easier
        minLatitude = i[0] < minLatitude? i[0]:minLatitude;
        minLongitude = i[1] < minLongitude? i[1]:minLongitude;
        maxLatitude = i[0] > maxLatitude? i[0]:maxLatitude;
        maxLongitude = i[1] > maxLongitude? i[1]:maxLongitude;
    }

    return [(minLatitude + maxLatitude) / 2,(minLongitude + maxLongitude) / 2];
}

function setupMapLayout(layout){
  return {"mapbox":{
            "style":"satellite-streets",
            "zoom":11,
            "center":{
                "lat":findCenter(layout)[0],
                "lon":findCenter(layout)[1]
            }
        }
    };
}

function getMapParams(params){
    var info = JSON.parse(params);
    return {'data':setupMapData(info),'layout':setupMapLayout(info)};
}