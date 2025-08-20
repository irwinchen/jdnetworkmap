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
                    type: 'mock', // Will be replaced with real data source
                    count: 0
                }
            },
            'community-colleges': {
                id: 'community-colleges',
                name: 'Community Colleges',
                color: '#F59E0B',
                markerShape: 'circle',
                zIndex: 110,
                dataSource: {
                    type: 'mock',
                    count: 0
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
                    count: 0
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
                    count: 0
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
            toggle.addEventListener('click', (e) => {
                const layerItem = e.target.closest('.layer-item');
                const layerId = layerItem.dataset.layer;
                this.toggleLayer(layerId);
            });
        });
        
        console.log('🎛️ Layer UI initialized');
    }
    
    /**
     * Toggle the layers panel visibility
     */
    togglePanel() {
        const panel = document.getElementById('layers-panel');
        const toggleIcon = document.querySelector('.toggle-icon');
        
        panel.classList.toggle('collapsed');
        
        if (panel.classList.contains('collapsed')) {
            toggleIcon.textContent = '▶';
            toggleIcon.parentElement.setAttribute('title', 'Show Layers Panel');
        } else {
            toggleIcon.textContent = '◀';
            toggleIcon.parentElement.setAttribute('title', 'Hide Layers Panel');
        }
    }
    
    /**
     * Toggle layer visibility
     */
    toggleLayer(layerId) {
        console.log('🎛️ Toggle layer:', layerId);
        
        const layerItem = document.querySelector(`[data-layer="${layerId}"]`);
        const toggle = layerItem.querySelector('.layer-toggle');
        
        if (this.activeLayers.has(layerId)) {
            // Layer is active, deactivate it
            this.deactivateLayer(layerId);
        } else {
            // Layer is not active, try to activate it
            if (this.canActivateLayer()) {
                this.activateLayer(layerId);
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
    activateLayer(layerId) {
        const config = this.layerConfigs[layerId];
        if (!config) {
            console.error('Layer config not found:', layerId);
            return;
        }
        
        console.log('🎛️ Activating layer:', layerId);
        
        // Create mock layer for now (will be replaced with real data loading)
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
        
        // Add to map
        if (mockLayer.layer) {
            this.map.addLayer(mockLayer.layer);
        }
        
        console.log(`✅ Layer "${config.name}" activated`);
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
     * Create a mock layer for testing (will be replaced with real data loading)
     */
    createMockLayer(config) {
        console.log('🎭 Creating mock layer for:', config.name);
        
        // For now, return empty layer with zero count
        // In real implementation, this would load data from external sources
        const mockLayer = L.layerGroup();
        
        // Add a few mock markers for demonstration
        const mockCount = Math.floor(Math.random() * 50) + 10; // Random 10-60 items
        
        // We'll add actual mock markers in the next iteration
        // For now, just return the layer group
        
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
                toggleEye.textContent = '👁';
                const layerData = this.activeLayers.get(layerId);
                if (countElement) {
                    countElement.textContent = layerData.count;
                }
            } else {
                layerItem.classList.remove('active');
                toggle.classList.remove('active');
                toggleEye.classList.remove('open');
                toggleEye.classList.add('closed');
                toggleEye.textContent = '🙈';
                if (countElement) {
                    countElement.textContent = '0';
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