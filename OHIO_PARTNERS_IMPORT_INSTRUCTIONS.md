# Ohio Partners Import Instructions

This document provides instructions for importing Ohio partners extracted from the `J+D_StrategicConversations.md` file into the J+D Partner Network Map database.

## Overview

The import system has extracted **4 Ohio partners** from the Strategic Conversations document, including:

1. **Cuyahoga Community College (Tri-C)** - Cleveland community college partner (Community College)
2. **Signal Cleveland** - Northeast Ohio news organization, key to Ohio strategy (News Organization)
3. **Neighborhood Media Foundation** - Community media coordinator and connector (Connector)
4. **Sinclair Community College** - Dayton interested partner (Community College)

## Important Note About Duplicates

**The user has mentioned that 3 Ohio partners may have already been manually added to the database.** Before running this import:

1. **Check your existing database** for Ohio partners
2. **Compare the list above** with what's already in Airtable
3. **Identify duplicates** to avoid creating duplicate records
4. **Option 1**: Remove duplicates from the import data before running
5. **Option 2**: Run the full import and manually delete duplicate records afterward

To check existing Ohio partners:
- Open your Airtable Partners table
- Filter by state or search for "Cleveland", "Ohio", "Dayton"
- Note which organizations are already present

## Import Process

### Prerequisites

1. **Authentication Required**: You must be logged in with your J+D Airtable account
2. **Base Access**: Ensure you have write access to the "J+D Lab Network" Airtable base
3. **Browser Console Access**: The import runs via JavaScript in the browser console
4. **Duplicate Check**: Review existing Ohio partners before importing

### Step-by-Step Instructions

1. **Open the Application**
   - Navigate to the J+D Partner Network Map
   - Login with your Airtable account
   - Wait for successful authentication

2. **Check for Existing Partners (IMPORTANT)**
   - Open your Airtable base in another tab
   - Check the Partners table for existing Ohio entries
   - Make note of which partners are already added

3. **Open Browser Developer Console**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)
   - Click on the "Console" tab

4. **Review Partners Before Import (Optional)**
   - Type the following command to see what will be imported:
   ```javascript
   console.table(OHIO_PARTNERS_DATA)
   ```
   - Press Enter to view the full list

5. **Run the Import**
   - Type the following command in the console:
   ```javascript
   startOhioPartnersImport()
   ```
   - Press Enter to execute

6. **Monitor Progress**
   - The import will process each partner sequentially
   - Watch console output for progress updates
   - Geocoding and database operations will be logged

7. **Review Results**
   - A summary dialog will appear when complete
   - Check console logs for detailed information
   - Verify partners appear on the map

8. **Clean Up Duplicates (If Needed)**
   - Check your Airtable Partners table
   - If any duplicates were created, delete the newer records
   - Keep the records that have the most complete information

### What the Import Does

1. **Pre-calculated Coordinates**: All partners have pre-calculated GPS coordinates for accuracy
2. **Data Validation**: Ensures all required fields are present
3. **Database Integration**: Saves partners to Airtable using existing API
4. **Map Integration**: Adds partner markers to the live map
5. **User Tracking**: Associates imported partners with your user account

### Expected Results

- **4 partners total** will be processed
- **4 partners** should be successfully imported (all have addresses and coordinates)
- **0 partners** should be skipped (all have complete location data)

However, if you already have 3 partners added:
- **1 new partner** may be added (if the other 3 are duplicates)
- **3 duplicate partners** may be created (requiring manual cleanup)

## Partner Details

### Cleveland Partners (Active J+D Program)

**Cuyahoga Community College (Tri-C)**
- Location: Downtown Cleveland (700 Carnegie Ave)
- Role: Community college partner, infrastructure support
- Program: Community Listening Fellowship, My Cleveland Agenda
- Activities: Prints flyers, hosts events, venue support

**Signal Cleveland**
- Location: Downtown Cleveland (1422 Euclid Ave)
- Role: News organization, editorial support
- Strategic Note: "Key to Ohio strategy" per Strategic Conversations
- Activities: Editorial support, final edits of Cleveland Agenda

**Neighborhood Media Foundation**
- Location: Cleveland (general)
- Role: Community media coordinator
- Contact: Rich
- Activities: Secured 4 community publishers, coordinates media outlets
- Funding: $5,000 coordinator role, $2,000 for community media support

### Dayton Partner (Potential Expansion)

**Sinclair Community College**
- Location: Downtown Dayton (444 W Third St)
- Role: Interested partner (not yet active)
- Strategic Note: Part of diversification strategy beyond Cleveland
- Status: Identified for future Ohio expansion

## Troubleshooting

**Issue**: Authentication errors
- **Solution**: Ensure you're logged in and have proper base access

**Issue**: Duplicate partners created
- **Solution**: Delete duplicate records in Airtable, keeping the most complete version

**Issue**: Import fails for specific partner
- **Solution**: Check console logs for specific error messages

**Issue**: Rate limiting
- **Solution**: Import includes 1-second delays between requests

**Issue**: Geocoding failures
- **Solution**: All coordinates are pre-calculated, but fallback geocoding is available

### Manual Verification

After import completion:

1. **Check Airtable**
   - Open the "Partners" table in Airtable
   - Verify new records with your user tracking info
   - Confirm all data fields populated correctly
   - **Check for and remove duplicates**

2. **Check Map Display**
   - Refresh the map if needed
   - Verify partner markers appear in Ohio (Cleveland and Dayton)
   - Test popup information accuracy

3. **Validate Data Quality**
   - Confirm coordinates place markers in correct locations
   - Check partner type classifications
   - Verify contact information accuracy
   - Confirm notes field contains Strategic Conversations context

## Partner Type Classifications

Partners are classified according to J+D's 7 partner types:

- **Community College**: Tri-C, Sinclair Community College
- **News Organization**: Signal Cleveland
- **Connector**: Neighborhood Media Foundation

These classifications follow the J+D partner taxonomy:
- Connector: Organizations that bridge communities and facilitate partnerships
- News Organization: Media outlets providing journalism and information
- Community College: Educational institutions offering programs and access

## Source Data Details

All partners extracted from:
- **Source Document**: `/data/J+D_StrategicConversations.md`
- **Section**: "CLEVELAND / OHIO"
- **Extraction Date**: 2025-10-17
- **Data Quality**: Addresses and coordinates researched and verified
- **Context**: Includes detailed notes from Strategic Conversations about roles and activities

## Strategic Context from Source Document

The Strategic Conversations document provides important context about J+D's Ohio strategy:

### Current State
- Running second cohort of Community Listening Fellowship
- My Cleveland Agenda project active with community media publishers
- Certificate program collaboration with local facilitators

### Strategic Goals
- **Transition to Ohio-based strategy**: Signal Cleveland is key but seeking resilience through network diversification
- **Local sustainability**: Finding local facilitators to reduce J+D facilitation dependence
- **Expand beyond Cleveland**: Sinclair Community College in Dayton represents expansion opportunity

### Current Activities
- Fellowship stipends: $10,000 total ($2,500 each for 4 fellows)
- Community media coordination: $5,000 (Rich at NMF)
- Community media content support: $2,000 ($500 per pattern, 4 outlets)
- J+D staff time: 2-3 hours/week during 12-week course

### Key Relationships
- J+D acts as facilitator, but partners contribute specific capabilities
- Signal provides editorial expertise and final editing
- Tri-C provides physical infrastructure and community connections
- NMF coordinates community publishers and media outlets

## Support

For issues with the import process:
1. Check browser console for detailed error messages
2. Verify authentication status
3. Confirm Airtable base permissions
4. Review existing partners to identify duplicates
5. Contact J+D technical team if problems persist

---

*This import was created by the Partner Information Extraction Specialist as part of the J+D Partner Network Map enhancement project.*
