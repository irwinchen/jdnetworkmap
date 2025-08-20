// J+D Partner Network Map - Airtable Integration

// Test Airtable authentication
async function testAirtableAuth() {
  console.log("Testing Airtable authentication...");
  console.log("Base ID:", AIRTABLE_CONFIG.baseId);
  console.log("Table Name:", AIRTABLE_CONFIG.tableName);

  if (authState.isAuthenticated && authState.accessToken) {
    console.log("Using OAuth Token for authenticated requests");
    
    try {
      const response = await fetch(
        `${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}?maxRecords=3`,
        {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Auth test response status:", response.status);
        console.log("✅ Airtable authentication successful!");
        console.log("Found records:", data.records?.length || 0);

        // Try to get table metadata if available
        try {
          const metaResponse = await fetch(
            `${AIRTABLE_CONFIG.apiUrl}/meta/bases/${AIRTABLE_CONFIG.baseId}/tables`,
            {
              headers: {
                Authorization: `Bearer ${authState.accessToken}`,
              },
            }
          );
          
          if (metaResponse.ok) {
            const metaData = await metaResponse.json();
            console.log("📋 Table metadata retrieved successfully");
          }
        } catch (e) {
          console.log("Could not fetch table metadata");
        }
      }
    } catch (error) {
      console.error("❌ Airtable request failed:", error);
    }
  }
}

// Load existing partners from Airtable and add to map
async function loadExistingPartners() {
  console.log("Loading existing partners from Airtable...");

  const result = await loadPartnersFromAirtable();

  if (result.success && result.partners.length > 0) {
    console.log(`Partners loaded from Airtable: ${result.partners.length}`);

    let validPartnersCount = 0;
    const stateGroups = new Map(); // Group partners by state for clustering

    result.partners.forEach((partner) => {
      // Validate coordinates
      if (partner.latitude && partner.longitude) {
        // Parse coordinates ensuring they are numbers
        const lat = parseFloat(partner.latitude);
        const lng = parseFloat(partner.longitude);

        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          // Create marker for this partner
          const marker = createPartnerMarker(partner, [lat, lng]);

          // Determine state for clustering (basic implementation)
          const state = partner.state || determineState(lat, lng);

          // Group markers by state
          if (!stateGroups.has(state)) {
            stateGroups.set(state, []);
          }
          stateGroups.get(state).push(marker);

          // Add individual markers to cluster group
          window.partnerMarkers.addLayer(marker);

          console.log(`Added partner "${partner.name}" to ${state} cluster group`);
          validPartnersCount++;
        } else {
          console.warn(`Invalid coordinates for partner "${partner.name}": lat=${lat}, lng=${lng}`);
        }
      } else {
        console.warn(`Missing coordinates for partner "${partner.name}"`);
      }
    });

    console.log(`✅ ${validPartnersCount} partners with valid coordinates added to map`);

    // Store partners in app state
    appState.partners = result.partners;
  } else {
    console.log("No partners found or failed to load partners");
    console.log("Result:", result);
  }
}

// Load partners from Airtable API
async function loadPartnersFromAirtable() {
  console.log("📡 Fetching partners from Airtable API...");

  if (!authState.isAuthenticated) {
    console.log("❌ Not authenticated - cannot load partners");
    return { success: false, partners: [] };
  }

  try {
    const response = await fetch(
      `${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`,
      {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Transform Airtable records to our partner format
      const partners = data.records.map((record) => ({
        id: record.id,
        name: record.fields["Partner Name"] || "Unnamed Partner",
        type: record.fields["Partner Type"] || "Other",
        address: record.fields["Address"] || "",
        description: record.fields["Description"] || "",
        contact: record.fields["Contact"] || "",
        email: record.fields["Contact Email"] || "",
        phone: record.fields["Contact Phone"] || "",
        website: record.fields["Website"] || "",
        projectLink: record.fields["Project Tracking Link"] || "",
        notes: record.fields["Notes"] || "",
        latitude: record.fields["Latitude"],
        longitude: record.fields["Longitude"],
        state: record.fields["State"] || "",
        county: record.fields["County"] || "",
        createdTime: record.createdTime,
        
        // User tracking fields (Phase 4) - may be null for existing partners
        createdByUserId: record.fields["Created By User ID"] || null,
        createdByEmail: record.fields["Created By Email"] || null,
        dateAdded: record.fields["Date Added"] || null,
      }));

      // Check if user tracking fields are available
      const partnersWithTracking = partners.filter(p => p.createdByUserId).length;
      const partnersWithoutTracking = partners.length - partnersWithTracking;
      
      console.log(`✅ Loaded ${partners.length} partners from Airtable`);
      if (partnersWithoutTracking > 0) {
        console.log(`📊 User tracking data: ${partnersWithTracking} with tracking, ${partnersWithoutTracking} legacy partners`);
      } else {
        console.log(`📊 All partners have user tracking data`);
      }
      
      return { success: true, partners };
    } else {
      console.error("❌ Failed to load partners:", response.statusText);
      return { success: false, partners: [] };
    }
  } catch (error) {
    console.error("Airtable request failed:", error);
    return { success: false, partners: [] };
  }
}

// Save partner to Airtable
async function savePartnerToAirtable(partnerData) {
  console.log("💾 Saving partner to Airtable:", partnerData);

  // Validate authentication state before saving
  if (!authState.isAuthenticated || !authState.userId || !authState.userEmail) {
    console.error("❌ Cannot save partner: User not properly authenticated");
    return { 
      success: false, 
      message: "Authentication required. Please log in again." 
    };
  }

  try {
    // Create ISO timestamp for the current moment
    const currentTimestamp = new Date().toISOString();

    const airtableRecord = {
      fields: {
        // Existing partner fields
        "Partner Name": partnerData.name,
        "Partner Type": partnerData.type,
        "Address": partnerData.address || "",
        "Description": partnerData.description || "",
        "Contact": partnerData.contact || "",
        "Contact Email": partnerData.email || "",
        "Contact Phone": partnerData.phone || "",
        "Project Tracking Link": partnerData.projectLink || "",
        "Notes": partnerData.notes || "",
        "Latitude": parseFloat(partnerData.latitude),
        "Longitude": parseFloat(partnerData.longitude),
        
        // New user tracking fields (Phase 4)
        "Created By User ID": authState.userId,
        "Created By Email": authState.userEmail,
        "Date Added": currentTimestamp,
      },
    };

    console.log("👤 Adding user tracking data:");
    console.log("  - User ID:", authState.userId);
    console.log("  - User Email:", authState.userEmail);
    console.log("  - Timestamp:", currentTimestamp);

    console.log("📋 Airtable record to save:", airtableRecord);

    const response = await fetch(
      `${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtableRecord),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Partner saved successfully:", result.id);
      return { success: true, id: result.id, data: result };
    } else {
      const errorData = await response.text();
      console.error("❌ Failed to save partner:", response.status, errorData);
      return { success: false, message: `HTTP ${response.status}: ${errorData}` };
    }
  } catch (error) {
    console.error("Airtable request failed:", error);
    return { success: false, message: error.message };
  }
}

// Update partner in Airtable
async function updatePartnerInAirtable(partnerId, partnerData) {
  console.log("🔄 Updating partner in Airtable:", partnerId, partnerData);

  try {
    const airtableRecord = {
      fields: {
        // Partner data fields (only these are updated)
        "Partner Name": partnerData.name,
        "Partner Type": partnerData.type,
        "Address": partnerData.address || "",
        "Description": partnerData.description || "",
        "Contact": partnerData.contact || "",
        "Contact Email": partnerData.email || "",
        "Contact Phone": partnerData.phone || "",
        "Project Tracking Link": partnerData.projectLink || "",
        "Notes": partnerData.notes || "",
        "Latitude": parseFloat(partnerData.latitude),
        "Longitude": parseFloat(partnerData.longitude),
        
        // NOTE: User tracking fields are NOT updated during edits
        // to preserve original creator information:
        // - "Created By User ID" (preserved)
        // - "Created By Email" (preserved) 
        // - "Date Added" (preserved)
      },
    };

    console.log("📝 Updating partner fields only (preserving creator info)");

    const response = await fetch(
      `${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}/${partnerId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtableRecord),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Partner updated successfully:", result.id);
      return { success: true, id: result.id, data: result };
    } else {
      const errorData = await response.text();
      console.error("❌ Failed to update partner:", response.status, errorData);
      return { success: false, message: `HTTP ${response.status}: ${errorData}` };
    }
  } catch (error) {
    console.error("Airtable request failed:", error);
    return { success: false, message: error.message };
  }
}

// Delete partner from Airtable
async function deletePartnerFromAirtable(partnerId) {
  console.log("🗑️ Deleting partner from Airtable:", partnerId);

  try {
    const response = await fetch(
      `${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}/${partnerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Partner deleted successfully:", result.id);
      return { success: true, id: result.id };
    } else {
      const errorData = await response.text();
      console.error("❌ Failed to delete partner:", response.status, errorData);
      return { success: false, message: `HTTP ${response.status}: ${errorData}` };
    }
  } catch (error) {
    console.error("Airtable request failed:", error);
    return { success: false, message: error.message };
  }
}

// Helper function to determine state from coordinates (basic implementation)
function determineState(lat, lng) {
  // This is a simplified implementation
  // In production, you'd use a proper geocoding service or state boundary data
  if (lat >= 40 && lng >= -125 && lng <= -114) return "CA";
  if (lat >= 41 && lng >= -104 && lng <= -95) return "NE";  
  if (lat >= 39 && lng >= -84 && lng <= -80) return "OH";
  if (lat >= 40 && lng >= -80 && lng <= -74) return "PA";
  // Add more state boundaries as needed
  return "UNKNOWN";
}