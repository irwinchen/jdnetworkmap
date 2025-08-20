// J+D Partner Network Map - Main Application

// Initialize the application when page loads
window.addEventListener("load", function () {
  initializeApp();
});

async function initializeApp() {
  console.log("🚀 Initializing J+D Partner Map...");

  // Initialize authentication state
  authState.isLoading = false;

  // Setup authentication event listeners
  setupAuthEventListeners();

  // Check for existing authentication or OAuth callback
  const isCallback = await handleOAuthCallback();

  if (!isCallback) {
    checkExistingAuth();
  }

  // Initialize map regardless of auth status (will be hidden if not authenticated)
  initializeMap();
}

function setupAuthEventListeners() {
  // Login button click handler
  document
    .getElementById("airtable-login-btn")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      if (authState.isLoading) {
        console.log("⏳ OAuth already in progress...");
        showAuthError(
          "Authentication already in progress. Please wait..."
        );
        return;
      }

      authState.isLoading = true;
      await initiateOAuth();
      authState.isLoading = false;
    });

  // Logout button click handler
  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    location.reload();
  });
}

// Initialize map and partner management system
function initializeMap() {
  console.log("🗺️ Initializing map...");

  // Create the main map
  window.partnerMap = L.map("map", {
    zoomControl: true,
    attributionControl: false,
  }).setView([39.8283, -98.5795], 4); // Centered on USA

  // Add base tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(window.partnerMap);

  // Add state boundary layer
  console.log("📍 Loading state boundaries...");
  addStateBoundaries();

  // Initialize partner marker cluster group
  initializeMarkerClusters();

  // Initialize layer management system
  initializeLayerManager();

  // Add partner controls and event listeners
  initializePartnerControls();

  // Initialize form submission handler
  document
    .getElementById("partner-form")
    .addEventListener("submit", handlePartnerFormSubmit);

  // Load existing partners from Airtable only if authenticated
  if (authState.isAuthenticated) {
    console.log("User authenticated - loading existing partners...");
    testAirtableAuth();
    loadExistingPartners();
  } else {
    console.log("User not authenticated - skipping partner loading");
  }

  console.log("Map initialization complete");
}

function addStateBoundaries() {
  // Add US state boundaries from a CDN
  fetch(
    "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("GeoJSON data loaded successfully");

      // Add state boundaries to map
      const stateLayer = L.geoJSON(data, {
        style: {
          color: "#ff0064",
          weight: 1,
          opacity: 0.6,
          fillOpacity: 0.1,
          fillColor: "#ff0064",
        },
        // No popup functionality - just visual boundaries
      });

      stateLayer.addTo(window.partnerMap);
      console.log("State boundaries loaded successfully");
    })
    .catch((error) => {
      console.error("Failed to load state boundaries:", error);
    });
}

function initializeMarkerClusters() {
  // Create marker cluster group with custom options
  window.partnerMarkers = L.markerClusterGroup({
    // Disable clustering at US-level view to prevent cross-state clustering
    maxClusterRadius: function(zoom) {
      if (zoom <= 6) {
        return 0; // No clustering at US/continental level (zoom 4-6)
      } else if (zoom <= 9) {
        return 50; // Small radius for regional clustering (zoom 7-9)
      } else {
        return 30; // Very small radius for city-level clustering (zoom 10+)
      }
    },
    // Custom icon creation
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      let className = 'marker-cluster-small';
      
      if (count >= 100) {
        className = 'marker-cluster-large';
      } else if (count >= 10) {
        className = 'marker-cluster-medium';
      }
      
      return new L.DivIcon({
        html: '<div><span>' + count + '</span></div>',
        className: 'marker-cluster ' + className,
        iconSize: new L.Point(40, 40)
      });
    },
    // Completely disable clustering at city level and above
    disableClusteringAtZoom: 12, // Stop clustering when zoomed in to city level
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  });

  // Add cluster group to map
  window.partnerMap.addLayer(window.partnerMarkers);
  console.log("Marker clustering initialized");
}

function initializeLayerManager() {
  console.log("🎛️ Initializing Layer Management System...");
  
  // Create global layer manager instance
  window.layerManager = new LayerManager(window.partnerMap);
  
  // Update partner count when partners are loaded
  if (window.partnerMarkers) {
    // Set initial count to 0
    window.layerManager.updateJDPartnersCount(0);
    
    // Listen for marker additions/removals to update count
    window.partnerMarkers.on('layeradd', function() {
      const count = window.partnerMarkers.getLayers().length;
      window.layerManager.updateJDPartnersCount(count);
    });
    
    window.partnerMarkers.on('layerremove', function() {
      const count = window.partnerMarkers.getLayers().length;
      window.layerManager.updateJDPartnersCount(count);
    });
  }
  
  console.log("Layer management system initialized");
}

function initializePartnerControls() {
  console.log("🔧 Initializing partner controls...");
  
  // Add Partner Button Event Listener
  const addBtn = document.getElementById("add-partner-btn");
  if (addBtn) {
    console.log("Add button found:", addBtn);
    addBtn.addEventListener("click", handleAddPartnerToggle);
  } else {
    console.error("Add partner button not found!");
  }

  // Mode Indicator
  const modeIndicator = document.getElementById("mode-indicator");
  if (modeIndicator) {
    console.log("Mode indicator found:", modeIndicator);
  } else {
    console.error("Mode indicator not found!");
  }
  
  // Map click handler for adding partners
  window.partnerMap.on("click", function (e) {
    if (appState.mapMode === "add") {
      console.log("Map clicked in add mode at:", e.latlng);
      showPartnerForm(e.latlng);
    }
  });

  console.log("Partner controls initialized");
}

// Update UI based on current mode
function updateUIForMode() {
  const addBtn = document.getElementById("add-partner-btn");
  const modeIndicator = document.getElementById("mode-indicator");
  const mapElement = document.getElementById("map");

  if (appState.mapMode === "add") {
    addBtn.classList.add("active");
    addBtn.innerHTML = "Exit Add Mode";
    addBtn.title = "Exit Add Partner Mode";
    if (modeIndicator) modeIndicator.classList.add("visible");
    if (mapElement) {
      mapElement.style.cursor = "crosshair";
      mapElement.classList.add("add-mode");
    }
    if (window.partnerMap) {
      window.partnerMap.getContainer().style.cursor = "crosshair";
    }
  } else {
    addBtn.classList.remove("active");
    addBtn.innerHTML = "Add Partner";
    addBtn.title = "Toggle Add Partner Mode";
    if (modeIndicator) modeIndicator.classList.remove("visible");
    if (mapElement) {
      mapElement.style.cursor = "";
      mapElement.classList.remove("add-mode");
    }
    if (window.partnerMap) {
      window.partnerMap.getContainer().style.cursor = "";
    }
  }
}

// Handle Add Partner button toggle
function handleAddPartnerToggle() {
  console.log("Add partner button clicked, current mode:", appState.mapMode);
  
  // Check authentication first
  if (!authState.isAuthenticated) {
    console.log("User not authenticated, showing auth overlay");
    const overlay = document.getElementById("auth-overlay");
    overlay.classList.remove("hidden");
    return;
  }

  // Toggle between add and view modes
  if (appState.mapMode === "add") {
    // Exit add mode
    console.log("Exiting add mode...");
    appState.mapMode = "view";

    // Remove any temporary markers
    if (window.currentTempMarker) {
      window.partnerMap.removeLayer(window.currentTempMarker);
      delete window.currentTempMarker;
    }
  } else {
    // Enter add mode
    console.log("Entering add mode...");
    appState.mapMode = "add";
  }

  // Update UI using centralized function
  updateUIForMode();
}