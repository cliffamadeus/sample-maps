class LeafletMap {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.marker = null; // Initialize the marker property
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(latitude, longitude, attendanceCount) {
        // Create message with attendance count using HTML
        const message = `
            <div>
                <strong>NBSC Gym</strong><br>
                Attendance Count: <span id="attendanceCountPopup">${attendanceCount}</span>
            </div>
        `;

        // Check if the marker already exists
        if (this.marker) {
            // Update the popup content using inner HTML
            this.marker.getPopup().setContent(message);
            this.marker.openPopup(); // Open the popup explicitly
        } else {
            // Create the marker if it doesn't exist
            this.marker = L.marker([latitude, longitude]);
            this.marker.bindPopup(message).openPopup(); // Open the popup immediately
            this.marker.addTo(this.map); // Ensure the marker is added to the map
        }
    }
}

class AttendanceTracker {
    constructor(mapInstance) {
        this.attendanceCount = 0;
        this.map = mapInstance;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addAttendance').addEventListener('click', () => {
            this.incrementCount();
            this.map.addMarker(8.360080, 124.868887, this.attendanceCount); // Pass the attendance count
        });
    }

    incrementCount() {
        this.attendanceCount++;
        document.getElementById('attendanceCount').innerText = `Attendance Count: ${this.attendanceCount}`;
    }
}

const myMap = new LeafletMap('map', [8.360004, 124.868419], 16);
myMap.addMarker(8.360080, 124.868887, 0); // Initialize with count 0
const attendanceTracker = new AttendanceTracker(myMap);