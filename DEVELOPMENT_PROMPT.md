# Claude Code Development Prompt: Partner Mapping Feature

## Project Context

You are working on a Journalism + Design (J+D) interactive mapping application that currently displays US state boundaries with sample data. The application is built with Leaflet.js and follows the J+D brand guidelines with a dark theme (#373737 background, #FF0064 pink accents).

**Current State:**

- Working interactive US state map with Leaflet
- J+D branded styling and logo
- State-level popups with sample data
- Responsive design
- Located at: `/Users/irwinchen/apps/MCP/J+D/Map/index.html`

## New Feature Requirements

### Core Functionality: Partner Point Management

Develop a feature that allows users to add, edit, and visualize partner organizations on the map by:

1. **Zooming into states** to reveal county-level detail
2. **Adding partner points** via map clicks or address input
3. **Categorizing partners** into four types:
   - Civic Organizations
   - Community Colleges
   - Funders
   - General Partners
4. **Storing data** in a new Airtable table called "Partners"
5. **Managing points** with edit/delete capabilities

### User Experience Flow

#### Phase 1: Enhanced Map Interaction

- **State Level (Zoom 1-6)**: Current state boundary view
- **County Level (Zoom 7+)**: Switch to detailed county boundaries
- **Add Mode Toggle**: Button to enable/disable point addition mode
- **Click to Add**: When in add mode, clicking map opens partner form

#### Phase 2: Partner Form Modal

- **Organization Name** (required text field)
- **Partner Type** (required dropdown: Civic Organization, Community College, General Partner)
- **Address** (text field with geocoding validation)
- **Contact Person** (optional text field)
- **Contact Email** (optional email field)
- **Description** (optional textarea)
- **Website** (optional URL field)
- **Coordinates** (auto-populated from map click or geocoded address)

#### Phase 3: Visual Representation

- **Custom Markers** for each partner type:
  - Civic Organizations: Pink circle with community icon
  - Community Colleges: Blue square with education icon
  - General Partners: Aqua triangle with partnership icon
- **Marker Clustering** when zoomed out to avoid overlap
- **Info Popups** showing partner details on marker click

#### Phase 4: Data Management

- **Edit Mode**: Click marker to edit existing partner
- **Delete Function**: Remove partners with confirmation
- **Filter Controls**: Show/hide partner types
- **Search Functionality**: Find partners by name or location

## Technical Specifications

### Airtable Integration

**New Table: "Partners"**

```
Fields:
- id (auto-generated primary key)
- name (single line text, required)
- type (single select: "Civic Organization", "Community College", "General Partner")
- address (long text)
- latitude (number, decimal)
- longitude (number, decimal)
- contact_person (single line text)
- contact_email (email)
- description (long text)
- website (URL)
- created_date (created time)
- modified_date (last modified time)
- state (single line text, auto-populated)
- county (single line text, auto-populated)
```

### API Requirements

- **Create Partner**: POST new partner to Airtable
- **Read Partners**: GET all partners or filtered by bounds/type
- **Update Partner**: PATCH existing partner data
- **Delete Partner**: DELETE partner record
- **Geocoding**: Convert addresses to coordinates (use Leaflet geocoding plugin)
- **Reverse Geocoding**: Get state/county from coordinates

### UI/UX Requirements

#### Design System Compliance

- **Colors**: Maintain J+D palette (#373737, #FF0064, #143CFF, #DCF500, #50F5C8)
- **Typography**: Georgia for headings, Monaco for data labels
- **Component Styling**: Match existing header and popup styles
- **Responsive**: Mobile-friendly forms and controls

#### New UI Components

1. **Add Partner Button**: Floating action button (bottom-right)
2. **Partner Form Modal**: Overlay form with J+D styling
3. **Filter Panel**: Collapsible sidebar for partner type filtering
4. **Partner List View**: Optional table view of all partners
5. **Loading States**: Indicators for API operations
6. **Success/Error Messages**: Toast notifications for user feedback

### Data Flow Architecture

#### State Management

```javascript
const appState = {
  mapMode: "view" | "add" | "edit",
  selectedPartner: null,
  partners: [],
  filters: {
    civicOrgs: true,
    communityColleges: true,
    generalPartners: true,
  },
  currentBounds: null,
  zoomLevel: 4,
};
```

#### Event Handlers

- **Map Click**: Handle add mode vs. normal interaction
- **Marker Click**: Show partner details or enter edit mode
- **Form Submit**: Validate and save partner data
- **Filter Toggle**: Update marker visibility
- **Zoom Change**: Switch between state/county views

## Development Approach

### Phase 1: Foundation (MVP)

1. Add county-level GeoJSON data loading
2. Implement zoom-based view switching
3. Create basic add mode toggle
4. Set up Airtable Partners table structure

### Phase 2: Core Features

1. Implement partner form modal
2. Add marker creation and management
3. Integrate Airtable CRUD operations
4. Add basic geocoding functionality

### Phase 3: Enhancement

1. Add marker clustering
2. Implement filter controls
3. Add edit/delete functionality
4. Improve error handling and validation

### Phase 4: Polish

1. Add search functionality
2. Implement partner list view
3. Add data export capabilities
4. Performance optimization

## File Structure Organization

```
J+D/Map/
├── index.html (main application)
├── js/
│   ├── partners.js (partner management logic)
│   ├── airtable.js (API integration)
│   ├── geocoding.js (address/coordinate utilities)
│   └── ui-components.js (modal, forms, controls)
├── css/
│   └── partners.css (additional styling)
├── data/
│   ├── us-counties.geojson (county boundaries)
│   └── sample-partners.json (development data)
└── README.md (updated documentation)
```

## Quality Assurance Requirements

### Testing Scenarios

- **Add Partner**: Successful creation with all field types
- **Edit Partner**: Modify existing partner information
- **Delete Partner**: Remove partner with confirmation
- **Geocoding**: Address validation and coordinate accuracy
- **Mobile Use**: Touch interactions and responsive forms
- **Error Handling**: Network failures, invalid data, API errors
- **Performance**: Large dataset rendering, marker clustering

### Success Criteria

- ✅ Users can successfully add partners through map interaction
- ✅ All partner types display with correct visual styling
- ✅ Data persists accurately in Airtable
- ✅ Interface remains responsive on mobile devices
- ✅ Error states provide clear user feedback
- ✅ Performance remains smooth with 100+ partners

## Additional Considerations

### Security

- Validate all user inputs before API submission
- Sanitize data for XSS prevention
- Implement rate limiting for API calls
- Use HTTPS for all external requests

### Accessibility

- Keyboard navigation for all interactive elements
- Screen reader compatible labels and descriptions
- High contrast mode compatibility
- Focus indicators for form elements

### Performance

- Lazy load county data only when needed
- Implement partner data pagination for large datasets
- Use marker clustering to handle dense partner concentrations
- Cache geocoding results to reduce API calls

### Future Extensibility

- Design API structure to support additional partner fields
- Create modular component architecture for easy feature additions
- Plan for potential integration with other mapping services
- Consider offline functionality for mobile users

## Deliverable Expectations

Please develop this feature incrementally, starting with the MVP foundation and building up to the full feature set. Provide clear commit messages, maintain code documentation, and ensure all new functionality integrates seamlessly with the existing J+D branded interface.

The goal is to create an intuitive, professional partner mapping tool that allows the J+D team to efficiently manage and visualize their network of civic organizations, community colleges, and general partners across the United States.
