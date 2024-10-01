class LeafletMap {
    // Constructor to initialize the Leaflet map
    constructor(containerId, center, zoom) {
        // Create the map instance and set its view to the specified center and zoom level
        this.map = L.map(containerId).setView(center, zoom);
        // Initialize the tile layer for the map
        this.initTileLayer();
        // Add a circular shape at the center of the map
        this.addCenterShape(center);
    }

    // Method to initialize the tile layer using OpenStreetMap tiles
    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, // Set the maximum zoom level
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Attribution for the tile data
        }).addTo(this.map); // Add the tile layer to the map
    }

    // Method to add a marker to the map at specified latitude and longitude with a popup message
    addMarker(lat, lng, message) {
        L.marker([lat, lng]) // Create a marker at the given coordinates
            .addTo(this.map) // Add the marker to the map
            .bindPopup(message); // Bind a popup to the marker displaying the message
    }

    // Method to load markers from a JSON file
    loadMarkersFromJson(url) {
        fetch(url) // Fetch the JSON data from the provided URL
            .then(response => response.json()) // Parse the JSON response
            .then(data => data.forEach(marker => 
                // For each marker in the data, add it to the map
                this.addMarker(marker.latitude, marker.longitude, marker.message)
            ))
            .catch(error => console.error('Error loading markers:', error)); // Log any errors that occur during fetching
    }

    // Method to add a circular shape at the specified center
    addCenterShape(center) {
        L.circle(center, { // Create a circle at the center coordinates
            color: 'blue', // Outline color of the circle
            fillColor: '#30f', // Fill color of the circle
            fillOpacity: 0.1, // Opacity of the fill
            radius: 100 // Radius of the circle in meters
        }).addTo(this.map) // Add the circle to the map
          .bindPopup("<b>Circle shape added</b>") // Bind a popup to the circle
          .openPopup(); // Open the popup immediately
    }

    // Method to load a square shape from a JSON file
    loadSquareFromJson(url) {
        fetch(url) // Fetch the JSON data from the provided URL
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                const vertices = data.vertices; // Extract vertices for the square from the data
                L.polygon(vertices, { // Create a polygon using the vertices
                    color: 'green', // Outline color of the polygon
                    fillColor: 'green', // Fill color of the polygon
                    fillOpacity: 0.5 // Opacity of the fill
                }).addTo(this.map) // Add the polygon to the map
                  .bindPopup("<b>Square shape added</b>") // Bind a popup to the polygon
                  .openPopup(); // Open the popup immediately
            })
            .catch(error => console.error('Error loading square:', error)); // Log any errors that occur during fetching
    }
}

// Create an instance of LeafletMap with specified container ID, center coordinates, and zoom level
const myMap = new LeafletMap('map', [8.360004, 124.868419], 18);

// Load shapes from JSON files
// myMap.loadMarkersFromJson('map-data.json'); // Uncomment to load markers from a JSON file
myMap.loadSquareFromJson('square-data.json'); // Load square shape from JSON file
