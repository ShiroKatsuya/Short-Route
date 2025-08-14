export default function mapTemplate(options = {}) {
  const routePoints = Array.isArray(options.routePoints) ? options.routePoints : [];
  const initialCenter = options.initialCenter || [108.28910845487877, -6.385749570906074];
  const initialZoom = typeof options.initialZoom === 'number' ? options.initialZoom : 10;
  const apiKey = options.apiKey || 'nWHvj8JKeiDyfDbFqLLDfqAw40bxLZRu';

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps.css'/>
    <style>
      html, body {
        margin: 0;
        height: 100%;
        width: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      #map {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        will-change: transform;
      }
      .marker {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #F37021;
        border: 2px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        font-size: 13px;
        box-sizing: border-box;
        user-select: none;
      }
    </style>
  </head>
  <body>
    <div id='map' class='map'></div>
    <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps-web.min.js'></script>
    <script>
    (function(){
      var points = ${JSON.stringify(routePoints)};
      var center = ${JSON.stringify(initialCenter)};

      tt.setProductInfo('TomTom Maps React Native', '1.0');
      var map = tt.map({
        key: '${apiKey}',
        container: 'map',
        center: center,
        zoom: ${initialZoom}
      });
      
      // Expose simple API for React Native side
      window.map = map;
      window.mapApi = {
        setCenter: function(lng, lat){ map.setCenter([lng, lat]); },
        zoomIn: function(){
          try {
            var z = map.getZoom ? map.getZoom() : 0;
            if (map.easeTo) { map.easeTo({ zoom: z + 1, duration: 200 }); }
            else if (map.setZoom) { map.setZoom(z + 1); }
            else if (map.zoomIn) { map.zoomIn(); }
          } catch (e) {}
        },
        zoomOut: function(){
          try {
            var z = map.getZoom ? map.getZoom() : 0;
            if (map.easeTo) { map.easeTo({ zoom: z - 1, duration: 200 }); }
            else if (map.setZoom) { map.setZoom(z - 1); }
            else if (map.zoomOut) { map.zoomOut(); }
          } catch (e) {}
        },
        fitToRoute: function(){
          if (!points || points.length < 2) return;
          var bounds = new tt.LngLatBounds();
          for (var i = 0; i < points.length; i++) {
            bounds.extend([points[i].longitude, points[i].latitude]);
          }
          map.fitBounds(bounds, { padding: 50, duration: 0 });
        }
      };

      function addMarkers(){
        if (!points) return;
        for (var i = 0; i < points.length; i++){
          var p = points[i];
          var el = document.createElement('div');
          el.className = 'marker';
          el.textContent = (p.label || '').toString();
          new tt.Marker({ element: el })
            .setLngLat([p.longitude, p.latitude])
            .addTo(map);
        }
      }

      function addPolyline(){
        if (!points || points.length < 2) return;
        var coords = points.map(function(p){ return [p.longitude, p.latitude]; });
        var data = {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties: {}
        };
        function draw(){
          if (map.getSource('route')){
            try { map.removeLayer('route'); } catch(e){}
            try { map.removeSource('route'); } catch(e){}
          }
          map.addSource('route', { type: 'geojson', data: data });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#1E5EF3',
              'line-width': 5
            }
          });
          window.mapApi.fitToRoute();
        }
        if (map.loaded()) { draw(); } else { map.on('load', draw); }
      }

      addMarkers();
      addPolyline();

      map.on('dragend', function(){
        var c = map.getCenter();
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage){
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'center', lng: c.lng, lat: c.lat }));
          } catch(e){}
        }
      });
    })();
    </script>
  </body>
</html>
`;
}