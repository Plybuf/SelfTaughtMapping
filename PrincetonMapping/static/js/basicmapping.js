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

//create the map object 
var map = L.map("map", {
    crs: crs
}).setView([40.339, -74.656], 3);

// bring in the base map.
const BasemapBasic = L.esri.tiledMapLayer({
    url: 'https://gis.princeton.edu/arcgis/rest/services/Basemap/Basemap_NoAnno/MapServer',
    // useCors: false
}).addTo(map);

//Bring in the feature layers of interest.


const BlueLightPhones = L.esri.featureLayer({url: 'https://gis.princeton.edu/arcgis/rest/services/Mapping/BlueLightPhones/FeatureServer/0',
pointToLayer: function (geojson, latlng) {
    return L.circleMarker(latlng);
}}).addTo(map);

const PUBuildings = L.esri.featureLayer({url: 'https://gis.princeton.edu/arcgis/rest/services/Archibus/EmergencyResponse_feature/FeatureServer/2',
    style: function (feature) {
        if (feature.properties.ARCH_BL_USE1 === 'ACAD'){
            return {color: 'rgb(227, 227, 178)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'ADM'){
            return {color: 'rgb(139, 196, 224)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'ATHL'){
            return {color: 'rgb(235, 189, 189)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'DORM'){
            return {color: 'rgb(244, 252, 179)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'GRAD'){
            return {color: 'rgb(102, 219, 191)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'HSG'){
            return {color: 'rgb(158, 95, 157)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'CHSG'){
            return {color: 'rgb(255, 166, 255)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'RE'){
            return {color: 'rgb(0, 127, 229)', weight: 0.5, fillOpacity: '1.0' };
        } else if (feature.properties.ARCH_BL_USE1 === 'RECO'){
            return {color: 'rgb(173, 82, 54)', weight: 0.5, fillOpacity: '1.0' };
        } else {
            return {color: 'rgb(156, 156, 156)', weight: 0.5, fillOpacity: '1.0' };
        }
    }
}).addTo(map);

// const TestBuildings = L.esri.featureLayer({url: 'https://gis.princeton.edu/arcgis/rest/services/Archibus/EmergencyResponse_feature/FeatureServer/2',
// simplyFactor: 1
// }).addTo(map);

//pop-ups for buildings...
PUBuildings.bindPopup(function(MapBuildings) {
    return L.Util.template("<h3>"+MapBuildings.feature.properties.NAME+"</h3><hr /><p>"
    +"This Building has an ID of "
    +MapBuildings.feature.properties.BL_ID+
    " and Building Use of "+MapBuildings.feature.properties.ARCH_BL_USE1+
    ".<hr /><p>"+
    "<img src='https://pcs.princeton.edu/blgpix/"+MapBuildings.feature.properties.BL_ID+".jpg'" + " class=popupImage "+ ">");
});

// Add labeling for buildings
// var labels = {};

// PUBuildings.on('createfeature', function(e){
//     var id = e.feature.id;
//     var feature = PUBuildings.getFeature(id);
//     var center = feature.getBounds().getCenter();
//     var label = L.marker(center, {
//         icon: L.divIcon({
//             iconSize: null,
//             className: 'label',
//             html: '<div>' + e.feature.properties.NAME + '</div>'
//         })
//     }).addTo(map);
//     labels[id] = label;
// });

// // turn on labeling when layer is turned on.
// PUBuildings.on('addfeature', function(e){
//     var label = labels[e.feature.id];
//     if(label){
//       label.addTo(map);
//     }
// });

// // turn off labeling when layer is turned off.
// PUBuildings.on('removefeature', function(e){
//     var label = labels[e.feature.id];
//     if(label){
//       map.removeLayer(label);
//     }
// });

// create the basemap group
var baseMaps = {
    "Basemap": BasemapBasic
};

var mapLayers = {
    "Blue Light Phones": BlueLightPhones,
    "Princeton Buildings": PUBuildings
};

L.control.layers(baseMaps, mapLayers).addTo(map);


    // create the legend control
    var legend = L.control({
        position: "bottomright"
    });

    // details for the legend
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "Building Use");

        var grades = [0, 18000, 19000, 20000];
        var colors = [
            'rgb(227, 227, 178)',
            "rgb(139, 196, 224)",
            "rgb(235, 189, 189)",
            "rgb(244, 252, 179)",
            "rgb(102, 219, 191)",
            "rgb(158, 95, 157)",
            "rgb(255, 166, 255)",
            "rgb(0, 127, 229)",
            "rgb(173, 82, 54)"
        ];
        labels = ['Academic', 'ADM', 'ATHL', 'DORM', 'GRAD', 'HSG', 'CHSG', 'RE', 'RECO'];

        // add title of the legend
        div.innerHTML += '<b>Building Primary Use</b><br>'

        // Loop through legend items and generate label with the associated color
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
              labels[i] + "<br>";
              console.log("color: " + colors[i]);
          }
          return div;
    };

    // add legend to the map
    legend.addTo(map);


