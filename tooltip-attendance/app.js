class LeafletMap {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.markers = [];
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(latitude, longitude, title, attendanceCount, lastClickedDate) {
        const popupContent = this.createPopupContent(title, attendanceCount, lastClickedDate);
        const marker = L.marker([latitude, longitude]).bindPopup(popupContent);
        marker.addTo(this.map);
        this.markers.push(marker);
        marker.openPopup();
    }

    updateMarkerPopup(marker, title, attendanceCount, lastClickedDate) {
        const popupContent = this.createPopupContent(title, attendanceCount, lastClickedDate);
        marker.getPopup().setContent(popupContent);
        marker.openPopup();
    }

    createPopupContent(title, attendanceCount, lastClickedDate) {
        return `
            <div>
                <strong>${title}</strong><br>
                Attendance Count: <span id="attendanceCountPopup">${attendanceCount}</span><br>
                Last Checked In: ${lastClickedDate}
            </div>
        `;
    }
}

class AttendanceTracker {
    constructor(mapInstance) {
        this.attendanceCounts = {};
        this.lastClickedDates = {}; // Store last clicked dates
        this.map = mapInstance;
    }

    setupEventListeners(locationData) {
        locationData.forEach(location => {
            const cardHtml = this.createCardHtml(location);
            document.getElementById('buttonsContainer').insertAdjacentHTML('beforeend', cardHtml);
            this.setupCardClickListener(location);
            this.attendanceCounts[location.name] = 0; // Initialize attendance count
            this.lastClickedDates[location.name] = "Never"; // Initialize last clicked date
        });
    }

    createCardHtml(location) {
        return `
            <div class="card mb-2" style="width: 18rem;">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-8">
                            <h5 class="card-title">${location.name}</h5>
                            <button class="btn btn-primary" id="${location.name}-button">Check in</button>
                            <p id="${location.name}-last-click" class="mt-2">Last checked in: Never</p>
                        </div>
                        <div class="col-4">
                            <h2 class="card-text" id="${location.name}-count">0</h2>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCardClickListener(location) {
        const button = document.getElementById(`${location.name}-button`);
        button.addEventListener('click', () => this.incrementCount(location.name, location));
    }

    incrementCount(locationName, location) {
        this.attendanceCounts[locationName]++;
        this.updateCounterDisplay(locationName);
        this.updateLastClickedDate(locationName);
        this.updateMarker(location);
    }

    updateCounterDisplay(locationName) {
        const counter = document.getElementById(`${locationName}-count`);
        if (counter) {
            counter.innerText = this.attendanceCounts[locationName];
        }
    }

    updateLastClickedDate(locationName) {
        const date = new Date().toLocaleString();
        this.lastClickedDates[locationName] = date; // Store last clicked date

        const lastClickedElement = document.getElementById(`${locationName}-last-click`);
        if (lastClickedElement) {
            lastClickedElement.innerText = `Last checked in: ${date}`;
        }
    }

    updateMarker(location) {
        const marker = this.map.markers.find(m => 
            m.getLatLng().lat === location.latitude && m.getLatLng().lng === location.longitude
        );
        if (marker) {
            const lastClickedDate = this.lastClickedDates[location.name];
            this.map.updateMarkerPopup(marker, location.name, this.attendanceCounts[location.name], lastClickedDate);
        }
    }
}

class App {
    constructor() {
        this.loadMapData();
    }

    loadMapData() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const myMap = new LeafletMap('map', [data[0].latitude, data[0].longitude], 18);
                const attendanceTracker = new AttendanceTracker(myMap);
                attendanceTracker.setupEventListeners(data);

                data.forEach(location => {
                    myMap.addMarker(location.latitude, location.longitude, location.name, 0, "Never");
                });
            })
            .catch(error => console.error('Error loading JSON:', error));
    }
}

// Initialize the application
const app = new App();
