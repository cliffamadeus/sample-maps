class LeafletMap {
    constructor(containerId, center, zoom) {
        // Initialize the map with specified options
        this.map = L.map(containerId, { 
            dragging: false,        // Disable dragging of the map
            touchZoom: false,       // Disable touch zoom
            scrollWheelZoom: false, // Disable zooming with scroll wheel
            doubleClickZoom: false  // Disable double-click zoom
        }).setView(center, zoom);  // Set the initial view of the map
        
        this.initTileLayer(); // Call method to initialize the tile layer
        
        // Configure marker cluster group to make clustered pins unclickable
        this.markerClusterGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,  // Prevent markers from scattering when zoomed in
            showCoverageOnHover: false  // Hide cluster coverage on hover
        }).addTo(this.map); // Add the cluster group to the map
    }

    initTileLayer() {
        // Initialize tile layer from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 15,  // Set maximum zoom level
            minZoom: 18,  // Set minimum zoom level (note: this seems contradictory)
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Set attribution for the map
        }).addTo(this.map); // Add the tile layer to the map
    }

    // Method to add a pin to the map
    addPin({ latitude, longitude, name }) {
        L.marker([latitude, longitude]) // Create a new marker at the specified latitude and longitude
            .addTo(this.markerClusterGroup); // Add the marker to the cluster group
    }
}

class App {
    constructor() {
        // Create a new LeafletMap instance and set initial location and zoom
        this.map = new LeafletMap('map', [8.360004, 124.868419], 18);
        this.loadPinData(); // Load pin data from JSON
    }

    // Method to load pin data from a JSON file
    loadPinData() {
        fetch('pins.json') // Adjust the path to your JSON file
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                this.createButtons(data); // Create buttons for each pin
                data.forEach(pin => {
                    this.map.addPin(pin); // Add each pin to the map
                });
            })
            .catch(error => console.error('Error loading pin data:', error)); // Handle any errors
    }

    // Method to create buttons for each pin
    /*
    createButtons(data) {
        const buttonsContainer = document.getElementById('buttonsContainer'); // Get the container for buttons
        buttonsContainer.innerHTML = ''; // Clear existing buttons

        data.forEach(pin => {
            // Create a new button for each pin
            const button = document.createElement('button');
            button.className = 'btn btn-primary m-1'; // Set button classes
            button.innerText = pin.name; // Set button text to pin name
            button.addEventListener('click', () => {
                this.map.addPin(pin); // Add pin to the map on button click
            });
            buttonsContainer.appendChild(button); // Append button to the container
        });
    }*/

        createButtons(data) {
            const buttonsContainer = document.getElementById('buttonsContainer'); // Get the container for buttons
            buttonsContainer.innerHTML = ''; // Clear existing buttons
        
            // Build HTML for all buttons
            let buttonsHTML = data.map(pin => `
                <button class="btn btn-primary m-1" onclick="addPinToMap('${pin.name}')">
                    ${pin.name}
                </button>
            `).join(''); // Create buttons for each pin and join them into a single string
        
            buttonsContainer.innerHTML = buttonsHTML; // Set the innerHTML of the container
        
            // Define function to handle adding pins
            window.addPinToMap = (pinName) => {
                const pin = data.find(p => p.name === pinName); // Find pin by name
                if (pin) {
                    this.map.addPin(pin); // Add pin to the map
                }
            };
        }
        
}

// Initialize the app
new App();
