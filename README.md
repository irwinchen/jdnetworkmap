# J+D Partner Network Map

An interactive mapping application for visualizing and managing the Journalism + Design (J+D) partner network across the United States.

## Features

### 🗺️ Interactive Map
- **State-level overview** with US boundary visualization
- **County-level detail** when zooming in (zoom level 7+)
- **City names** displayed at state zoom level
- **Custom geometric markers** (circles, squares, diamonds, triangles) with white borders
- **State-aware marker clustering** that groups nearby partners within state boundaries
- **Zoom-responsive clustering** with different radius thresholds
- **Responsive design** for desktop and mobile devices

### 👥 Partner Management
- **Add new partners** via map click interaction
- **Comprehensive partner form** with all essential fields
- **Real-time geocoding** for address-to-coordinate conversion
- **Auto-loading** of existing partners from Airtable
- **Visual feedback** during save operations
- **Coordinate validation** and error handling

### 🎨 Partner Categories
Partners are color-coded by type using J+D brand palette with geometric shapes:
- **Connector** - Pink (#FF0064) Circle
- **Information Hub** - Aqua (#50F5C8) Diamond 
- **Funder** - Green (#DCF500) Diamond
- **News Organization** - Aqua (#50F5C8) Diamond
- **Community College** - Blue (#143CFF) Square
- **Library** - Pink (#FF0064) Circle
- **Other** - Pink (#FF0064) Triangle
- All markers feature **1px white borders** for visibility

### 💾 Data Integration
- **Airtable backend** for partner data storage
- **Real-time API integration** with proper error handling
- **Automatic coordinate validation** and cleanup
- **CRUD operations** (Create, Read, Update, Delete)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/j-d-partner-map.git
   cd j-d-partner-map
   ```

2. **Open in browser**
   ```bash
   open index.html
   ```
   Or serve with a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Configure Airtable** (optional)
   - Update the Airtable configuration in `index.html`
   - Set your base ID, table name, and API token

## Usage

### Adding Partners

1. **Click "Add Partner"** button to enter add mode
2. **Click on the map** where you want to place the partner
3. **Fill out the partner form**:
   - Organization Name (required)
   - Partner Type (required)
   - Address (optional, with geocoding)
   - Contact Person, Email, Phone
   - Description and Notes
   - Project Tracking Link
4. **Click "Save Partner"** to store in Airtable
5. **Visual feedback** shows save progress

### Navigating the Map

- **Zoom in/out** using mouse wheel or zoom controls
- **Pan** by clicking and dragging
- **Click partner markers** to view details
- **State level**: Shows US states and major cities
- **County level**: Shows detailed county boundaries (zoom 7+)

## Configuration

### Airtable Setup

The application expects an Airtable base with a "Partners" table containing these fields:

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| Partner Name | Single line text | ✓ | Organization name |
| Partner Type | Single select | ✓ | Category (see options above) |
| Address | Long text | | Physical address |
| Description | Long text | | Organization description |
| Contact | Single line text | | Contact person name |
| Contact Email | Email | | Contact email address |
| Contact Phone | Phone number | | Contact phone number |
| Project Tracking Link | URL | | Link to project tracking |
| Notes | Long text | | Additional notes |
| Latitude | Number (decimal) | ✓ | Coordinate latitude |
| Longitude | Number (decimal) | ✓ | Coordinate longitude |

**Important**: Ensure Latitude and Longitude fields are set to "Number" type with decimal precision in Airtable.

### API Configuration

Update these values in `index.html`:

```javascript
const AIRTABLE_CONFIG = {
    baseId: 'your-base-id',
    tableName: 'Partners',
    apiUrl: 'https://api.airtable.com/v0',
    apiKey: 'your-api-token'
};
```

## Technical Details

### Built With
- **Leaflet.js** - Interactive mapping library
- **Airtable API** - Data storage and retrieval
- **OpenStreetMap Nominatim** - Geocoding service
- **Vanilla JavaScript** - No framework dependencies

### File Structure
```
├── index.html              # Main application file
├── js/
│   └── partners.js         # Partner management logic
├── README.md              # This file
└── DEVELOPMENT_PROMPT.md  # Original development specifications
```

### Browser Support
- Modern browsers with ES6+ support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## Development

### Implementation Status

- ✅ **Phase 1**: Enhanced map interaction with zoom-based views
- ✅ **Phase 2**: Partner form modal with geocoding
- ✅ **Phase 3**: Airtable integration and CRUD operations
- ✅ **Data Validation**: Coordinate validation and error handling
- ✅ **User Feedback**: Real-time save progress indicators
- ✅ **Marker Clustering**: State-aware clustering with geometric shapes
- ✅ **Visual Improvements**: Shape-based markers with white borders
- ⏳ **Phase 4**: Advanced filtering and search (planned)

### Current Features
- State/county boundary switching based on zoom level
- Add partner mode toggle with visual indicators
- Comprehensive partner form with all required fields
- Address geocoding using OpenStreetMap Nominatim
- Airtable data persistence with full error handling
- Real-time save feedback with progress indicators
- Coordinate validation and cleanup
- Auto-loading of existing partners
- State-aware marker clustering (only clusters within same state)
- Geometric shape markers with white borders (circle, square, diamond, triangle)
- Zoom-responsive clustering with different radius thresholds
- Simplified partner tooltips showing name, type, and description

### Recent Updates
- **Marker Clustering**: Implemented state-aware clustering using Leaflet MarkerCluster plugin
- **Geometric Markers**: Replaced circle markers with shape-based markers (circle, square, diamond, triangle)
- **Visual Enhancements**: Added 1px white borders to all markers for better visibility
- **Clustering Logic**: Only clusters markers within same state boundaries to maintain geographical coherence
- **Zoom Responsiveness**: Different clustering radii based on zoom level (200px at state level, 100px regional, 50px city level)
- **Simplified Tooltips**: Show only partner name, type, and description without field labels
- **Form Improvements**: Fixed form field collection and added comprehensive save progress feedback
- **Data Validation**: Implemented coordinate validation for existing partners
- **User Experience**: Enhanced error handling and user messaging throughout

### Planned Enhancements
- Partner filtering by type
- Search functionality
- Edit/delete capabilities for existing partners
- Bulk data export
- Performance optimizations for large datasets

## Design System

The application follows the J+D brand guidelines:

### Colors
- **Background**: `#373737` (Dark gray)
- **Primary**: `#FF0064` (Pink)
- **Secondary**: `#143CFF` (Blue)
- **Accent**: `#DCF500` (Green)
- **Tertiary**: `#50F5C8` (Aqua)
- **Text**: `#E1E1E1` (Light gray)

### Typography
- **Headings**: Georgia (fallback for GT Sectra)
- **Body**: Georgia
- **Data/Labels**: Monaco (fallback for GT Pressura Mono)

## Troubleshooting

### Common Issues

**"Invalid LatLng object" errors**
- Ensure Latitude/Longitude fields in Airtable are "Number" type
- Check that existing partners have valid coordinate values

**"Value is not an array of record IDs" errors**
- Verify Airtable field types match the expected data types
- Check that Single Select fields have the correct option values

**Geocoding not working**
- Ensure address format is complete (Street, City, State, ZIP)
- Check browser network permissions for external API calls

**Partners not loading**
- Verify Airtable API token has proper permissions
- Check browser console for authentication errors
- Confirm base ID and table name are correct

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include browser version and error messages

---

**Built for Journalism + Design** | Mapping civic partnerships across America