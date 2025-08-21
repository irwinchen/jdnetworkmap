// J+D Partner Network Map - Main Application

// Initialize the application when page loads
window.addEventListener("load", function () {
  initializeApp();
});

async function initializeApp() {
  console.log("🚀 Initializing J+D Partner Map...");
  
  // Show loading overlay initially
  const loadingOverlay = document.getElementById('loading-overlay');
  const authOverlay = document.getElementById('auth-overlay');
  
  // Initialize authentication state
  authState.isLoading = false;

  // Setup authentication event listeners
  setupAuthEventListeners();
  
  // Show debug panel if in debug mode
  showDebugPanel();

  // Check for existing authentication or OAuth callback
  const isCallback = await handleOAuthCallback();

  if (!isCallback) {
    checkExistingAuth();
  }

  // Initialize map regardless of auth status (will be hidden if not authenticated)
  initializeMap();
  
  // Hide loading overlay after initialization
  setTimeout(() => {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
  }, 1000); // Small delay to show loading state
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

  // Initialize zoom level indicator (temporary for clustering configuration)
  initializeZoomIndicator();

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
        return 0; // No clustering at zoom 10+ (city level and beyond)
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
    // Completely disable clustering at zoom level 10 and above
    disableClusteringAtZoom: 10, // Stop clustering at zoom 10+ (city level)
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  });

  // Add cluster group to map
  window.partnerMap.addLayer(window.partnerMarkers);
  console.log("Marker clustering initialized");
}

function initializeZoomIndicator() {
  console.log("🔍 Initializing zoom level indicator...");
  
  const zoomLevelElement = document.getElementById('zoom-level');
  const zoomIndicator = document.getElementById('zoom-indicator');
  let fadeTimeout = null;
  
  // Update zoom level display
  function updateZoomLevel() {
    const currentZoom = window.partnerMap.getZoom();
    if (zoomLevelElement) {
      zoomLevelElement.textContent = currentZoom;
    }
  }
  
  // Show zoom indicator with fade in
  function showZoomIndicator() {
    if (zoomIndicator) {
      zoomIndicator.classList.add('visible');
    }
  }
  
  // Hide zoom indicator with fade out
  function hideZoomIndicator() {
    if (zoomIndicator) {
      zoomIndicator.classList.remove('visible');
    }
  }
  
  // Handle zoom start (show indicator)
  function onZoomStart() {
    showZoomIndicator();
    
    // Clear any existing timeout
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
      fadeTimeout = null;
    }
  }
  
  // Handle zoom end (update level and set fade timeout)
  function onZoomEnd() {
    updateZoomLevel();
    
    // Clear any existing timeout
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
    
    // Set timeout to hide after 2 seconds
    fadeTimeout = setTimeout(() => {
      hideZoomIndicator();
      fadeTimeout = null;
    }, 2000);
  }
  
  // Listen for zoom events
  window.partnerMap.on('zoomstart', onZoomStart);
  window.partnerMap.on('zoomend', onZoomEnd);
  
  // Set initial zoom level (but don't show indicator)
  updateZoomLevel();
  
  console.log("Zoom level indicator initialized with fade behavior");
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
    
    // Restore previous layer visibility states
    restorePreviousLayerStates();
  } else {
    // Enter add mode
    console.log("Entering add mode...");
    appState.mapMode = "add";
    
    // Store current layer states and hide all non-J+D layers
    hideOtherLayersForAddMode();
  }

  // Update UI using centralized function
  updateUIForMode();
}

// Store layer states before entering add mode and hide non-J+D layers
function hideOtherLayersForAddMode() {
  console.log("📦 Hiding other layers for Add Partner mode...");
  
  if (!window.layerManager) {
    console.warn("LayerManager not available");
    return;
  }
  
  // Store current layer states if not already stored
  if (!window.previousLayerStates) {
    window.previousLayerStates = new Map();
    
    // Store all current active layers and their visibility
    window.layerManager.activeLayers.forEach((layerData, layerId) => {
      window.previousLayerStates.set(layerId, {
        active: true,
        visible: layerData.visible
      });
    });
    
    // Also store inactive layers
    Object.keys(window.layerManager.layerConfigs).forEach(layerId => {
      if (!window.layerManager.activeLayers.has(layerId)) {
        window.previousLayerStates.set(layerId, {
          active: false,
          visible: false
        });
      }
    });
  }
  
  // Hide all layers except J+D Partners
  window.layerManager.activeLayers.forEach((layerData, layerId) => {
    if (layerId !== 'jd-partners' && layerData.visible) {
      console.log(`🔹 Hiding layer: ${layerId}`);
      window.layerManager.deactivateLayer(layerId);
    }
  });
  
  // Ensure J+D Partners layer is visible
  if (window.layerManager.activeLayers.has('jd-partners')) {
    const jdPartners = window.layerManager.activeLayers.get('jd-partners');
    if (!jdPartners.visible) {
      console.log("🔹 Showing J+D Partners layer");
      window.layerManager.activateLayer('jd-partners');
    }
  }
  
  // Update UI to reflect changes
  window.layerManager.updateUI();
  
  console.log("✅ Layers hidden for Add Partner mode");
}

// Restore previous layer states when exiting add mode
function restorePreviousLayerStates() {
  console.log("📦 Restoring previous layer states...");
  
  if (!window.layerManager || !window.previousLayerStates) {
    console.warn("LayerManager or previousLayerStates not available");
    return;
  }
  
  // Restore each layer's previous state
  window.previousLayerStates.forEach((state, layerId) => {
    const currentlyActive = window.layerManager.activeLayers.has(layerId);
    const currentlyVisible = currentlyActive ? window.layerManager.activeLayers.get(layerId).visible : false;
    
    if (state.active && state.visible && !currentlyVisible) {
      // Layer should be active and visible but isn't
      console.log(`🔹 Restoring layer: ${layerId}`);
      window.layerManager.activateLayer(layerId);
    } else if (layerId === 'jd-partners') {
      // Handle J+D Partners visibility state
      const jdPartners = window.layerManager.activeLayers.get('jd-partners');
      if (jdPartners && state.visible !== jdPartners.visible) {
        if (state.visible) {
          window.layerManager.activateLayer('jd-partners');
        } else {
          window.layerManager.deactivateLayer('jd-partners');
        }
      }
    } else if (!state.active && currentlyActive) {
      // Layer should be inactive but is active
      console.log(`🔹 Deactivating layer: ${layerId}`);
      window.layerManager.deactivateLayer(layerId);
    }
  });
  
  // Clear stored states
  delete window.previousLayerStates;
  
  // Update UI to reflect changes
  window.layerManager.updateUI();
  
  console.log("✅ Previous layer states restored");
}

function showDebugPanel() {
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug');
  
  if (debugMode === 'simple') {
    const debugPanel = document.getElementById('debug-panel');
    const debugContent = document.getElementById('debug-content');
    
    if (debugPanel && debugContent) {
      debugPanel.style.display = 'block';
      
      // Create debug information HTML
      const debugInfo = `
        <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; margin: 10px 0;">
          <strong>🧪 Debug Mode: Simple OAuth (No PKCE)</strong><br>
          <strong>Client ID:</strong> ${OAUTH_CONFIG.clientId}<br>
          <strong>Redirect URI:</strong> ${OAUTH_CONFIG.redirectUri}<br>
          <strong>Current URL:</strong> ${window.location.href}<br>
          <strong>Hostname Match:</strong> ${new URL(OAUTH_CONFIG.redirectUri).hostname === window.location.hostname ? '✅ Yes' : '❌ No'}<br>
          <strong>Browser:</strong> ${navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? 'Safari' : 
                                     navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}<br>
          <strong>HTTPS:</strong> ${location.protocol === 'https:' ? '✅ Yes' : '❌ No'}<br>
          <strong>Cookies:</strong> ${navigator.cookieEnabled ? '✅ Enabled' : '❌ Disabled'}
        </div>
        <p><strong>Note:</strong> Check browser console for detailed logging when you click Login.</p>
      `;
      
      debugContent.innerHTML = debugInfo;
      console.log("🧪 Debug panel displayed for simple OAuth mode");
    }
  }
}