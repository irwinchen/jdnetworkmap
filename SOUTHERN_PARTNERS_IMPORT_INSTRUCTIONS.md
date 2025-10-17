# Southern Design Challenge Partners Import Instructions

This document provides instructions for importing Southern Design Challenge cohort partners extracted from the `J+D_StrategicConversations.md` file into the J+D Partner Network Map database.

## Overview

The import system has extracted **9 Southern Design Challenge partners** from the Strategic Conversations document, including:

### Southern Design Challenge Cohort (2025)

**Maryland (2 partners)**
1. **Community College of Baltimore County** - Baltimore, MD (Community College)
2. **Prince George's Community College** - Largo, MD (Community College)

**Texas (2 partners)**
3. **Houston Community College** - Houston, TX (Community College)
4. **San Antonio College** - San Antonio, TX (Community College)

**Florida (2 partners)**
5. **Santa Fe College** - Gainesville, FL (Community College)
6. **Florida State College at Jacksonville** - Jacksonville, FL (Community College)

**Arkansas (1 partner)**
7. **Northwest Arkansas Community College** - Bentonville, AR (Community College)

**Mississippi (2 partners)**
8. **Jones College** - Ellisville, MS (Community College)
9. **University of Southern Mississippi Roy Howard Community Journalism Center** - Hattiesburg, MS (Community College)

## Program Context

The Southern Design Challenge is a Lumina Foundation-funded initiative that aims to:

- Support colleges in using **design thinking** to develop local news and information projects
- Provide **$5,000 seed funding** to each college for program development
- Host a **Design Summit** (November 6-8, 2025) for collaborative planning
- Reach target communities including **rural, Hispanic, and Black communities** in the South
- Selected from **11 applications** through a competitive review process

## Import Process

### Prerequisites

1. **Authentication Required**: You must be logged in with your J+D Airtable account
2. **Base Access**: Ensure you have write access to the "J+D Lab Network" Airtable base
3. **Browser Console Access**: The import runs via JavaScript in the browser console
4. **Module Loading**: The import module must be loaded in the HTML page

### Step-by-Step Instructions

#### 1. Load the Import Module

First, ensure the import module is loaded in your `index.html` file. Add this line after the other import modules:

```html
<script src="js/southern-partners-import.js"></script>
```

#### 2. Open the Application

- Navigate to the J+D Partner Network Map
- Login with your Airtable account
- Wait for successful authentication

#### 3. Open Browser Developer Console

- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (Mac)
- Click on the "Console" tab

#### 4. Run the Import

Type the following command in the console:

```javascript
startSouthernPartnersImport()
```

Press Enter to execute

#### 5. Monitor Progress

- The import will process each partner sequentially
- Watch console output for progress updates
- Each partner shows state abbreviation for geographic reference
- Pre-calculated coordinates are used (no geocoding delays)

#### 6. Review Results

- A summary dialog will appear when complete
- Check console logs for detailed information by state
- Verify partners appear on the map across the southern US

### What the Import Does

1. **Pre-calculated Coordinates**: All GPS coordinates are pre-researched and included
2. **Data Validation**: Ensures all required fields are present
3. **Database Integration**: Saves partners to Airtable using existing API
4. **Map Integration**: Adds partner markers to the live map
5. **User Tracking**: Associates imported partners with your user account
6. **Program Context**: Includes Design Challenge cohort details in notes field

### Expected Results

- **9 partners total** will be processed
- **9 partners** should be successfully imported (all have verified addresses and coordinates)
- **5 states** will be covered: Maryland, Texas, Florida, Arkansas, Mississippi
- **Geographic expansion** to the southern United States region

### Partner Details Summary

All partners include:
- **Complete addresses** (verified through web research)
- **GPS coordinates** (latitude/longitude pre-calculated)
- **Contact information** (phone, website)
- **Program context** in notes field (Lumina Foundation grant, Design Summit, $5k funding)
- **Classification** as "Community College" partner type
- **State tracking** for regional analysis

### Troubleshooting

**Issue**: Authentication errors
- **Solution**: Ensure you're logged in and have proper base access

**Issue**: Module not loaded
- **Solution**: Verify `southern-partners-import.js` is included in `index.html`

**Issue**: Import function not found
- **Solution**: Check browser console for loading confirmation message

**Issue**: Duplicate partners
- **Solution**: Check existing database before running import to avoid duplicates

**Issue**: Rate limiting
- **Solution**: Import includes 1-second delays between requests

### Manual Verification

After import completion:

#### 1. Check Airtable

- Open the "Partners" table in Airtable
- Verify new records with your user tracking info
- Confirm all data fields populated correctly
- Look for "Southern Design Challenge cohort" in notes

#### 2. Check Map Display

- Refresh the map if needed
- Verify partner markers appear across southern states:
  - Maryland (2 markers in Baltimore County area)
  - Texas (2 markers in Houston and San Antonio)
  - Florida (2 markers in Gainesville and Jacksonville)
  - Arkansas (1 marker in Bentonville)
  - Mississippi (2 markers in Ellisville and Hattiesburg)
- Test popup information accuracy

#### 3. Validate Data Quality

- Confirm coordinates place markers in correct locations
- Check all partners classified as "Community College"
- Verify contact information accuracy
- Review notes field for Design Challenge program context

### Geographic Coverage

This import expands the J+D Partner Network Map to cover:

- **Maryland**: Baltimore County, Prince George's County (D.C. metro)
- **Texas**: Houston (Southeast TX), San Antonio (Central TX)
- **Florida**: North Central FL (Gainesville), Northeast FL (Jacksonville)
- **Arkansas**: Northwest Arkansas
- **Mississippi**: South Central MS (Ellisville, Hattiesburg)

### Source Data Details

All partners extracted from:
- **Source Document**: `/data/J+D_StrategicConversations.md`
- **Section**: "DESIGN CHALLENGE" section (lines 130-182)
- **Program**: Lumina Foundation Civic Info Challenge
- **Cohort**: 2025 Design Summit cohort
- **Selection**: 8-9 partners selected from 11 applications
- **Data Quality**: Addresses and coordinates verified through web research and official college websites

## Program Integration Notes

### Design Challenge Timeline

- **Spring 2025**: Application period and selection process
- **Summer 2025**: Cohort notification and information gathering
- **November 6-8, 2025**: Design Summit (in-person)
- **2025-2026**: Program implementation with $5k seed funding
- **Ongoing**: Consultation with J+D for program development

### Colleges Not Selected

The document notes that 3 colleges were not selected for the cohort but were offered:
- Free consulting time with J+D in early 2026
- Support for continued project development
- Assistance with seeking additional resources and funding

### Partner Relationships

These partners complement existing J+D networks in:
- **New Jersey**: 4 community college cohort
- **New Mexico**: 4 community college cohort
- **Ohio/Cleveland**: Cuyahoga Community College
- **Philadelphia**: Community College of Philadelphia
- **California**: Fresno City College

## Support

For issues with the import process:

1. Check browser console for detailed error messages
2. Verify authentication status in application
3. Confirm Airtable base permissions for J+D Lab Network
4. Ensure import module is properly loaded
5. Contact J+D technical team if problems persist

## Additional Resources

- **Lumina Foundation**: Primary funder for Southern Design Challenge
- **Design Thinking Framework**: Central to program methodology
- **Community Asset Mapping**: Approach used in program design
- **Press Forward**: Additional network-building funding source mentioned

---

**Program Goal**: Support community colleges in the South in using design thinking to develop local news and information projects that serve historically marginalized communities, with particular focus on rural, Hispanic, and Black communities.

---

*This import was created by the Partner Information Extraction Specialist as part of the J+D Partner Network Map enhancement project. All data verified through official college websites and program documentation.*
