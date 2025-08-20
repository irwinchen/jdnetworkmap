/**
 * Partner Management System for J+D Partner Network Map
 * 
 * Features:
 * - State-aware marker clustering (only clusters within same state boundaries)
 * - Geometric shape markers (circle, square, diamond, triangle) with white borders
 * - Zoom-responsive clustering with different radius thresholds
 * - Airtable integration for data persistence
 * - Partner filtering by type
 * - Simplified tooltips showing name, type, and description
 * 
 * @author J+D Development Team
 * @version 2.0
 */

class PartnerManager {
    constructor(map) {
        this.map = map;
        this.partners = new Map(); // Store partners by ID
        this.markers = new Map(); // Store markers by partner ID
        this.markerCluster = null;
        this.stateClusters = new Map(); // Store cluster groups by state
        this.currentFilter = {
            civicOrgs: true,
            communityColleges: true,
            funders: true,
            generalPartners: true
        };
        
        this.initializeMarkerCluster();
        this.bindEvents();
    }
    
    /**
     * Initialize state-aware marker clustering
     */
    initializeMarkerCluster() {
        // We'll create cluster groups dynamically per state
        // This base cluster group is kept for backward compatibility but not used directly
        this.markerCluster = L.layerGroup().addTo(this.map);
    }
    
    /**
     * Get or create a cluster group for a specific state
     */
    getStateClusterGroup(state) {
        if (!this.stateClusters.has(state)) {
            const clusterGroup = L.markerClusterGroup({
                // More aggressive clustering within states
                maxClusterRadius: function(zoom) {
                    // At state level (zoom 1-6), use large radius for aggressive clustering
                    if (zoom <= 6) return 200;
                    // At regional level (zoom 7-9), medium clustering
                    if (zoom <= 9) return 100;
                    // At city level (zoom 10+), smaller clustering
                    return 50;
                },
                // Disable clustering only at very high zoom (street level)
                disableClusteringAtZoom: 12,
                // Show coverage area on hover
                showCoverageOnHover: true,
                // Zoom to bounds when clicking a cluster
                zoomToBoundsOnClick: true,
                // Animate cluster creation and removal
                animate: true,
                // Remove clusters outside visible bounds for performance
                removeOutsideVisibleBounds: true,
                // Custom icon function with state info
                iconCreateFunction: function(cluster) {
                    var childCount = cluster.getChildCount();
                    var className = 'marker-cluster-';
                    
                    if (childCount < 10) {
                        className += 'small';
                    } else if (childCount < 50) {
                        className += 'medium';
                    } else {
                        className += 'large';
                    }
                    
                    return new L.DivIcon({
                        html: '<div><span>' + childCount + '</span></div>',
                        className: 'marker-cluster ' + className,
                        iconSize: new L.Point(40, 40)
                    });
                }
            });
            
            this.stateClusters.set(state, clusterGroup);
            this.map.addLayer(clusterGroup);
        }
        
        return this.stateClusters.get(state);
    }
    
    /**
     * Determine state from coordinates (simplified state detection)
     */
    getStateFromCoordinates(lat, lng) {
        // Simplified state boundary detection using approximate coordinate ranges
        // This is a basic implementation - for production, you'd use a proper geocoding service
        const stateBoundaries = {
            'CA': { minLat: 32.5, maxLat: 42.0, minLng: -124.5, maxLng: -114.1 },
            'NY': { minLat: 40.5, maxLat: 45.0, minLng: -79.8, maxLng: -71.8 },
            'TX': { minLat: 25.8, maxLat: 36.5, minLng: -106.6, maxLng: -93.5 },
            'FL': { minLat: 24.4, maxLat: 31.0, minLng: -87.6, maxLng: -80.0 },
            'IL': { minLat: 36.9, maxLat: 42.5, minLng: -91.5, maxLng: -87.0 },
            'PA': { minLat: 39.7, maxLat: 42.3, minLng: -80.5, maxLng: -74.7 },
            'OH': { minLat: 38.4, maxLat: 41.9, minLng: -84.8, maxLng: -80.5 },
            'MI': { minLat: 41.7, maxLat: 48.3, minLng: -90.4, maxLng: -82.4 },
            'GA': { minLat: 30.3, maxLat: 35.0, minLng: -85.6, maxLng: -80.8 },
            'NC': { minLat: 33.8, maxLat: 36.6, minLng: -84.3, maxLng: -75.4 },
            'WA': { minLat: 45.5, maxLat: 49.0, minLng: -124.8, maxLng: -116.9 }
        };
        
        // Check each state boundary
        for (const [state, bounds] of Object.entries(stateBoundaries)) {
            if (lat >= bounds.minLat && lat <= bounds.maxLat && 
                lng >= bounds.minLng && lng <= bounds.maxLng) {
                return state;
            }
        }
        
        // Default to 'OTHER' if no state match found
        return 'OTHER';
    }
    
    /**
     * Bind event handlers for partner interactions
     */
    bindEvents() {
        // Map click handler for adding partners
        this.map.on('click', (e) => {
            if (window.appState && window.appState.mapMode === 'add') {
                this.handleAddPartnerClick(e);
            }
        });
    }
    
    /**
     * Handle map click for adding new partners
     */
    handleAddPartnerClick(event) {
        const { lat, lng } = event.latlng;
        
        // Create temporary marker
        const tempMarker = L.marker([lat, lng], {
            draggable: true,
            opacity: 0.7
        });
        
        // Add to map temporarily
        tempMarker.addTo(this.map);
        
        // Open partner form (this would be a modal in a real implementation)
        this.openPartnerForm(lat, lng, tempMarker);
    }
    
    /**
     * Open partner form modal (placeholder for now)
     */
    openPartnerForm(lat, lng, tempMarker) {
        // For Phase 1, just show a basic popup
        const popupContent = this.createPartnerFormPopup(lat, lng);
        
        tempMarker.bindPopup(popupContent).openPopup();
        
        // Store reference for cleanup
        window.currentTempMarker = tempMarker;
    }
    
    /**
     * Create partner form popup content
     */
    createPartnerFormPopup(lat, lng) {
        return `
            <div class="partner-form-popup">
                <h3 style="color: #FF0064; margin-bottom: 10px;">Add New Partner</h3>
                <div style="margin-bottom: 8px;">
                    <strong>Coordinates:</strong><br>
                    ${lat.toFixed(4)}, ${lng.toFixed(4)}
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Organization Name:</label>
                    <input type="text" id="partner-name" style="width: 100%; padding: 5px; border: 1px solid #FF0064; background: #2a2a2a; color: #E1E1E1;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Partner Type:</label>
                    <select id="partner-type" style="width: 100%; padding: 5px; border: 1px solid #FF0064; background: #2a2a2a; color: #E1E1E1;">
                        <option value="">Select Type...</option>
                        <option value="civic">Civic Organization</option>
                        <option value="college">Community College</option>
                        <option value="funder">Funder</option>
                        <option value="general">General Partner</option>
                    </select>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <button onclick="partnerManager.savePartner()" style="background: #FF0064; color: white; border: none; padding: 8px 15px; margin-right: 10px; cursor: pointer;">Save Partner</button>
                    <button onclick="partnerManager.cancelAddPartner()" style="background: #666; color: white; border: none; padding: 8px 15px; cursor: pointer;">Cancel</button>
                </div>
                <p style="font-size: 10px; color: #999; margin-top: 10px; text-align: center;">
                    <em>Phase 1 Demo - Full form coming in Phase 2</em>
                </p>
            </div>
        `;
    }
    
    /**
     * Save new partner (placeholder implementation)
     */
    savePartner() {
        const name = document.getElementById('partner-name')?.value;
        const type = document.getElementById('partner-type')?.value;
        
        if (!name || !type) {
            alert('Please fill in required fields');
            return;
        }
        
        if (window.currentTempMarker) {
            const { lat, lng } = window.currentTempMarker.getLatLng();
            
            // Create partner data
            const partnerData = {
                id: Date.now().toString(), // Temporary ID
                name: name,
                type: type,
                latitude: lat,
                longitude: lng,
                createdAt: new Date().toISOString()
            };
            
            // Add permanent marker
            this.addPartnerMarker(partnerData);
            
            // Remove temp marker
            this.map.removeLayer(window.currentTempMarker);
            delete window.currentTempMarker;
            
            // Exit add mode
            if (window.appState) {
                window.appState.mapMode = 'view';
                this.updateAddButtonState();
            }
            
            console.log('Partner saved:', partnerData);
        }
    }
    
    /**
     * Cancel adding partner
     */
    cancelAddPartner() {
        if (window.currentTempMarker) {
            this.map.removeLayer(window.currentTempMarker);
            delete window.currentTempMarker;
        }
        
        // Exit add mode
        if (window.appState) {
            window.appState.mapMode = 'view';
            this.updateAddButtonState();
        }
    }
    
    /**
     * Add a permanent partner marker to the map with state-aware clustering
     */
    addPartnerMarker(partner) {
        const marker = this.createPartnerMarker(partner);
        
        // Determine the state for this partner
        const state = this.getStateFromCoordinates(partner.latitude, partner.longitude);
        
        // Store state information with the partner
        partner.state = state;
        
        // Store references
        this.partners.set(partner.id, partner);
        this.markers.set(partner.id, marker);
        
        // Add to state-specific cluster group
        const stateClusterGroup = this.getStateClusterGroup(state);
        stateClusterGroup.addLayer(marker);
        
        console.log(`Added partner "${partner.name}" to ${state} cluster group`);
        
        return marker;
    }
    
    /**
     * Create a styled marker for a partner
     */
    createPartnerMarker(partner) {
        const markerOptions = this.getMarkerStyle(partner.type);
        
        const marker = L.marker([partner.latitude, partner.longitude], markerOptions);
        
        // Bind popup with partner information
        marker.bindPopup(this.createPartnerPopup(partner));
        
        // Add click handler
        marker.on('click', () => {
            this.handlePartnerMarkerClick(partner);
        });
        
        return marker;
    }
    
    /**
     * Get marker style based on partner type
     */
    getMarkerStyle(type) {
        const styles = {
            "Connector": {
                // Pink circle for connectors
                icon: this.createShapeIcon('#FF0064', 'circle')
            },
            "Information Hub": {
                // Aqua diamond for information hubs
                icon: this.createShapeIcon('#50F5C8', 'diamond')
            },
            "Funder": {
                // Green diamond for funders
                icon: this.createShapeIcon('#DCF500', 'diamond')
            },
            "News Organization": {
                // Aqua diamond for news organizations
                icon: this.createShapeIcon('#50F5C8', 'diamond')
            },
            "Community College": {
                // Blue square for community colleges
                icon: this.createShapeIcon('#143CFF', 'square')
            },
            "Library": {
                // Pink circle for libraries
                icon: this.createShapeIcon('#FF0064', 'circle')
            },
            "Other": {
                // Pink triangle for other
                icon: this.createShapeIcon('#FF0064', 'triangle')
            },
            // Legacy support for old type names
            civic: {
                icon: this.createShapeIcon('#FF0064', 'circle')
            },
            college: {
                icon: this.createShapeIcon('#143CFF', 'square')
            },
            funder: {
                icon: this.createShapeIcon('#DCF500', 'diamond')
            },
            general: {
                icon: this.createShapeIcon('#50F5C8', 'triangle')
            }
        };
        
        return styles[type] || styles["Other"];
    }
    
    /**
     * Create shape-based icon for partner markers
     */
    createShapeIcon(color, shape) {
        let shapeStyles = '';
        let iconSize = [20, 20];
        let iconAnchor = [10, 10];
        
        switch(shape) {
            case 'circle':
                shapeStyles = `
                    background-color: ${color}; 
                    width: 20px; 
                    height: 20px; 
                    border-radius: 50%; 
                    border: 1px solid white;
                    box-sizing: border-box;
                `;
                break;
            case 'square':
                shapeStyles = `
                    background-color: ${color}; 
                    width: 20px; 
                    height: 20px; 
                    border: 1px solid white;
                    box-sizing: border-box;
                `;
                break;
            case 'diamond':
                shapeStyles = `
                    background-color: ${color}; 
                    width: 14px; 
                    height: 14px; 
                    border: 1px solid white;
                    transform: rotate(45deg);
                    box-sizing: border-box;
                `;
                break;
            case 'triangle':
                shapeStyles = `
                    width: 0; 
                    height: 0; 
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 17px solid ${color};
                    filter: drop-shadow(0 0 0 1px white);
                `;
                iconAnchor = [10, 17];
                break;
            default:
                shapeStyles = `
                    background-color: ${color}; 
                    width: 20px; 
                    height: 20px; 
                    border-radius: 50%; 
                    border: 1px solid white;
                    box-sizing: border-box;
                `;
        }
        
        return L.divIcon({
            html: `<div style="${shapeStyles}"></div>`,
            className: 'partner-marker',
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: [0, -10]
        });
    }
    
    /**
     * Create popup content for partner markers
     */
    createPartnerPopup(partner) {
        const typeLabels = {
            civic: 'Civic Organization',
            college: 'Community College',
            funder: 'Funder',
            general: 'General Partner',
            "Connector": 'Connector',
            "Information Hub": 'Information Hub',
            "Funder": 'Funder',
            "News Organization": 'News Organization',
            "Community College": 'Community College',
            "Library": 'Library',
            "Other": 'Other'
        };
        
        let content = `<div class="county-info">
                <h3>${partner.name}</h3>
                <p>${typeLabels[partner.type] || partner.type}</p>`;
        
        // Add description if it exists and has content
        if (partner.description && partner.description.trim()) {
            content += `<p>${partner.description}</p>`;
        }
        
        // Add user tracking info if available (Phase 4)
        if (partner.createdByEmail || partner.dateAdded) {
            let dateText = '';
            if (partner.dateAdded) {
                try {
                    const date = new Date(partner.dateAdded);
                    dateText = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                } catch (e) {
                    dateText = 'Invalid date';
                }
            }
            
            content += `<div style="margin-top: 8px; padding-top: 5px; border-top: 1px solid rgba(255, 0, 100, 0.3); font-size: 10px; color: #999;">`;
            if (partner.createdByEmail) {
                content += `<div><strong>Added by:</strong> ${partner.createdByEmail}</div>`;
            }
            if (dateText) {
                content += `<div><strong>Date:</strong> ${dateText}</div>`;
            }
            content += `</div>`;
        }
        
        content += `<div style="margin-top: 10px;">
                    <button onclick="partnerManager.editPartner('${partner.id}')" style="background: #143CFF; color: white; border: none; padding: 5px 10px; margin-right: 5px; cursor: pointer; font-size: 11px;">Edit</button>
                    <button onclick="partnerManager.deletePartner('${partner.id}')" style="background: #666; color: white; border: none; padding: 5px 10px; cursor: pointer; font-size: 11px;">Delete</button>
                </div>
            </div>`;
        
        return content;
    }
    
    /**
     * Handle partner marker click
     */
    handlePartnerMarkerClick(partner) {
        if (window.appState && window.appState.mapMode === 'edit') {
            this.editPartner(partner.id);
        }
        // Normal click just shows popup (handled by Leaflet)
    }
    
    /**
     * Edit existing partner (placeholder)
     */
    editPartner(partnerId) {
        const partner = this.partners.get(partnerId);
        if (partner) {
            console.log('Edit partner:', partner);
            // TODO: Open edit form modal
            alert(`Edit functionality coming in Phase 2!\nPartner: ${partner.name}`);
        }
    }
    
    /**
     * Delete partner with confirmation (works with state-aware clustering)
     */
    deletePartner(partnerId) {
        const partner = this.partners.get(partnerId);
        if (partner && confirm(`Delete partner "${partner.name}"?`)) {
            // Remove marker from appropriate state cluster
            const marker = this.markers.get(partnerId);
            if (marker) {
                const state = partner.state || this.getStateFromCoordinates(partner.latitude, partner.longitude);
                const stateClusterGroup = this.getStateClusterGroup(state);
                stateClusterGroup.removeLayer(marker);
                this.markers.delete(partnerId);
            }
            
            // Remove from storage
            this.partners.delete(partnerId);
            
            console.log('Partner deleted:', partner);
        }
    }
    
    /**
     * Update add button state based on current mode
     */
    updateAddButtonState() {
        const addBtn = document.getElementById('add-partner-btn');
        const modeIndicator = document.getElementById('mode-indicator');
        
        if (window.appState && addBtn) {
            if (window.appState.mapMode === 'add') {
                addBtn.classList.add('active');
                addBtn.innerHTML = '✓';
                addBtn.title = 'Exit Add Partner Mode';
                if (modeIndicator) modeIndicator.classList.add('visible');
                document.getElementById('map').style.cursor = 'crosshair';
            } else {
                addBtn.classList.remove('active');
                addBtn.innerHTML = '+';
                addBtn.title = 'Toggle Add Partner Mode';
                if (modeIndicator) modeIndicator.classList.remove('visible');
                document.getElementById('map').style.cursor = '';
            }
        }
    }
    
    /**
     * Filter partners by type (works with state-aware clustering)
     */
    filterPartners(filters) {
        this.currentFilter = { ...filters };
        
        this.markers.forEach((marker, partnerId) => {
            const partner = this.partners.get(partnerId);
            if (partner) {
                const shouldShow = this.shouldShowPartner(partner);
                const state = partner.state || this.getStateFromCoordinates(partner.latitude, partner.longitude);
                const stateClusterGroup = this.getStateClusterGroup(state);
                
                if (shouldShow) {
                    stateClusterGroup.addLayer(marker);
                } else {
                    stateClusterGroup.removeLayer(marker);
                }
            }
        });
    }
    
    /**
     * Check if partner should be shown based on current filters
     */
    shouldShowPartner(partner) {
        const typeMap = {
            civic: 'civicOrgs',
            college: 'communityColleges',
            funder: 'funders',
            general: 'generalPartners'
        };
        
        const filterKey = typeMap[partner.type] || 'generalPartners';
        return this.currentFilter[filterKey];
    }
    
    /**
     * Get all partners data
     */
    getAllPartners() {
        return Array.from(this.partners.values());
    }
    
    /**
     * Load partners from Airtable (base: appwdh7OXsghNRy6k)
     */
    async loadPartners() {
        if (typeof loadPartnersFromAirtable === 'function') {
            const result = await loadPartnersFromAirtable();
            if (result.success) {
                // Load partners onto the map
                result.partners.forEach(partner => {
                    this.addPartnerMarker(partner);
                });
                console.log('Loaded partners from Airtable:', result.partners.length);
            }
            return result.partners;
        } else {
            console.log('Airtable integration not available');
            return [];
        }
    }
    
    /**
     * Save partners to Airtable (base: appwdh7OXsghNRy6k)
     */
    async savePartners() {
        console.log('Individual partner saves handled through createPartnerInAirtable function');
        console.log('Using Airtable base ID: appwdh7OXsghNRy6k');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PartnerManager;
} else {
    window.PartnerManager = PartnerManager;
}