// J+D Partner Network Map - UI and Form Handling

// Show partner form modal
function showPartnerForm(latlng) {
  console.log("📝 Opening partner form for coordinates:", latlng);
  
  const modal = document.getElementById("partner-modal");
  const form = document.getElementById("partner-form");
  
  // Clear form
  form.reset();
  
  // Set coordinates
  document.getElementById("partner-latitude").value = latlng.lat.toFixed(6);
  document.getElementById("partner-longitude").value = latlng.lng.toFixed(6);
  
  // Clear any existing status messages
  const progressDiv = document.getElementById("save-progress");
  progressDiv.className = "save-progress hidden";
  
  // Show modal
  modal.classList.add("visible");
  
  // Focus on partner name field
  document.getElementById("partner-name").focus();
  
  // Add temporary marker to show location
  if (window.currentTempMarker) {
    window.partnerMap.removeLayer(window.currentTempMarker);
  }
  
  window.currentTempMarker = L.marker(latlng, {
    opacity: 0.7
  }).addTo(window.partnerMap);
  
  console.log("Partner form opened with temporary marker");
}

// Hide partner form modal
function hidePartnerForm() {
  console.log("Hiding partner form");
  const modal = document.getElementById("partner-modal");
  modal.classList.remove("visible");
  
  // Remove temporary marker
  if (window.currentTempMarker) {
    window.partnerMap.removeLayer(window.currentTempMarker);
    delete window.currentTempMarker;
  }
}

// Handle partner form submission
async function handlePartnerFormSubmit(e) {
  e.preventDefault();
  console.log("📝 Partner form submitted");

  const form = e.target;
  const progressDiv = document.getElementById("save-progress");
  
  // Show saving progress
  progressDiv.className = "save-progress info";
  progressDiv.textContent = "Saving partner...";

  // Collect form data
  const formData = {
    name: form.elements["partner-name"].value.trim(),
    type: form.elements["partner-type"].value,
    address: form.elements["partner-address"].value.trim(),
    description: form.elements["partner-description"].value.trim(),
    contact: form.elements["partner-contact"].value.trim(),
    email: form.elements["partner-email"].value.trim(),
    phone: form.elements["partner-phone"].value.trim(),
    projectLink: form.elements["partner-project-link"].value.trim(),
    notes: form.elements["partner-notes"].value.trim(),
    latitude: parseFloat(form.elements["partner-latitude"].value),
    longitude: parseFloat(form.elements["partner-longitude"].value),
  };

  console.log("📋 Form data collected:", formData);

  // Validate required fields
  if (!formData.name) {
    progressDiv.className = "save-progress error";
    progressDiv.textContent = "Partner name is required";
    return;
  }

  if (!formData.type) {
    progressDiv.className = "save-progress error";
    progressDiv.textContent = "Partner type is required";
    return;
  }

  if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
    progressDiv.className = "save-progress error";
    progressDiv.textContent = "Invalid coordinates";
    return;
  }

  try {
    // Save to Airtable
    console.log("💾 Saving to Airtable...");
    progressDiv.textContent = "Saving to Airtable...";
    
    const result = await savePartnerToAirtable(formData);

    if (result.success) {
      console.log("✅ Partner saved successfully!");
      progressDiv.className = "save-progress success";
      progressDiv.textContent = "Partner saved successfully!";

      // Create marker and add to map
      const marker = createPartnerMarker(
        {
          ...formData,
          id: result.id,
        },
        [formData.latitude, formData.longitude]
      );

      // Add to cluster group
      window.partnerMarkers.addLayer(marker);

      // Close form after a short delay
      setTimeout(() => {
        hidePartnerForm();
        
        // Exit add mode
        appState.mapMode = "view";
        updateUIForMode();
      }, 1500);

    } else {
      console.error("❌ Failed to save partner:", result.message);
      progressDiv.className = "save-progress error";
      progressDiv.textContent = `Error: ${result.message}`;
    }
  } catch (error) {
    console.error("❌ Error saving partner:", error);
    progressDiv.className = "save-progress error";
    progressDiv.textContent = "Unexpected error occurred";
  }
}

// Create partner marker with custom styling
function createPartnerMarker(partner, latlng) {
  // Define marker shapes and colors based on partner type
  const markerConfig = getMarkerConfig(partner.type);
  
  // Create custom HTML marker
  const markerHtml = `
    <div style="
      width: 20px;
      height: 20px;
      background-color: ${markerConfig.color};
      border: 1px solid white;
      border-radius: ${markerConfig.borderRadius};
      transform: ${markerConfig.transform};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <span style="color: white; font-size: 10px; font-weight: bold;">${markerConfig.icon}</span>
    </div>
  `;

  const marker = L.marker(latlng, {
    icon: L.divIcon({
      html: markerHtml,
      className: 'custom-partner-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  });

  // Create popup content
  const popupContent = createPartnerPopup(partner);
  marker.bindPopup(popupContent);

  return marker;
}

// Get marker configuration based on partner type
function getMarkerConfig(partnerType) {
  const configs = {
    "Connector": {
      color: "#FF0064", // Pink
      borderRadius: "50%", // Circle
      transform: "rotate(0deg)",
      icon: "C"
    },
    "Information Hub": {
      color: "#50F5C8", // Aqua
      borderRadius: "0%", // Diamond
      transform: "rotate(45deg)",
      icon: "I"
    },
    "Funder": {
      color: "#DCF500", // Green
      borderRadius: "0%", // Diamond
      transform: "rotate(45deg)",
      icon: "F"
    },
    "News Organization": {
      color: "#50F5C8", // Aqua
      borderRadius: "0%", // Diamond
      transform: "rotate(45deg)",
      icon: "N"
    },
    "Community College": {
      color: "#143CFF", // Blue
      borderRadius: "0%", // Square
      transform: "rotate(0deg)",
      icon: "E"
    },
    "Library": {
      color: "#FF0064", // Pink
      borderRadius: "50%", // Circle
      transform: "rotate(0deg)",
      icon: "L"
    },
    "Other": {
      color: "#FF0064", // Pink
      borderRadius: "0%", // Triangle (simulated with transform)
      transform: "rotate(0deg)",
      icon: "O"
    }
  };

  return configs[partnerType] || configs["Other"];
}

// Create partner popup content
function createPartnerPopup(partner) {
  const popupContent = `
    <div class="partner-popup">
      <h3 style="color: #FF0064; margin: 0 0 8px 0; font-size: 14px;">${partner.name}</h3>
      <div style="font-size: 12px; line-height: 1.4;">
        <div style="margin-bottom: 4px;"><strong>Type:</strong> ${partner.type}</div>
        ${partner.description ? `<div style="margin-bottom: 4px;"><strong>Description:</strong> ${partner.description}</div>` : ''}
        ${partner.address ? `<div style="margin-bottom: 4px;"><strong>Address:</strong> ${partner.address}</div>` : ''}
        ${partner.contact ? `<div style="margin-bottom: 4px;"><strong>Contact:</strong> ${partner.contact}</div>` : ''}
        ${partner.email ? `<div style="margin-bottom: 4px;"><strong>Email:</strong> <a href="mailto:${partner.email}" style="color: #50F5C8;">${partner.email}</a></div>` : ''}
        ${partner.phone ? `<div style="margin-bottom: 4px;"><strong>Phone:</strong> ${partner.phone}</div>` : ''}
        ${partner.website ? `<div style="margin-bottom: 4px;"><strong>Website:</strong> <a href="${partner.website}" target="_blank" style="color: #50F5C8;">Visit</a></div>` : ''}
      </div>
    </div>`;

  return popupContent;
}

// Handle geocoding for addresses
async function geocodeAddress(address) {
  if (!address.trim()) {
    return null;
  }

  console.log("🌍 Geocoding address:", address);

  try {
    // Using OpenStreetMap Nominatim service (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=us`
    );

    if (response.ok) {
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        console.log("✅ Geocoding successful:", result);
        
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          displayName: result.display_name
        };
      } else {
        console.log("❌ No geocoding results found");
        return null;
      }
    } else {
      console.error("❌ Geocoding request failed:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("❌ Geocoding error:", error);
    return null;
  }
}

// Initialize UI event listeners
document.addEventListener("DOMContentLoaded", function() {
  // Modal close buttons
  const modalCloseBtn = document.querySelector(".modal-close");
  const cancelBtn = document.getElementById("cancel-partner");
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", hidePartnerForm);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener("click", hidePartnerForm);
  }

  // Geocode button
  const geocodeBtn = document.getElementById("geocode-address");
  if (geocodeBtn) {
    geocodeBtn.addEventListener("click", async function() {
      const addressField = document.getElementById("partner-address");
      const latField = document.getElementById("partner-latitude");
      const lngField = document.getElementById("partner-longitude");
      const statusDiv = document.querySelector(".geocoding-status");
      
      const address = addressField.value.trim();
      if (!address) {
        if (statusDiv) {
          statusDiv.className = "geocoding-status geocoding-error";
          statusDiv.textContent = "Please enter an address first";
        }
        return;
      }

      // Show loading
      geocodeBtn.textContent = "Geocoding...";
      geocodeBtn.disabled = true;
      
      if (statusDiv) {
        statusDiv.className = "geocoding-status";
        statusDiv.textContent = "Looking up address...";
      }

      try {
        const result = await geocodeAddress(address);
        
        if (result) {
          latField.value = result.latitude.toFixed(6);
          lngField.value = result.longitude.toFixed(6);
          
          if (statusDiv) {
            statusDiv.className = "geocoding-status geocoding-success";
            statusDiv.textContent = "✓ Address found and coordinates updated";
          }
          
          // Update temporary marker if it exists
          if (window.currentTempMarker) {
            window.partnerMap.removeLayer(window.currentTempMarker);
            window.currentTempMarker = L.marker([result.latitude, result.longitude], {
              opacity: 0.7
            }).addTo(window.partnerMap);
            
            // Pan map to new location
            window.partnerMap.setView([result.latitude, result.longitude], window.partnerMap.getZoom());
          }
          
        } else {
          if (statusDiv) {
            statusDiv.className = "geocoding-status geocoding-error";
            statusDiv.textContent = "✗ Address not found. Please check and try again.";
          }
        }
      } catch (error) {
        if (statusDiv) {
          statusDiv.className = "geocoding-status geocoding-error";
          statusDiv.textContent = "✗ Geocoding failed. Please try again.";
        }
      } finally {
        geocodeBtn.textContent = "Geocode Address";
        geocodeBtn.disabled = false;
      }
    });
  }

  // Close modal when clicking outside
  const modal = document.getElementById("partner-modal");
  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        hidePartnerForm();
      }
    });
  }
});

// Placeholder functions for edit/delete (Future implementation)
function editPartner(partnerId) {
  alert(
    `Edit functionality coming soon!\nPartner ID: ${partnerId}`
  );
}

function deletePartner(partnerId) {
  if (confirm("Delete this partner?")) {
    alert(
      `Delete functionality coming soon!\nPartner ID: ${partnerId}`
    );
  }
}