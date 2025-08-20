/**
 * Layer Management System for J+D Partner Network Map
 * 
 * Manages multiple data layers with a 3-layer limit:
 * - Base map tiles (always active)
 * - J+D Partners layer (always active, highest z-index)
 * - Up to 1 additional selectable layer
 * 
 * @author J+D Development Team
 * @version 1.0
 */

class LayerManager {
    constructor(map) {
        this.map = map;
        this.activeLayers = new Map();
        this.availableLayers = new Map();
        this.maxAdditionalLayers = 1; // Limit: base + J+D + 1 additional
        this.layerConfigs = this.initializeLayerConfigs();
        
        // Initialize UI
        this.initializeUI();
        
        // Initialize Lucide icons
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
        
        // Always add J+D partners as the base layer
        this.activeLayers.set('jd-partners', {
            id: 'jd-partners',
            name: 'J+D Partners',
            type: 'base',
            visible: true,
            count: 0,
            zIndex: 200,
            layer: null // Will be set by existing partner system
        });
        
        console.log('🎛️ LayerManager initialized');
        
        // Pre-load layer counts for better UX
        this.preloadLayerCounts();
    }
    
    /**
     * Initialize layer configurations
     */
    initializeLayerConfigs() {
        return {
            'public-libraries': {
                id: 'public-libraries',
                name: 'Public Libraries',
                color: '#8B5CF6',
                markerShape: 'square',
                zIndex: 100,
                dataSource: {
                    type: 'mock',
                    count: 0,
                    fieldMapping: {
                        id: ['lib_id', 'fscskey', 'id', 'ID'],
                        name: ['libname', 'library_name', 'name', 'NAME'],
                        lat: ['latitude', 'LATITUDE', 'lat', 'LAT', 'y'],
                        lng: ['longitude', 'LONGITUDE', 'lng', 'LON', 'LONG', 'x'],
                        address: ['address', 'ADDRESS', 'street', 'location'],
                        city: ['city', 'CITY', 'town', 'TOWN'],
                        state: ['stabr', 'state', 'STATE', 'st'],
                        zip: ['zip', 'ZIP', 'zipcode', 'postal_code'],
                        website: ['webaddr', 'website', 'url', 'web_address']
                    }
                },
                clustering: {
                    enabled: true,
                    maxRadius: 50
                }
            },
            'community-colleges': {
                id: 'community-colleges',
                name: 'Community Colleges',
                color: '#F59E0B',
                markerShape: 'circle',
                zIndex: 110,
                dataSource: {
                    type: 'csv',
                    url: '/data/hd2023.csv',
                    filters: {
                        SECTOR: '4',
                        ICLEVEL: '2',
                        CYACTIVE: '1'
                    },
                    fieldMapping: {
                        id: ['UNITID', 'ID', 'id'],
                        name: ['INSTNM', 'NAME', 'name', 'institution_name', 'org_name'],
                        lat: ['LATITUDE', 'lat', 'latitude', 'LAT', 'y', 'Y'],
                        lng: ['LONGITUD', 'LONGITUDE', 'lng', 'longitude', 'LON', 'LONG', 'x', 'X'],
                        address: ['ADDR', 'ADDRESS', 'address', 'street', 'street_address'],
                        city: ['CITY', 'city', 'TOWN', 'town'],
                        state: ['STABBR', 'STATE', 'state', 'ST', 'st'],
                        zip: ['ZIP', 'zip', 'zipcode', 'postal_code', 'ZIPCODE'],
                        website: ['WEBADDR', 'WEBSITE', 'website', 'url', 'URL', 'web_url']
                    }
                },
                clustering: {
                    enabled: true,
                    maxRadius: 50
                }
            },
            'civic-organizations': {
                id: 'civic-organizations',
                name: 'Civic Organizations',
                color: '#10B981',
                markerShape: 'diamond',
                zIndex: 120,
                dataSource: {
                    type: 'mock',
                    count: 0,
                    fieldMapping: {
                        id: ['org_id', 'id', 'ID', 'organization_id'],
                        name: ['org_name', 'organization_name', 'name', 'NAME'],
                        lat: ['latitude', 'LATITUDE', 'lat', 'LAT', 'y'],
                        lng: ['longitude', 'LONGITUDE', 'lng', 'LON', 'LONG', 'x'],
                        address: ['address', 'ADDRESS', 'street', 'location'],
                        city: ['city', 'CITY', 'town', 'TOWN'],
                        state: ['state', 'STATE', 'st', 'ST'],
                        zip: ['zip', 'ZIP', 'zipcode', 'postal_code'],
                        website: ['website', 'url', 'web_address', 'homepage']
                    }
                },
                clustering: {
                    enabled: true,
                    maxRadius: 50
                }
            },
            'news-organizations': {
                id: 'news-organizations',
                name: 'News Organizations',
                color: '#EF4444',
                markerShape: 'triangle',
                zIndex: 130,
                dataSource: {
                    type: 'mock',
                    count: 0,
                    fieldMapping: {
                        id: ['outlet_id', 'media_id', 'id', 'ID'],
                        name: ['outlet_name', 'media_name', 'publication_name', 'name', 'NAME'],
                        lat: ['latitude', 'LATITUDE', 'lat', 'LAT', 'y'],
                        lng: ['longitude', 'LONGITUDE', 'lng', 'LON', 'LONG', 'x'],
                        address: ['address', 'ADDRESS', 'street', 'location'],
                        city: ['city', 'CITY', 'town', 'TOWN'],
                        state: ['state', 'STATE', 'st', 'ST'],
                        zip: ['zip', 'ZIP', 'zipcode', 'postal_code'],
                        website: ['website', 'url', 'web_address', 'homepage']
                    }
                },
                clustering: {
                    enabled: true,
                    maxRadius: 50
                }
            }
        };
    }
    
    /**
     * Initialize UI event handlers
     */
    initializeUI() {
        // Panel collapse/expand toggle
        const panelToggle = document.getElementById('layers-toggle');
        if (panelToggle) {
            panelToggle.addEventListener('click', () => {
                this.togglePanel();
            });
        }
        
        // Layer visibility toggles
        const layerToggles = document.querySelectorAll('.layer-toggle[data-action="toggle"]');
        layerToggles.forEach(toggle => {
            toggle.addEventListener('click', async (e) => {
                const layerItem = e.target.closest('.layer-item');
                const layerId = layerItem.dataset.layer;
                
                // Prevent multiple clicks during loading
                if (layerItem.classList.contains('loading')) {
                    return;
                }
                
                await this.toggleLayer(layerId);
            });
        });
        
        console.log('🎛️ Layer UI initialized');
    }
    
    /**
     * Toggle the layers panel visibility
     */
    togglePanel() {
        const panel = document.getElementById('layers-panel');
        const toggleButton = panel.querySelector('#layers-toggle');
        const toggleIcon = toggleButton.querySelector('.toggle-icon');
        
        panel.classList.toggle('collapsed');
        
        if (panel.classList.contains('collapsed')) {
            toggleButton.setAttribute('title', 'Show Layers Panel');
            toggleIcon.setAttribute('data-lucide', 'chevron-right');
        } else {
            toggleButton.setAttribute('title', 'Hide Layers Panel');
            toggleIcon.setAttribute('data-lucide', 'chevron-down');
        }
        
        // Refresh Lucide icons after changing the icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Toggle layer visibility
     */
    async toggleLayer(layerId) {
        console.log('🎛️ Toggle layer:', layerId);
        
        const layerItem = document.querySelector(`[data-layer="${layerId}"]`);
        const toggle = layerItem.querySelector('.layer-toggle');
        
        if (this.activeLayers.has(layerId)) {
            // Layer is active, deactivate it
            this.deactivateLayer(layerId);
        } else {
            // Layer is not active, try to activate it
            if (this.canActivateLayer()) {
                await this.activateLayer(layerId);
            } else {
                this.showLayerLimitMessage();
            }
        }
        
        this.updateUI();
    }
    
    /**
     * Check if we can activate another layer
     */
    canActivateLayer() {
        const additionalLayersActive = this.activeLayers.size - 1; // Minus J+D base layer
        return additionalLayersActive < this.maxAdditionalLayers;
    }
    
    /**
     * Activate a layer
     */
    async activateLayer(layerId) {
        const config = this.layerConfigs[layerId];
        if (!config) {
            console.error('Layer config not found:', layerId);
            return;
        }
        
        console.log('🎛️ Activating layer:', layerId);
        
        // Show loading state
        this.setLayerLoadingState(layerId, true);
        
        try {
            // Create layer based on data source type
            const layerData = await this.createLayerFromConfig(config);
            
            // Add clustering if enabled
            let finalLayer = layerData.layer;
            if (config.clustering && config.clustering.enabled && layerData.count > 10) {
                finalLayer = this.createClusteredLayer(layerData.layer, config);
            }
            
            this.activeLayers.set(layerId, {
                id: layerId,
                name: config.name,
                type: 'additional',
                visible: true,
                count: layerData.count,
                zIndex: config.zIndex,
                layer: finalLayer
            });
            
            // Add to map
            if (finalLayer) {
                this.map.addLayer(finalLayer);
            }
            
            console.log(`✅ Layer "${config.name}" activated with ${layerData.count} items`);
            
        } catch (error) {
            console.error(`❌ Failed to activate layer "${config.name}":`, error);
            
            // Show error state and fallback to mock
            const mockLayer = this.createMockLayer(config);
            this.activeLayers.set(layerId, {
                id: layerId,
                name: config.name,
                type: 'additional',
                visible: true,
                count: mockLayer.count,
                zIndex: config.zIndex,
                layer: mockLayer.layer
            });
            
            if (mockLayer.layer) {
                this.map.addLayer(mockLayer.layer);
            }
        } finally {
            this.setLayerLoadingState(layerId, false);
        }
    }
    
    /**
     * Deactivate a layer
     */
    deactivateLayer(layerId) {
        if (!this.activeLayers.has(layerId)) return;
        
        const layerData = this.activeLayers.get(layerId);
        console.log('🎛️ Deactivating layer:', layerId);
        
        // Don't allow deactivating the base J+D layer
        if (layerData.type === 'base') {
            console.log('⚠️ Cannot deactivate base J+D Partners layer');
            return;
        }
        
        // Remove from map
        if (layerData.layer && this.map.hasLayer(layerData.layer)) {
            this.map.removeLayer(layerData.layer);
        }
        
        // Remove from active layers
        this.activeLayers.delete(layerId);
        
        console.log(`❌ Layer "${layerData.name}" deactivated`);
    }
    
    /**
     * Create a layer based on configuration (supports CSV, mock, and other sources)
     */
    async createLayerFromConfig(config) {
        console.log('🎛️ Creating layer for:', config.name, 'Type:', config.dataSource.type);
        
        switch (config.dataSource.type) {
            case 'csv':
                return await this.createCsvLayer(config);
            case 'geojson':
                return await this.createGeoJsonLayer(config);
            case 'mock':
            default:
                return this.createMockLayer(config);
        }
    }
    
    /**
     * Create layer from CSV data source
     */
    async createCsvLayer(config) {
        try {
            console.log('📊 Loading CSV data from:', config.dataSource.url);
            
            const response = await fetch(config.dataSource.url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            const data = this.parseCsv(csvText);
            const filteredData = this.applyFilters(data, config.dataSource.filters);
            
            return this.createMarkersFromData(filteredData, config);
            
        } catch (error) {
            console.error('❌ Error loading CSV layer:', error);
            // Fallback to mock layer
            return this.createMockLayer(config);
        }
    }
    
    /**
     * Parse CSV text into array of objects
     */
    parseCsv(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        
        console.log(`📊 Parsed ${data.length} rows from CSV`);
        return data;
    }
    
    /**
     * Parse a single CSV line handling quoted values
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
    
    /**
     * Apply filters to data array
     */
    applyFilters(data, filters) {
        if (!filters || Object.keys(filters).length === 0) {
            return data;
        }
        
        const filtered = data.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                return row[key] && row[key].toString() === value.toString();
            });
        });
        
        console.log(`🔍 Filtered ${data.length} rows to ${filtered.length} matching records`);
        return filtered;
    }
    
    /**
     * Resolve field mapping to actual column names from data
     */
    resolveFieldMapping(data, fieldMapping) {
        if (!data.length) return {};
        
        const sampleRow = data[0];
        const availableFields = Object.keys(sampleRow);
        const resolvedMapping = {};
        
        Object.entries(fieldMapping).forEach(([key, possibleFields]) => {
            // If it's already a string, keep it as-is for backwards compatibility
            if (typeof possibleFields === 'string') {
                resolvedMapping[key] = possibleFields;
                return;
            }
            
            // If it's an array, find the first match
            if (Array.isArray(possibleFields)) {
                const matchedField = possibleFields.find(field => 
                    availableFields.includes(field)
                );
                resolvedMapping[key] = matchedField || possibleFields[0]; // fallback to first option
            }
        });
        
        console.log('🗂️ Resolved field mapping:', resolvedMapping);
        console.log('📋 Available fields:', availableFields.slice(0, 10), availableFields.length > 10 ? '...' : '');
        
        return resolvedMapping;
    }
    
    /**
     * Create Leaflet markers from data array
     */
    createMarkersFromData(data, config) {
        const mapping = this.resolveFieldMapping(data, config.dataSource.fieldMapping);
        const layerGroup = L.layerGroup();
        let validMarkers = 0;
        
        data.forEach((row, index) => {
            try {
                const lat = parseFloat(row[mapping.lat]);
                const lng = parseFloat(row[mapping.lng]);
                
                // Debug first few coordinate pairs
                if (index < 5) {
                    console.log(`🔍 Row ${index}: lat=${row[mapping.lat]} (${lat}), lng=${row[mapping.lng]} (${lng})`);
                }
                
                // Skip rows with invalid coordinates
                if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                    if (index < 10) {
                        console.warn(`⚠️ Skipping row ${index}: invalid coordinates lat=${lat}, lng=${lng}`);
                    }
                    return;
                }
                
                // Create marker
                const marker = this.createStyledMarker([lat, lng], config, row, mapping);
                layerGroup.addLayer(marker);
                validMarkers++;
                
            } catch (error) {
                console.warn(`⚠️ Skipping invalid data row ${index}:`, error);
            }
        });
        
        console.log(`✅ Created ${validMarkers} markers for ${config.name}`);
        
        return {
            layer: layerGroup,
            count: validMarkers
        };
    }
    
    /**
     * Create a styled marker based on layer configuration
     */
    createStyledMarker(coordinates, config, data, mapping) {
        // Create marker with custom icon
        const marker = L.circleMarker(coordinates, {
            radius: 8,
            fillColor: config.color,
            color: '#ffffff',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7,
            className: `layer-marker ${config.id}`,
            // Prevent hover jitter by controlling pointer events
            pane: 'markerPane'
        });
        
        // Add popup with data
        const popupContent = this.createPopupContent(data, mapping, config);
        marker.bindPopup(popupContent);
        
        // Add tooltip
        const name = data[mapping.name] || 'Unknown';
        marker.bindTooltip(name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });
        
        return marker;
    }
    
    /**
     * Create popup content for marker
     */
    createPopupContent(data, mapping, config) {
        const name = data[mapping.name] || 'Unknown';
        const address = data[mapping.address] || '';
        const city = data[mapping.city] || '';
        const state = data[mapping.state] || '';
        const zip = data[mapping.zip] || '';
        const website = data[mapping.website] || '';
        
        let html = `<div class="layer-popup ${config.id}">`;
        html += `<h3 style="color: ${config.color}; margin-bottom: 8px;">${name}</h3>`;
        
        if (address) {
            html += `<p><strong>Address:</strong><br>${address}`;
            if (city || state || zip) {
                html += `<br>${city}${city && (state || zip) ? ', ' : ''}${state}${state && zip ? ' ' : ''}${zip}`;
            }
            html += '</p>';
        }
        
        if (website && website !== ' ') {
            const url = website.startsWith('http') ? website : `https://${website}`;
            html += `<p><a href="${url}" target="_blank" rel="noopener">Visit Website</a></p>`;
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * Create layer from GeoJSON data source
     */
    async createGeoJsonLayer(config) {
        try {
            console.log('🗺️ Loading GeoJSON data from:', config.dataSource.url);
            
            const response = await fetch(config.dataSource.url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const geojsonData = await response.json();
            const layerGroup = L.geoJSON(geojsonData, {
                pointToLayer: (feature, latlng) => {
                    // For GeoJSON, resolve mapping against feature properties
                    const resolvedMapping = this.resolveFieldMapping([feature.properties], config.dataSource.fieldMapping);
                    return this.createStyledMarker(latlng, config, feature.properties, resolvedMapping);
                }
            });
            
            const count = geojsonData.features ? geojsonData.features.length : 0;
            console.log(`✅ Created ${count} markers from GeoJSON for ${config.name}`);
            
            return {
                layer: layerGroup,
                count: count
            };
            
        } catch (error) {
            console.error('❌ Error loading GeoJSON layer:', error);
            return this.createMockLayer(config);
        }
    }
    
    /**
     * Create a mock layer for testing
     */
    createMockLayer(config) {
        console.log('🎭 Creating mock layer for:', config.name);
        
        const mockLayer = L.layerGroup();
        const mockCount = Math.floor(Math.random() * 30) + 10; // Random 10-40 items
        
        // Add some mock markers around the US
        for (let i = 0; i < mockCount; i++) {
            const lat = 25 + Math.random() * 25; // US latitude range
            const lng = -125 + Math.random() * 50; // US longitude range
            
            const marker = L.circleMarker([lat, lng], {
                radius: 6,
                fillColor: config.color,
                color: '#ffffff',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.6,
                className: `layer-marker ${config.id} mock`
            });
            
            marker.bindPopup(`
                <div class="layer-popup ${config.id}">
                    <h3 style="color: ${config.color};">Mock ${config.name} #${i + 1}</h3>
                    <p>This is a test marker for the ${config.name} layer.</p>
                    <p><em>Real data will replace these markers.</em></p>
                </div>
            `);
            
            mockLayer.addLayer(marker);
        }
        
        return {
            layer: mockLayer,
            count: mockCount
        };
    }
    
    /**
     * Show layer limit message
     */
    showLayerLimitMessage() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'layer-limit-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>Layer Limit Reached</strong><br>
                Maximum of ${this.maxAdditionalLayers} additional layer(s) allowed
            </div>
        `;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '200px',
            right: '20px',
            background: 'rgba(255, 0, 100, 0.9)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '6px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            zIndex: '2000',
            fontSize: '12px',
            fontFamily: '"GT Pressura Mono", Monaco, monospace',
            textAlign: 'center',
            animation: 'slideIn 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * Update UI to reflect current layer states
     */
    updateUI() {
        // Update layer items
        Object.keys(this.layerConfigs).forEach(layerId => {
            const layerItem = document.querySelector(`[data-layer="${layerId}"]`);
            const toggle = layerItem.querySelector('.layer-toggle');
            const toggleEye = toggle.querySelector('.toggle-eye');
            const countElement = document.getElementById(`${layerId}-count`);
            
            if (this.activeLayers.has(layerId)) {
                layerItem.classList.add('active');
                toggle.classList.add('active');
                toggleEye.classList.remove('closed');
                toggleEye.classList.add('open');
                toggleEye.setAttribute('data-lucide', 'eye');
                const layerData = this.activeLayers.get(layerId);
                if (countElement) {
                    countElement.textContent = layerData.count;
                }
            } else {
                layerItem.classList.remove('active');
                toggle.classList.remove('active');
                toggleEye.classList.remove('open');
                toggleEye.classList.add('closed');
                toggleEye.setAttribute('data-lucide', 'eye-off');
                if (countElement) {
                    // Show cached count if available, otherwise 0
                    const config = this.layerConfigs[layerId];
                    const count = config?.cachedCount || 0;
                    countElement.textContent = count;
                }
            }
            
            // Disable toggles if at layer limit and layer is not active
            if (!this.canActivateLayer() && !this.activeLayers.has(layerId)) {
                layerItem.classList.add('disabled');
            } else {
                layerItem.classList.remove('disabled');
            }
        });
        
        // Update active layer count
        const activeCount = this.activeLayers.size;
        const countElement = document.getElementById('active-layer-count');
        if (countElement) {
            countElement.textContent = activeCount;
        }
        
        // Update J+D partners count
        const jdCountElement = document.getElementById('jd-partners-count');
        if (jdCountElement && this.activeLayers.has('jd-partners')) {
            const jdLayer = this.activeLayers.get('jd-partners');
            jdCountElement.textContent = jdLayer.count;
        }
        
        // Refresh Lucide icons after updates
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Update J+D partners count (called by existing partner system)
     */
    updateJDPartnersCount(count) {
        if (this.activeLayers.has('jd-partners')) {
            this.activeLayers.get('jd-partners').count = count;
            this.updateUI();
        }
    }
    
    /**
     * Get active layers
     */
    getActiveLayers() {
        return Array.from(this.activeLayers.values());
    }
    
    /**
     * Get layer configuration
     */
    getLayerConfig(layerId) {
        return this.layerConfigs[layerId];
    }
    
    /**
     * Check if layer is active
     */
    isLayerActive(layerId) {
        return this.activeLayers.has(layerId);
    }
    
    /**
     * Pre-load layer counts without activating layers
     */
    async preloadLayerCounts() {
        console.log('📊 Pre-loading layer counts...');
        
        const promises = Object.keys(this.layerConfigs).map(async (layerId) => {
            const config = this.layerConfigs[layerId];
            
            // Only preload for CSV data sources
            if (config.dataSource.type === 'csv') {
                try {
                    const response = await fetch(config.dataSource.url);
                    if (response.ok) {
                        const csvText = await response.text();
                        const data = this.parseCsv(csvText);
                        const filteredData = this.applyFilters(data, config.dataSource.filters);
                        
                        // Cache the count
                        this.layerConfigs[layerId].cachedCount = filteredData.length;
                        
                        console.log(`📈 Pre-loaded ${config.name}: ${filteredData.length} items`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to pre-load count for ${config.name}:`, error);
                }
            }
        });
        
        await Promise.all(promises);
        this.updateUI();
    }
    
    /**
     * Create a clustered layer for markers
     */
    createClusteredLayer(layerGroup, config) {
        console.log('🔗 Creating clustered layer for:', config.name);
        
        const clusterGroup = L.markerClusterGroup({
            maxClusterRadius: config.clustering.maxRadius || 50,
            iconCreateFunction: function(cluster) {
                const count = cluster.getChildCount();
                let className = 'marker-cluster-small';
                let size = 'small';
                
                if (count >= 100) {
                    className = 'marker-cluster-large';
                    size = 'large';
                } else if (count >= 10) {
                    className = 'marker-cluster-medium';
                    size = 'medium';
                }
                
                return new L.DivIcon({
                    html: `<div style="background-color: ${config.color};"><span>${count}</span></div>`,
                    className: `marker-cluster ${className} layer-cluster-${config.id}`,
                    iconSize: new L.Point(40, 40)
                });
            },
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });
        
        // Add all markers to cluster group
        layerGroup.eachLayer(layer => {
            clusterGroup.addLayer(layer);
        });
        
        return clusterGroup;
    }
    
    /**
     * Set loading state for a layer
     */
    setLayerLoadingState(layerId, isLoading) {
        const layerItem = document.querySelector(`[data-layer="${layerId}"]`);
        const countElement = document.getElementById(`${layerId}-count`);
        
        if (isLoading) {
            layerItem.classList.add('loading');
            if (countElement) {
                countElement.textContent = '...';
            }
        } else {
            layerItem.classList.remove('loading');
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayerManager;
} else {
    window.LayerManager = LayerManager;
}