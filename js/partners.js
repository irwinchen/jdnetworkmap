/**
 * Partner Management System for J+D Partner Network Map
 * Handles partner data operations, marker creation, and UI interactions
 */

class PartnerManager {
    constructor(map) {
        this.map = map;
        this.partners = new Map(); // Store partners by ID
        this.markers = new Map(); // Store markers by partner ID
        this.markerCluster = null;
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
     * Initialize marker clustering for better performance
     */
    initializeMarkerCluster() {
        // Configure marker clustering with custom options
        this.markerCluster = L.markerClusterGroup({
            // More aggressive clustering - larger radius for state-level clustering
            maxClusterRadius: function(zoom) {
                // At state level (zoom 1-6), use large radius for aggressive clustering
                if (zoom <= 6) return 200;
                // At regional level (zoom 7-9), medium clustering
                if (zoom <= 9) return 100;
                // At city level (zoom 10+), disable clustering
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
            // Custom icon function for different cluster sizes
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
        
        // Add cluster group to map
        this.map.addLayer(this.markerCluster);
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
     * Add a permanent partner marker to the map
     */
    addPartnerMarker(partner) {
        const marker = this.createPartnerMarker(partner);
        
        // Store references
        this.partners.set(partner.id, partner);
        this.markers.set(partner.id, marker);
        
        // Add to cluster group
        this.markerCluster.addLayer(marker);
        
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
            general: 'General Partner'
        };
        
        return `
            <div class="county-info">
                <h3>${partner.name}</h3>
                <p><strong>Type:</strong> ${typeLabels[partner.type] || partner.type}</p>
                <p><strong>Location:</strong> ${partner.latitude.toFixed(4)}, ${partner.longitude.toFixed(4)}</p>
                <p><strong>Added:</strong> ${new Date(partner.createdAt).toLocaleDateString()}</p>
                <div style="margin-top: 10px;">
                    <button onclick="partnerManager.editPartner('${partner.id}')" style="background: #143CFF; color: white; border: none; padding: 5px 10px; margin-right: 5px; cursor: pointer; font-size: 11px;">Edit</button>
                    <button onclick="partnerManager.deletePartner('${partner.id}')" style="background: #666; color: white; border: none; padding: 5px 10px; cursor: pointer; font-size: 11px;">Delete</button>
                </div>
            </div>
        `;
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
     * Delete partner with confirmation
     */
    deletePartner(partnerId) {
        const partner = this.partners.get(partnerId);
        if (partner && confirm(`Delete partner "${partner.name}"?`)) {
            // Remove marker
            const marker = this.markers.get(partnerId);
            if (marker) {
                this.markerCluster.removeLayer(marker);
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
     * Filter partners by type
     */
    filterPartners(filters) {
        this.currentFilter = { ...filters };
        
        this.markers.forEach((marker, partnerId) => {
            const partner = this.partners.get(partnerId);
            if (partner) {
                const shouldShow = this.shouldShowPartner(partner);
                if (shouldShow) {
                    this.markerCluster.addLayer(marker);
                } else {
                    this.markerCluster.removeLayer(marker);
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