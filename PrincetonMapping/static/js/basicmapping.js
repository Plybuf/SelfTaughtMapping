// Javascript file for the mapping page - heatmap.html

// load the API key for mapbox:
var apiKey = API_KEY;

var crs = new L.Proj.CRS("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs", {
    origin: [-20037700, 30241100],
    resolutions: [
        16.933367200067735,
        12.700025400050801,
        8.466683600033868,
        4.233341800016934,
        2.116670900008467,
        1.0583354500042335,
        0.5291677250021167,
        0.26458386250105836,
        0.13229193125052918
    ]
});

// add the basemaps
// var grayScaleMap = L.tileLayer("https://gis.princeton.edu/arcgis/rest/services/Basemap/Basemap/MapServer/tile/{z}/{x}/{y}.png", {
//     attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"
//     // test: {z}-5
//     // maxZoom: 15,
//     // id: "Basemap",
//     // minZoom: 4
//     // accessToken: API_KEY
// });

// var imageMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
//   maxZoom: 17,
//   id: "mapbox.streets-satellite",
//   minZoom: 4,
//   accessToken: API_KEY
// });

//create the map object 
var map = L.map("map", {
    crs: crs
    // layers: [imageMap]
}).setView([40.339, -74.656], 3);

// Add the tile layer to the map.
// grayScaleMap.addTo(map);

// create layer for the NBA team locations
// var TeamLoc = new L.LayerGroup();

// create the basemap group
// var baseMaps = {
//     imageMap: imageMap
// };

L.esri.tiledMapLayer({
    url: 'https://gis.princeton.edu/arcgis/rest/services/Basemap/Basemap/MapServer',
    // useCors: false
}).addTo(map);

// create overlays (for now, just the generic team location)
// var mapLayers = {
//     "Arena Size": TeamLoc
// };

// add control to enable turning on and off layers
// L.control.layers(baseMaps).addTo(map);

const BlueLightPhones = L.esri.featureLayer({url: 'https://gis.princeton.edu/arcgis/rest/services/Mapping/BlueLightPhones/FeatureServer/0'}).addTo(map);
const PUBuildings = L.esri.featureLayer({url: 'https://gis.princeton.edu/arcgis/rest/services/Archibus/EmergencyResponse_feature/FeatureServer/2'}).addTo(map);

PUBuildings.bindPopup(function(MapBuildings) {
    return L.Util.template('<h3>{NAME}</h3><hr /><p>This Building has an ID of {BL_ID} and Building Use of {ARCH_BL_USE1}.<hr /><p>"<img src= https://pcs.princeton.edu/blgpix/{BL_ID}.jpg>"', MapBuildings.feature.properties);
});

// https://pcs.princeton.edu/blgpix/
// "<img src='" + picURL2 + "'" + "class=popupImage" + "/>"

// // URL for api from flask
// var location_path = "/heatmap_data2";
// console.log(location_path);
// d3.json(location_path, function(response) {
//     // var TeamVenue = [];
//     function styleInfo(features) {
//         return {
//             opacity:1,
//             fillOpacity: 0.75,
//             fillColor: getColor(features.properties.POPULATION),
//             radius: getRadius(features.properties.POPULATION),
//             stroke: true,
//             weight: 0.2
//         };
//     }

//     function getRadius(population) {
//         switch (true) {
//         case population > 20000:
//             return 25;
//         case population > 19000:
//             return 20;
//         case population > 18000:
//             return 15;
//         default:
//             return 12;
//         }
//     }

//     function getColor(pop) {
//         switch (true) {
//         case pop > 20000:
//             return "#ea2c2c";
//         case pop > 19000:
//             return "#ea822c";
//         case pop > 18000:
//             return "#ee9c00";
//         default:
//             return "#98ee00";
//         }
//     }


//     L.geoJson(response, {
//         pointToLayer: function(features, latlng) {
//             return L.circleMarker(latlng);
//         },

//         style: styleInfo,

//         onEachFeature: function(features, layer) {
//             layer.bindPopup("Team: " + features.properties.TEAM + "<br>Arena: " + features.properties.NAME + "<br>Arena Size: " +features.properties.POPULATION);

//         }
//     }).addTo(TeamLoc);

//     TeamLoc.addTo(map);

//     // create the legend control
//     var legend = L.control({
//         position: "bottomright"
//     });

//     // details for the legend
//     legend.onAdd = function() {
//         var div = L.DomUtil.create("div", "NBA legend");

//         var grades = [0, 18000, 19000, 20000];
//         var colors = [
//             "#98ee00",
//             "#ee9c00",
//             "#ea822c",
//             "#ea2c2c"
//         ];
//         labels = [];

//         // add title of the legend
//         div.innerHTML += '<b>Arena Size</b><br>'

//         // Loop through legend items and generate label with the associated color
//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
//               grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "  <br>" : "+");
//           }
//           return div;
//     };

//     // add legend to the map
//     legend.addTo(map);

// });
