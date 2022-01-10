mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(
          `<div style="text-align: center"><h5>${campground.title}</h5><p class="text-muted">${campground.location}</p></div>`
      )
  )
  .addTo(map)