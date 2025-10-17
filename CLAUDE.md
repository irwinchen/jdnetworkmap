# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The J+D Partner Network Map is an interactive web application for visualizing and managing Journalism + Design (J+D) partnerships across the United States. It features state-aware marker clustering, Airtable OAuth authentication, and a multi-layer data visualization system.

**Stack**: Vanilla JavaScript + Leaflet.js + Airtable API + AWS Lambda (OAuth proxy)

## Development Commands

### Local Development
```bash
# Serve the application locally
python -m http.server 8000
# Then visit http://localhost:8000

# Alternative using Node.js
npx http-server -p 8000
```

### AWS Lambda OAuth Proxy
```bash
# Deploy the OAuth proxy (from lambda/ directory)
cd lambda
zip oauth-proxy.zip oauth-proxy.js
aws lambda update-function-code \
  --function-name jd-map-oauth-proxy \
  --zip-file fileb://oauth-proxy.zip
```

**Note**: This is a static site with no build process. No tests are currently implemented.

## Architecture Overview

### Core Application Structure

The application follows a modular JavaScript architecture with distinct concerns:

**Entry Point**: `index.html` loads all dependencies and modules in specific order:
1. Leaflet core & MarkerCluster plugin
2. `config.js` - OAuth & Airtable configuration + global state
3. `auth.js` - OAuth2 authentication with Airtable (PKCE flow)
4. `airtable.js` - Airtable API operations (CRUD for partners)
5. `partners.js` - Partner management & marker clustering logic
6. `layerManager.js` - Multi-layer data visualization system
7. `ui.js` - UI controls and modal dialogs
8. `app.js` - Main application initialization and orchestration

### Key Architectural Patterns

**Global State Management**: Two primary state objects in `config.js`:
- `authState`: OAuth tokens, user info, authentication status
- `appState`: Map mode, selected partner, filters, zoom level, current bounds

**State-Aware Clustering**: Partners are clustered only within state boundaries to maintain geographic coherence. Each US state gets its own `L.markerClusterGroup()` with zoom-responsive clustering radii (200px at state level → 100px regional → 50px city level).

**Authentication Flow**:
1. User initiates OAuth via `initiateOAuth()` in `auth.js`
2. Redirects to Airtable with PKCE challenge
3. Callback handled by `handleOAuthCallback()`
4. Token exchange via AWS Lambda proxy (bypasses CORS)
5. Tokens stored in `localStorage`, user info retrieved from Airtable
6. `checkExistingAuth()` validates stored tokens on page load

**Data Flow for Partners**:
1. User clicks map → `handleMapClick()` captures coordinates
2. Partner form modal opens → User fills details
3. `savePartner()` in `airtable.js` persists to Airtable
4. `loadPartners()` fetches all partners from Airtable
5. `createPartnerMarker()` generates geometric markers (circle/square/diamond/triangle)
6. Markers added to appropriate state cluster group
7. Clusters managed by `PartnerManager` class

### Multi-Layer System (In Development)

The LayerManager class (`layerManager.js`) supports a 3-layer system:
- **Base tiles**: OpenStreetMap (always active)
- **J+D Partners**: Always visible, top z-index (200+)
- **Additional layer**: One selectable overlay (libraries, colleges, civic orgs, news orgs)

Layer configuration format:
```javascript
{
  id: 'layer-name',
  name: 'Display Name',
  color: '#HEX',
  markerShape: 'circle' | 'square' | 'diamond' | 'triangle',
  dataSource: { type: 'csv' | 'geojson' | 'airtable', url: '...' },
  clustering: true/false,
  zIndex: 100-199 (J+D partners use 200+)
}
```

## Airtable Schema

**Base**: J+D Lab Network (`appwdh7OXsghNRy6k`)
**Table**: Partners

**Required Fields**:
- `Partner Name` (Single line text)
- `Partner Type` (Single select): Connector, Information Hub, Funder, News Organization, Community College, Library, Other
- `Latitude` (Number) - Must be Number type with decimal precision
- `Longitude` (Number) - Must be Number type with decimal precision

**User Tracking Fields** (Phase 5):
- `Created By User ID` (Single line text)
- `Created By Email` (Email)
- `Date Added` (Date & time)

**Optional Fields**: Address, Description, Contact, Contact Email, Contact Phone, Project Tracking Link, Notes

## OAuth Configuration

**OAuth Provider**: Airtable OAuth2 with PKCE
**Client ID**: `acff4d2d-a468-4f15-a3ee-d9cfea00512e`
**Redirect URI**: `https://master.d3u92f9fdv7kxv.amplifyapp.com/` (trailing slash required)
**Required Base**: `appwdh7OXsghNRy6k` (J+D Lab Network)
**Lambda Proxy**: `https://89ylgt7orf.execute-api.us-east-1.amazonaws.com/prod/oauth`

The AWS Lambda proxy (`lambda/oauth-proxy.js`) handles token exchange to bypass CORS restrictions. All OAuth credentials are passed through without storage.

## Partner Type Styling

Visual system uses J+D brand colors with geometric shapes:

| Partner Type | Color | Shape | Hex |
|-------------|-------|-------|-----|
| Connector | Pink | Circle | #FF0064 |
| Information Hub | Aqua | Diamond | #50F5C8 |
| Funder | Green | Diamond | #DCF500 |
| News Organization | Aqua | Diamond | #50F5C8 |
| Community College | Blue | Square | #143CFF |
| Library | Pink | Circle | #FF0064 |
| Other | Pink | Triangle | #FF0064 |

All markers have 1px white borders for visibility.

## Important Implementation Notes

**Coordinate Validation**: Always validate that Latitude/Longitude are Number type in Airtable, not text. The app includes coordinate validation and cleanup for existing partners.

**Add Partner Mode**: When `appState.mapMode === 'add'`, map click handlers create new partners. This suppresses other layer interactions.

**Marker Z-Index Hierarchy**:
- Base map: 0
- Additional data layers: 100-199
- J+D Partners: 200+ (always topmost)
- Ensures partners are always clickable

**Clustering Performance**:
- Limit to 1 active non-J+D layer to prevent data overload
- Use clustering for layers with >100 markers
- Viewport filtering renders only visible markers
- `removeOutsideVisibleBounds: true` in cluster config

**Error Handling Pattern**:
```javascript
try {
  // Operation
  console.log("✅ Success message");
} catch (error) {
  console.error("❌ Error context:", error);
  showError("User-friendly message");
  // Graceful degradation
}
```

## File Import System

**NJ Partners Import**: The `nj-partners-import.js` script processes markdown files with partner data and adds them to Airtable. See `NJ_PARTNERS_IMPORT_INSTRUCTIONS.md` for usage.

## Troubleshooting Common Issues

**"Invalid LatLng object" errors**: Ensure Latitude/Longitude fields in Airtable are "Number" type (not text).

**OAuth callback failures**: Verify redirect URI includes trailing slash and matches Airtable OAuth app configuration exactly.

**Partners not loading**: Check that OAuth token has required scopes: `data.records:read data.records:write schema.bases:read user.email:read`

**Geocoding failures**: Nominatim API requires complete address format (Street, City, State, ZIP). Rate limit: 1 request/second.

## Development Roadmap

See `DEVELOPMENT.md` for the multi-layer feature implementation plan. Current status:
- ✅ Phase 1-3: Core map, authentication, partner CRUD, state-aware clustering
- 🔧 Phase 4: Multi-layer system (in progress)
- ⏳ Phase 5: Network visualization, connection drawing, partnership recommendations

## Security Considerations

- OAuth tokens stored in `localStorage` (not cookies)
- All API calls use HTTPS
- Lambda proxy doesn't store credentials
- No PII in public data layers
- Rate limiting recommended for production Lambda endpoint
