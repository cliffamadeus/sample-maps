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
        const marker = L.marker([lat, lng]).addTo(this.map);
        marker.bindPopup(message);
    }

    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message);
                });
            })
            .catch(error => console.error('Error loading markers:', error));
    }
    
    addCenterShape(center) {
        const circle = L.circle(center, {
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.1,
            radius: 100 
        }).addTo(this.map);

        
        let tooltipVisible = false;

        circle.on('click', function () {
            if (!tooltipVisible) {
                this.bindTooltip('This is a circle shape', {
                    permanent: true,
                    direction: 'top'
                }).openTooltip();
            } else {
                this.closeTooltip();
            }
            tooltipVisible = !tooltipVisible; 
        });
    }

    loadSquareFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const vertices = data.vertices;
                const square = L.polygon(vertices, {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0.5
                }).addTo(this.map);


                let tooltipVisible = false;

                square.on('click', function () {
                    if (!tooltipVisible) {
                        this.bindTooltip('This is a square shape', {
                            permanent: true,
                            direction: 'top'
                        }).openTooltip();
                    } else {
                        this.closeTooltip();
                    }
                    tooltipVisible = !tooltipVisible; 
                });

            })
            
            .catch(error => console.error('Error loading square:', error));
    }
}

const myMap = new LeafletMap('map', [8.360004, 124.868419], 18);


//myMap.loadMarkersFromJson('map-data.json');
myMap.loadSquareFromJson('square-data.json');