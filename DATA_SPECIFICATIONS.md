# Data Layer Specifications for J+D Partner Network Map

## Overview

This document defines the data specifications and requirements for implementing multi-layer functionality in the J+D Partner Network Map. The system supports 3 concurrent layers: base map tiles + J+D Partners (always active) + 1 additional selectable layer.

## Data Source Types & Formats

### 1. CSV Data Sources
**Primary Format**: Comma-separated values with headers
**Encoding**: UTF-8
**Size Limit**: 10MB max per file
**Location**: `/data/` directory

### 2. GeoJSON Data Sources  
**Format**: RFC 7946 compliant GeoJSON
**Coordinate System**: WGS84 (EPSG:4326)
**Size Limit**: 5MB max per file

### 3. Airtable Integration
**Current Use**: J+D Partners only
**Authentication**: OAuth2
**Base ID**: appwdh7OXsghNRy6k

## Layer Definitions & Data Requirements

### Layer 1: Community Colleges
**Data Source**: NCES IPEDS Data (hd2023.csv)
**Filter Criteria**: 
- `SECTOR` = 4 (Public 2-year institutions)
- `ICLEVEL` = 2 (2-year institutions)
- Active institutions only (`CYACTIVE` = 1)

**Required Fields**:
- `UNITID` (string) - Unique identifier
- `INSTNM` (string) - Institution name
- `ADDR` (string) - Street address
- `CITY` (string) - City name
- `STABBR` (string) - State abbreviation (2 chars)
- `ZIP` (string) - ZIP code
- `LONGITUDE` (float) - Longitude coordinate
- `LATITUDE` (float) - Latitude coordinate
- `WEBADDR` (string, optional) - Website URL

**Visual Properties**:
- Color: `#F59E0B` (Orange/Amber)
- Marker Shape: Circle
- Z-Index: 110
- Clustering: Enabled

### Layer 2: Public Libraries
**Data Source**: IMLS Public Libraries Survey or similar
**Format**: CSV or GeoJSON

**Required Fields**:
- `id` (string) - Unique identifier
- `name` (string) - Library name
- `address` (string) - Street address
- `city` (string) - City name
- `state` (string) - State abbreviation
- `zip` (string) - ZIP code
- `longitude` (float) - Longitude coordinate
- `latitude` (float) - Latitude coordinate
- `type` (string) - Library type (Main, Branch, etc.)
- `website` (string, optional) - Website URL

**Visual Properties**:
- Color: `#8B5CF6` (Purple/Violet)
- Marker Shape: Square
- Z-Index: 100
- Clustering: Enabled

### Layer 3: Civic Organizations
**Data Source**: Custom aggregated dataset
**Format**: CSV or GeoJSON

**Required Fields**:
- `id` (string) - Unique identifier  
- `name` (string) - Organization name
- `type` (string) - Organization type (Nonprofit, Government, etc.)
- `address` (string) - Street address
- `city` (string) - City name
- `state` (string) - State abbreviation
- `zip` (string) - ZIP code
- `longitude` (float) - Longitude coordinate
- `latitude` (float) - Latitude coordinate
- `focus_area` (string, optional) - Primary focus area
- `website` (string, optional) - Website URL

**Visual Properties**:
- Color: `#10B981` (Teal/Green)
- Marker Shape: Diamond
- Z-Index: 120
- Clustering: Enabled

### Layer 4: News Organizations
**Data Source**: Custom aggregated dataset
**Format**: CSV or GeoJSON

**Required Fields**:
- `id` (string) - Unique identifier
- `name` (string) - Organization name
- `type` (string) - Media type (Newspaper, TV, Radio, Digital)
- `address` (string) - Street address
- `city` (string) - City name
- `state` (string) - State abbreviation
- `zip` (string) - ZIP code
- `longitude` (float) - Longitude coordinate
- `latitude` (float) - Latitude coordinate
- `circulation` (integer, optional) - Circulation/reach numbers
- `website` (string, optional) - Website URL

**Visual Properties**:
- Color: `#EF4444` (Red/Coral)
- Marker Shape: Triangle
- Z-Index: 130
- Clustering: Enabled

## Data Processing Pipeline

### CSV Processing Steps
1. **Validation**: Check file format, encoding, required columns
2. **Filtering**: Apply layer-specific filter criteria
3. **Geocoding**: Validate/geocode coordinates if missing
4. **Normalization**: Standardize field formats
5. **Optimization**: Remove unnecessary columns, compress

### Real-time Data Handling
- **Caching**: 15-minute client-side cache for static data
- **Progressive Loading**: Load markers in viewport first
- **Lazy Loading**: Load additional data on zoom/pan
- **Error Handling**: Graceful degradation for missing data

## Implementation Architecture

### Data Source Adapters

```javascript
class DataSourceAdapter {
    constructor(config) {
        this.id = config.id;
        this.type = config.type; // 'csv', 'geojson', 'airtable'
        this.url = config.url;
        this.filters = config.filters;
    }
    
    async fetchData() {
        // Implementation varies by type
    }
    
    processData(rawData) {
        // Standardize to common format
        return {
            type: 'FeatureCollection',
            features: [...] // GeoJSON features
        };
    }
}
```

### Layer Configuration Format

```javascript
const LAYER_CONFIGS = {
    'community-colleges': {
        id: 'community-colleges',
        name: 'Community Colleges',
        dataSource: {
            type: 'csv',
            url: '/data/hd2023.csv',
            filters: {
                SECTOR: 4,
                ICLEVEL: 2,
                CYACTIVE: 1
            },
            fieldMapping: {
                id: 'UNITID',
                name: 'INSTNM',
                lat: 'LATITUDE',
                lng: 'LONGITUDE',
                address: 'ADDR',
                city: 'CITY',
                state: 'STABBR',
                zip: 'ZIP',
                website: 'WEBADDR'
            }
        },
        visual: {
            color: '#F59E0B',
            markerShape: 'circle',
            zIndex: 110
        },
        clustering: {
            enabled: true,
            maxRadius: 50
        }
    }
};
```

## Performance Considerations

### Data Size Limits
- **CSV Files**: 10MB max (≈ 50,000 rows)
- **GeoJSON Files**: 5MB max  
- **Total Active Markers**: 10,000 max per layer
- **Viewport Rendering**: 1,000 max visible markers

### Optimization Strategies
- **Marker Clustering**: Reduce visual complexity
- **Viewport Filtering**: Only render visible markers
- **Data Chunking**: Load data in geographic chunks
- **Coordinate Precision**: Round to 6 decimal places

## Error Handling & Validation

### Data Validation Rules
1. **Required Fields**: Must be present and non-empty
2. **Coordinate Bounds**: Must be within valid lat/lng ranges
3. **State Codes**: Must be valid 2-character US state codes
4. **URL Format**: Website URLs must be properly formatted

### Error Response Strategies
- **Missing Coordinates**: Attempt geocoding from address
- **Invalid Data**: Skip individual records, log warnings
- **Network Failures**: Use cached data, show user notification
- **Parse Errors**: Graceful degradation, partial data loading

## Future Data Sources

### Planned Additions
1. **Educational Institutions**: K-12 schools, universities
2. **Healthcare Facilities**: Hospitals, clinics, health centers
3. **Cultural Institutions**: Museums, theaters, art centers
4. **Economic Data**: Businesses, employers, demographics

### API Integration Considerations
- **Rate Limiting**: Respect API quotas and limits
- **Authentication**: Secure key management
- **Real-time Updates**: WebSocket or polling strategies
- **Data Freshness**: Cache invalidation strategies

## Security & Privacy

### Data Handling
- **PII Protection**: No personal information in public layers
- **Location Privacy**: Aggregate sensitive locations
- **Access Control**: Layer-specific permissions if needed
- **Data Retention**: Automatic cleanup of outdated cache

### Compliance
- **GDPR**: Data minimization, user consent
- **CCPA**: Transparency in data collection
- **FERPA**: Educational data privacy (if applicable)

## Testing & Quality Assurance

### Data Quality Tests
- **Completeness**: All required fields present
- **Accuracy**: Coordinate validation, address verification  
- **Consistency**: Standardized formats across sources
- **Freshness**: Data age and update frequency

### Performance Tests
- **Load Testing**: Large dataset rendering
- **Memory Usage**: Browser memory consumption
- **Network Impact**: Data transfer efficiency
- **User Experience**: Interaction responsiveness

---

**Last Updated**: 2025-01-20
**Document Version**: 1.0
**Maintained By**: J+D Development Team