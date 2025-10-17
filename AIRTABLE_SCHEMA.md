# Airtable Schema Requirements for User Tracking

## Base: J+D Lab Network (appwdh7OXsghNRy6k)
## Table: Partners

### New Columns Required for Phase 5:

1. **"Created By User ID"**
   - Field Type: Single line text
   - Purpose: Store Airtable user ID (e.g., "usr12345abc")
   - Required: Yes
   - Example: "usr12345abc"

2. **"Created By Email"** 
   - Field Type: Email
   - Purpose: Store authenticated user's email address
   - Required: Yes
   - Example: "user@domain.com"

3. **"Date Added"**
   - Field Type: Date & time
   - Purpose: Timestamp when partner was created
   - Required: Yes
   - Format: ISO 8601 (2025-01-20T15:30:00.000Z)

### Existing Columns (for reference):
- Partner Name (Single line text)
- Partner Type (Single select)
- Address (Single line text) 
- Description (Long text)
- Contact (Single line text)
- Contact Email (Email)
- Contact Phone (Phone number)
- Project Tracking Link (URL)
- Notes (Long text)
- Latitude (Number)
- Longitude (Number)

## Implementation Notes:
- These columns should be added manually to the Airtable base
- All new columns should be marked as required fields
- The code will automatically populate these fields during partner creation
- Existing partners will have empty values for these new fields initially