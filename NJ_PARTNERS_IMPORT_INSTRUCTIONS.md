# New Jersey Partners Import Instructions

This document provides instructions for importing New Jersey partners extracted from the `program_audit.md` file into the J+D Partner Network Map database.

## Overview

The import system has extracted **8 New Jersey partners** from the program audit document, including:

1. **NJ Council for the Humanities** - Statewide program partner (Connector)
2. **New Jersey Civic Information Consortium** - Funder and connector (Funder)  
3. **Atlantic Cape Community College** - Community college partner (Community College)
4. **Mercer County Community College** - Community college partner (Community College)
5. **Middlesex College** - Community college partner (Community College)
6. **Sussex County Community College** - Community college partner (Community College)
7. **F. M. Kirby Foundation** - Morris County funder (Funder)
8. **coLAB Arts** - Arts and civic engagement organization (Connector)

## Import Process

### Prerequisites

1. **Authentication Required**: You must be logged in with your J+D Airtable account
2. **Base Access**: Ensure you have write access to the "J+D Lab Network" Airtable base
3. **Browser Console Access**: The import runs via JavaScript in the browser console

### Step-by-Step Instructions

1. **Open the Application**
   - Navigate to the J+D Partner Network Map
   - Login with your Airtable account
   - Wait for successful authentication

2. **Open Browser Developer Console**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)
   - Click on the "Console" tab

3. **Run the Import**
   - Type the following command in the console:
   ```javascript
   startNJPartnersImport()
   ```
   - Press Enter to execute

4. **Monitor Progress**
   - The import will process each partner sequentially
   - Watch console output for progress updates
   - Geocoding and database operations will be logged

5. **Review Results**
   - A summary dialog will appear when complete
   - Check console logs for detailed information
   - Verify partners appear on the map

### What the Import Does

1. **Geocoding**: Automatically converts addresses to GPS coordinates using OpenStreetMap
2. **Data Validation**: Ensures all required fields are present
3. **Database Integration**: Saves partners to Airtable using existing API
4. **Map Integration**: Adds partner markers to the live map
5. **User Tracking**: Associates imported partners with your user account

### Expected Results

- **8 partners total** will be processed
- **7 partners** should be successfully imported (those with addresses)
- **1 partner** may be skipped (NJCIC - no specific address in source)

### Troubleshooting

**Issue**: Authentication errors
- **Solution**: Ensure you're logged in and have proper base access

**Issue**: Geocoding failures  
- **Solution**: Check partner addresses manually, may need manual coordinate entry

**Issue**: Duplicate partners
- **Solution**: Check existing database before running import

**Issue**: Rate limiting
- **Solution**: Import includes 1-second delays between requests

### Manual Verification

After import completion:

1. **Check Airtable**
   - Open the "Partners" table in Airtable
   - Verify new records with your user tracking info
   - Confirm all data fields populated correctly

2. **Check Map Display**
   - Refresh the map if needed
   - Verify partner markers appear in New Jersey
   - Test popup information accuracy

3. **Validate Data Quality**
   - Confirm coordinates place markers in correct locations
   - Check partner type classifications
   - Verify contact information accuracy

## Source Data Details

All partners extracted from:
- **Source Document**: `/data/program_audit.md`
- **Section**: "NEW JERSEY" - Partners subsection
- **Extraction Date**: Current date
- **Data Quality**: Addresses verified through web research

## Support

For issues with the import process:
1. Check browser console for detailed error messages
2. Verify authentication status
3. Confirm Airtable base permissions
4. Contact J+D technical team if problems persist

---

*This import was created by the Partner Information Extraction Specialist as part of the J+D Partner Network Map enhancement project.*