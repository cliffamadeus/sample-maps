class LeafletMap {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.markers = []; // Store all markers
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(latitude, longitude, title, attendanceCount) {
        const message = `
            <div>
                <strong>${title}</strong><br>
                Attendance Count: <span id="attendanceCountPopup">${attendanceCount}</span>
            </div>
        `;

        const marker = L.marker([latitude, longitude]).bindPopup(message);
        marker.addTo(this.map);
        this.markers.push(marker); // Store the marker

        // Open the popup immediately when the marker is added
        marker.openPopup();
    }

    // Method to update marker popup content
    updateMarkerPopup(marker, title, attendanceCount) {
        const message = `
            <div>
                <strong>${title}</strong><br>
                Attendance Count: <span id="attendanceCountPopup">${attendanceCount}</span>
            </div>
        `;
        marker.getPopup().setContent(message);
        marker.openPopup(); // Open the popup explicitly
    }
}

class AttendanceTracker {
    constructor(mapInstance) {
        this.attendanceCounts = {}; // Store attendance counts per location
        this.map = mapInstance;
    }

    setupEventListeners(locationData) {
        locationData.forEach(location => {
            // Create a button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex align-items-center mb-2';

            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerText = location.message;
            button.addEventListener('click', () => {
                this.incrementCount(location.message, location);
            });

            // Create an attendance counter element
            const counter = document.createElement('span');
            counter.className = 'attendance-counter';
            counter.id = `${location.message}-count`;
            counter.innerText = '0'; // Initialize count to 0

            // Append button and counter to the container
            buttonContainer.appendChild(button);
            buttonContainer.appendChild(counter);
            document.getElementById('buttonsContainer').appendChild(buttonContainer); // Add button container to the document

            this.attendanceCounts[location.message] = 0; // Initialize attendance count
        });
    }

    incrementCount(locationName, location) {
        this.attendanceCounts[locationName]++;
        
        // Update the corresponding counter display
        const counter = document.getElementById(`${locationName}-count`);
        if (counter) {
            counter.innerText = this.attendanceCounts[locationName];
        }

        // Find the corresponding marker and update its popup
        const marker = this.map.markers.find(m => m.getLatLng().lat === location.latitude && m.getLatLng().lng === location.longitude);
        if (marker) {
            this.map.updateMarkerPopup(marker, location.message, this.attendanceCounts[locationName]);
        }
    }
}

class App {
    constructor() {
        this.loadMapData();
    }

    loadMapData() {
        fetch('data.json') // Adjust the path to your JSON file
            .then(response => response.json())
            .then(data => {
                const myMap = new LeafletMap('map', [data[0].latitude, data[0].longitude], 16);

                const attendanceTracker = new AttendanceTracker(myMap);
                attendanceTracker.setupEventListeners(data);

                // Add initial markers for all locations
                data.forEach(location => {
                    myMap.addMarker(location.latitude, location.longitude, location.message, 0);
                });
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
            });
    }
}

// Initialize the application
const app = new App();