const html_script = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OpenLayers Map with GeoServer Overlay</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://openlayers.org/en/v3.20.1/css/ol.css">
  <style>
    html, body { height: 100%; margin: 0; overflow: hidden; }
    .map { height: 100%; width: 100%; touch-action: none; }

    .layer-switcher {
      position: absolute; bottom: 80px; left: 10px; z-index: 1000; display: none;
      background: rgba(255,255,255,0.8); border-radius: 8px; padding: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .layer-switcher.active { display: block; }
    .layer-switcher-button {
      position: absolute; bottom: 16px; left: 16px; z-index: 1000; width: 44px; height: 44px;
      background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 24px;
      display: flex; justify-content: center; align-items: center;
    }

    .layer-option { display: flex; flex-direction: column; align-items: center; margin: 5px; cursor: pointer;
      border: 1px solid transparent; border-radius: 8px; padding: 5px; transition: background-color .3s, border-color .3s; }
    .layer-option:hover { background-color: #f0f0f0; }
    .layer-option img { width: 40px; height: 40px; border-radius: 8px; }
    .layer-option.selected { border-color: #007bff; }
    .layer-option span { font-size: 12px; margin-top: 2px; }

    .direction-marker {
      width: 32px; height: 32px;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMCIgZmlsbD0iIzQyODVGNCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjQiLz4NCiAgICA8cG9seWdvbiBwb2ludHM9IjMyLDEyIDQyLDMyIDIyLDMyIiBmaWxsPSIjZmZmZmZmIi8+DQo8L3N2Zz4=') no-repeat center;
      background-size: contain; transform: rotate(0deg);
    }

    .search-container {
      position: absolute; top: 60px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex;
      background: rgba(255,255,255,0.9); border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); padding: 5px;
    }
    #searchInput {
      border: none; padding: 8px; border-radius: 8px 0 0 8px; outline: none; width: 300px;
    }
    #searchButton {
      border: none; background: #007bff; color: white; padding: 8px 16px; border-radius: 0 8px 8px 0; cursor: pointer;
    }
    #searchButton:hover { background: #0056b3; }
    .suggestions {
      position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ccc; border-radius: 4px;
      max-height: 200px; overflow-y: auto; z-index: 1000; list-style: none; margin: 0; padding: 0;
    }
    .suggestions li { padding: 8px; cursor: pointer; }
    .suggestions li:hover { background: #f0f0f0; }
  </style>

  <script src="https://openlayers.org/en/v3.20.1/build/ol.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ol/6.5.0/ol.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/ol"></script>
</head>
<body>
  <div id="map" class="map"></div>

  <div id="layerSwitcher" class="layer-switcher">
    <div class="layer-option" data-layer="road">
      <img src="https://i.pinimg.com/originals/45/0b/9a/450b9ab16492a968cffb4a428ec714f2.gif" alt="Road Layer">
    </div>
    <div class="layer-option" data-layer="satellite">
      <img src="https://iotlink.com.vn/wp-content/uploads/2024/01/ban-do-so-viet-nam-thay-the-google-maps-hoan-hao-03-01-2024-01.webp" alt="Satellite Layer">
    </div>
    <div class="layer-option" data-layer="hybrid">
      <img src="https://media.istockphoto.com/id/1178043205/vector/vietnam-map-with-cities-luminous-dots-neon-lights-on-dark-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=e_iTAtIIPRM9cUprd6bScY2NCD18_8bZT0j5TYMe08M=" alt="Hybrid Layer">
    </div>
  </div>

  <button id="toggleSwitcher" class="layer-switcher-button">🌍</button>

  <div id="searchContainer" class="search-container">
    <input id="searchInput" type="text" placeholder="Nhập địa chỉ hoặc địa điểm..." />
    <button id="searchButton">Tìm kiếm</button>
    <ul id="suggestions" class="suggestions"></ul>
  </div>

  <script>
    const view = new ol.View({
      center: ol.proj.fromLonLat([106.693129, 10.759458]), // Can Tho
      zoom: 12,
      rotation: 0,
      minZoom: 5,
      maxZoom: 22
    });

    const roadLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({ url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' }),
      minZoom: 5, maxZoom: 22
    });

    const satelliteLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({ url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' }),
      minZoom: 5, maxZoom: 22
    });

    const hybridLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({ url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' }),
      minZoom: 5, maxZoom: 22
    });

    const geoServerLayer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'https://geo.nlt-group.com:15100/geoserver/wms',
        params: {
          'LAYERS': 'NLT_GIS:NLT_TREE_LAYER',
          'TILED': true,
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'env': 'ROTATION:0'
        }
      }),
      opacity: 1,
      minZoom: 5, maxZoom: 22,
      name: 'geoServerLayer',
      visible: false
    });

    const map = new ol.Map({
      target: 'map',
      layers: [roadLayer, geoServerLayer],
      view: view,
      controls: ol.control.defaults({
        zoom: false,
        attribution: false
      })
    });

    document.getElementById('toggleSwitcher').addEventListener('click', function() {
      const switcher = document.getElementById('layerSwitcher');
      switcher.classList.toggle('active');
    });

    // Marker trung tâm tham khảo
    const centerMarkerElement = document.createElement('div');
    centerMarkerElement.className = 'center-marker';
    centerMarkerElement.style.width = '32px';
    centerMarkerElement.style.height = '32px';
    centerMarkerElement.style.background = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDY0IDk2Ij4NCiAgICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjI0IiByPSIxNiIgZmlsbD0iI0ZEMDAwMCIvPg0KICAgIDxyZWN0IHg9IjI4IiB5PSI0MCIgd2lkdGg9IjgiIGhlaWdodD0iNTYiIGZpbGw9IiNGRDgwMDAiLz4NCjwvc3ZnPg==) no-repeat center';
    centerMarkerElement.style.backgroundSize = 'contain';
    centerMarkerElement.style.position = 'absolute';
    centerMarkerElement.style.top = '50%';
    centerMarkerElement.style.left = '50%';
    centerMarkerElement.style.transform = 'translate(-50%, -50%)';
    centerMarkerElement.style.zIndex = '1000';
    document.body.appendChild(centerMarkerElement);

    function getCenterCoordinates() {
      const center = map.getView().getCenter();
      const lonLat = ol.proj.toLonLat(center);
      return lonLat;
    }

    // Mỗi lần map dừng di chuyển, gửi [lon,lat] về RN
    map.on('moveend', () => {
      const coordinates = getCenterCoordinates();
      window.ReactNativeWebView.postMessage(JSON.stringify(coordinates));
    });

    const directionMarker = new ol.Overlay({
      positioning: 'center-center',
      element: document.createElement('div'),
      stopEvent: false
    });

    directionMarker.getElement().className = 'direction-marker';
    map.addOverlay(directionMarker);

    function addMarker(lon, lat, direction) {
      const coordinates = ol.proj.fromLonLat([lon, lat]);
      directionMarker.setPosition(coordinates);
      const mapRotation = view.getRotation() || 0;
      directionMarker.getElement().style.transform =
        \`rotate(\${direction + (mapRotation * 180 / Math.PI)}deg)\`;
    }

    // NHẬN MESSAGE từ RN
  window.addEventListener(
  'message',
  function (event) {
    // An toàn khi parse
    let message = null;
    try {
      message = typeof event.data === 'string' ? JSON.parse(event.data) : (event.data || {});
    } catch (e) {
      // Không phải JSON hợp lệ -> bỏ qua
      return;
    }
    if (!message || typeof message !== 'object') return;

    // ---- Focus theo địa chỉ (RN -> Web) ----
    if (message.searchAddress) {
      const q = String(message.searchAddress || '').trim();
      if (!q) return;

             fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(q)}&format=json&limit=1\`)
        .then((r) => r.json())
        .then((arr) => {
          const hit = Array.isArray(arr) && arr.length ? arr[0] : null;
          if (!hit) {
            // Có thể gửi thông báo "không tìm thấy" nếu cần
            // window.ReactNativeWebView.postMessage(JSON.stringify({ type:'geocode', error:'not_found', query:q }));
            return;
          }
          const lon = parseFloat(hit.lon);
          const lat = parseFloat(hit.lat);
          if (Number.isFinite(lon) && Number.isFinite(lat)) {
            view.setCenter(ol.proj.fromLonLat([lon, lat]));
            view.setZoom(18);
            // GIỮ TƯƠNG THÍCH: gửi lại [lon, lat] như hiện tại
            window.ReactNativeWebView.postMessage(JSON.stringify([lon, lat]));
          }
        })
        .catch(() => {
          // optional: gửi thông báo lỗi mạng
          // window.ReactNativeWebView.postMessage(JSON.stringify({ type:'geocode', error:'network', query:q }));
        });

      return; // kết thúc nhánh searchAddress
    }

    // ---- Bật/tắt layer (giữ logic gốc) ----
    if (message.action === 'addLayer' || message.action === 'removeLayer') {
      const layerName = message.layerName;
      if (layerName) {
        const layer = map
          .getLayers()
          .getArray()
          .find((l) => l.get && l.get('name') === layerName);
        if (layer) layer.setVisible(message.action === 'addLayer');
      }
      return;
    }

    // ---- Center theo GPS từ RN ----
    const hasLatLng =
      message &&
      Number.isFinite(parseFloat(message.latitude)) &&
      Number.isFinite(parseFloat(message.longitude));

    if (message.click === 1 && hasLatLng) {
      const lat = parseFloat(message.latitude);
      const lon = parseFloat(message.longitude);
      view.setRotation(0);
      view.setCenter(ol.proj.fromLonLat([lon, lat]));
      view.setZoom(19);
      addMarker(lon, lat, Number.isFinite(message.heading) ? message.heading : 0);
      return;
    }

    if (hasLatLng) {
      const lat = parseFloat(message.latitude);
      const lon = parseFloat(message.longitude);
      addMarker(lon, lat, Number.isFinite(message.heading) ? message.heading : 0);
    }
  },
  false
);


    // Bộ chọn layer UI
    document.querySelectorAll('.layer-option').forEach(option => {
      option.addEventListener('click', function() {
        const layerType = this.getAttribute('data-layer');
        map.getLayers().clear();
        let newBaseLayer = roadLayer;
        if (layerType === 'satellite') newBaseLayer = satelliteLayer;
        if (layerType === 'hybrid') newBaseLayer = hybridLayer;
        map.getLayers().push(newBaseLayer);
        map.getLayers().push(geoServerLayer);

        document.querySelectorAll('.layer-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('layerSwitcher').classList.remove('active');
      });
    });

    // Ô tìm kiếm có sẵn trong HTML (nút "Tìm kiếm")
    document.getElementById('searchButton').addEventListener('click', function () {
      const query = document.getElementById('searchInput').value;
      const suggestions = document.getElementById('suggestions');
      if (!query) { suggestions.innerHTML = ''; return; }

      fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5\`)
        .then(response => response.json())
        .then(data => {
          suggestions.innerHTML = '';
          data.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result.display_name;
            li.addEventListener('click', () => {
              const lon = parseFloat(result.lon);
              const lat = parseFloat(result.lat);
              view.setCenter(ol.proj.fromLonLat([lon, lat]));
              view.setZoom(16);
              document.getElementById('searchInput').value = result.display_name;
              suggestions.innerHTML = '';
              // báo RN để nó đồng bộ text
              window.ReactNativeWebView.postMessage(JSON.stringify([lon, lat]));
            });
            suggestions.appendChild(li);
          });
        })
        .catch(() => { alert('Đã xảy ra lỗi khi tìm kiếm!'); });
    });
  </script>
</body>
</html>
`;

export default html_script;
