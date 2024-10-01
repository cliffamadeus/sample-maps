class LeafletMap {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.addCenterShape(center);
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(lat, lng, message) {
        L.marker([lat, lng]).addTo(this.map).bindPopup(message);
    }

    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => data.forEach(marker => 
                this.addMarker(marker.latitude, marker.longitude, marker.message)
            ))
            .catch(error => console.error('Error loading markers:', error));
    }

    addCenterShape(center) {
        L.circle(center, {
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.1,
            radius: 100 
        }).addTo(this.map).bindPopup("<b>Circle shape added</b>").openPopup();
    }

    loadSquareFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const vertices = data.vertices;
                L.polygon(vertices, {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.5
                }).addTo(this.map).bindPopup("<b>Square shape added</b>").openPopup();
            })
            .catch(error => console.error('Error loading square:', error));
    }
}

const myMap = new LeafletMap('map', [8.360004, 124.868419], 18);

// Load your markers and shapes
// myMap.loadMarkersFromJson('map-data.json');
myMap.loadSquareFromJson('square-data.json');
