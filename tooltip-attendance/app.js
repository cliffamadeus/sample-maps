class LeafletMap {
    // Constructor to initialize the Leaflet map
    constructor(containerId, center, zoom) {
        // Create the map instance and set its view to the specified center and zoom level
        this.map = L.map(containerId).setView(center, zoom);
        // Initialize the tile layer for the map
        this.initTileLayer();
        // Array to store markers added to the map
        this.markers = [];
    }

    // Method to initialize the tile layer using OpenStreetMap tiles
    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, // Set the maximum zoom level
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Attribution for the tile data
        }).addTo(this.map); // Add the tile layer to the map
    }

    // Method to add a marker to the map at specified coordinates with a popup
    addMarker(latitude, longitude, title, attendanceCount, lastClickedDate) {
        // Create the popup content using provided data
        const popupContent = this.createPopupContent(title, attendanceCount, lastClickedDate);
        // Create a marker and bind the popup to it
        const marker = L.marker([latitude, longitude]).bindPopup(popupContent);
        marker.addTo(this.map); // Add the marker to the map
        this.markers.push(marker); // Store the marker in the markers array
        marker.openPopup(); // Open the popup immediately after adding
    }

    // Method to update an existing marker's popup content
    updateMarkerPopup(marker, title, attendanceCount, lastClickedDate) {
        // Create new popup content
        const popupContent = this.createPopupContent(title, attendanceCount, lastClickedDate);
        // Set the new content to the marker's popup
        marker.getPopup().setContent(popupContent);
        marker.openPopup(); // Open the updated popup
    }

    // Helper method to create popup content for markers
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
    // Constructor to initialize the AttendanceTracker with a map instance
    constructor(mapInstance) {
        this.attendanceCounts = {}; // Object to track attendance counts for each location
        this.lastClickedDates = {}; // Object to store last clicked dates for each location
        this.map = mapInstance; // Reference to the LeafletMap instance
    }

    // Method to set up event listeners for each location
    setupEventListeners(locationData) {
        locationData.forEach(location => {
            const cardHtml = this.createCardHtml(location); // Create card HTML for the location
            document.getElementById('buttonsContainer').insertAdjacentHTML('beforeend', cardHtml); // Add the card to the buttons container
            this.setupCardClickListener(location); // Set up click listener for the card's button
            this.attendanceCounts[location.name] = 0; // Initialize attendance count for the location
            this.lastClickedDates[location.name] = "Never"; // Initialize last clicked date for the location
        });
    }

    // Helper method to create HTML for a location card
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

    // Method to set up click listener for the location card's button
    setupCardClickListener(location) {
        const button = document.getElementById(`${location.name}-button`);
        button.addEventListener('click', () => this.incrementCount(location.name, location)); // Increment attendance count on click
    }

    // Method to increment the attendance count for a location
    incrementCount(locationName, location) {
        this.attendanceCounts[locationName]++; // Increment attendance count
        this.updateCounterDisplay(locationName); // Update display for the count
        this.updateLastClickedDate(locationName); // Update last clicked date
        this.updateMarker(location); // Update the marker's popup content
    }

    // Method to update the displayed attendance count on the card
    updateCounterDisplay(locationName) {
        const counter = document.getElementById(`${locationName}-count`);
        if (counter) {
            counter.innerText = this.attendanceCounts[locationName]; // Update the counter text
        }
    }

    // Method to update the last clicked date for a location
    updateLastClickedDate(locationName) {
        const date = new Date().toLocaleString(); // Get the current date and time
        this.lastClickedDates[locationName] = date; // Store the last clicked date

        const lastClickedElement = document.getElementById(`${locationName}-last-click`);
        if (lastClickedElement) {
            lastClickedElement.innerText = `Last checked in: ${date}`; // Update the last clicked text
        }
    }

    // Method to update the marker's popup content for a location
    updateMarker(location) {
        // Find the marker corresponding to the location based on latitude and longitude
        const marker = this.map.markers.find(m => 
            m.getLatLng().lat === location.latitude && m.getLatLng().lng === location.longitude
        );
        if (marker) {
            // Retrieve the last clicked date and update the marker's popup
            const lastClickedDate = this.lastClickedDates[location.name];
            this.map.updateMarkerPopup(marker, location.name, this.attendanceCounts[location.name], lastClickedDate);
        }
    }
}

class App {
    // Constructor to initialize the application
    constructor() {
        this.loadMapData(); // Load map data on initialization
    }

    // Method to fetch map data from a JSON file and initialize the map and attendance tracker
    loadMapData() {
        fetch('data.json') // Fetch the JSON data from the specified file
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                const myMap = new LeafletMap('map', [data[0].latitude, data[0].longitude], 18); // Initialize the map with the first location's coordinates
                const attendanceTracker = new AttendanceTracker(myMap); // Initialize the attendance tracker with the map instance
                attendanceTracker.setupEventListeners(data); // Set up event listeners for the location data

                // Add markers for each location on the map
                data.forEach(location => {
                    myMap.addMarker(location.latitude, location.longitude, location.name, 0, "Never");
                });
            })
            .catch(error => console.error('Error loading JSON:', error)); // Log any errors that occur during fetching
    }
}

// Initialize the application
const app = new App();
