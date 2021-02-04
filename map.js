mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FtZiIsImEiOiJjaWZ3bGhtdjgzMnN1dWdrcnEwZTVieG91In0.DkCY-91coDahKvpH7Z26dw";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/samf/ckkrie32m08pc17mszhwq6z6e?fresh=true",
  center: [-121.086, 45.035],
  zoom: 6,
  hash: true
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "us",
    mapboxgl: mapboxgl,
  })
);

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-left");

map.on('load', function () {
  map.addSource('mapbox-dem', {
  'type': 'raster-dem',
  'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
  'tileSize': 512,
  'maxzoom': 14
  });
  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
   
  // add a sky layer that will show when the map is highly pitched
  map.addLayer({
  'id': 'sky',
  'type': 'sky',
  'paint': {
  'sky-type': 'atmosphere',
  'sky-atmosphere-sun': [0.0, 0.0],
  'sky-atmosphere-sun-intensity': 15
  }
  });

  map.addSource("snotel", {
    type: "geojson",
    data: "data/stations.geojson",
  });

  map.addLayer(
    {
      id: "snotel-layer",
      type: "symbol",
      source: "snotel",
      "layout": {
        "icon-image": "snowflake (1)",
        "icon-size": 1
    },
    },
    "settlement-subdivision-label"
  );

  map.on('click', 'snotel-layer', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.name;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'snotel-layer', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'snotel-layer', function () {
    map.getCanvas().style.cursor = '';
    });
});