function loadMap(){
    Plotly.setPlotConfig({
  mapboxAccessToken: 'pk.eyJ1IjoiYWhvbSIsImEiOiJjam83emF1OGIwNGU5M3FvNjR3c2FsMmFpIn0.PiiwsBI02awxW6QmfGQ7TA'});
  
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            var mapParams = getMapParams(this.response);
            var graphParams = getGraphParams(this.response);
            var pieParams = getPieParams(this.response);
            Plotly.plot('map', mapParams.data, mapParams.layout);
            Plotly.newPlot('graph', graphParams.data2, graphParams.layout2);
            Plotly.newPlot('pie', pieParams.data3, pieParams.layout3);
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
        desc.push(i[1] + ', Available bikes: ' +  i[5] + ', Available docks: ' + i[2]);
    }
    
return [{
  'type':'scattermapbox',
  'lat':latitude,
  'lon':longitude,
  'mode':'markers',
  'marker': {
    'size':5,
    "color":"rgb(231, 99, 250)"
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
            "margin":{
                l:0,
                r:0,
                t:0,
                b:0,
                pad:4
            },
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

function setupGraphData(graph_data){
    var stations = [];
    var remainingDocks = [];
    for (var i of graph_data){
        stations.push(i[1]);
        remainingDocks.push(i[7]-i[2]-i[5]);
    }
    return [
  {
    x: stations,
    y: remainingDocks,
    type: 'bar',
    text:[],
    marker: {
    color: 'rgb(142,124,195)'
  }
  }
];
}

function setupGraphLayout(graph_data){
    return {
        title: 'Number of Missing Bikes/Docks Per Station',
  font:{
    family: 'Raleway, sans-serif'
  },
  showlegend: false,
  xaxis: {
    tickangle: -45
  },
  yaxis: {
    zeroline: false,
    gridwidth: 2
  },
  bargap :0.05
    }
}

function getGraphParams(params){
    var info = JSON.parse(params);
    return {'data2':setupGraphData(info),'layout2':setupGraphLayout(info)};
}

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

function setupPieData(pie_data){
    var remainingDocks = [];
    var val = [];
    var lab = [];
    for (var i of pie_data){
        remainingDocks.push(i[7]-i[2]-i[5]);
    }
    remainingDocks.sort();
    var maximum = Math.max.apply( Math, remainingDocks );
    for (var j = 0; j < maximum + 1; j++){
        if (countInArray(remainingDocks,j) !== 0){
            val.push(countInArray(remainingDocks,j)/remainingDocks.length * 100);
            lab.push('Missing bikes/docks: ' + j);
        }

    }
    return  [{values: val,
  labels: lab,
  type: 'pie'
}];
}

function setupPieLayout(pie_layout){
    return {
        margin:{
                l:0,
                r:0,
                t:0,
                b:0,
                pad:4
            },
  height: 400,
  width: 500
};
}

function getPieParams(params){
    var info = JSON.parse(params);
    return {'data3':setupPieData(info),'layout3':setupPieLayout(info)};
}