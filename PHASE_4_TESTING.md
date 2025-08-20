# Phase 4 & 5 Testing Guide

## Prerequisites - Phase 5 Airtable Setup
**IMPORTANT**: Before testing, you must manually add these columns to the "J+D Lab Network" Airtable base:

1. **"Created By User ID"** (Single line text field) - Required
2. **"Created By Email"** (Email field) - Required  
3. **"Date Added"** (Date & time field) - Required

## Phase 4 Testing Checklist

### Test 1: Authentication Validation
- [ ] Try to create a partner without being authenticated
- [ ] Should show error: "Authentication required. Please log in again."

### Test 2: New Partner Creation
- [ ] Authenticate with Airtable successfully
- [ ] Create a new partner using the form
- [ ] Verify partner saves successfully
- [ ] Check Airtable to confirm these fields are populated:
  - `Created By User ID` = your Airtable user ID (e.g., "usr12345abc")
  - `Created By Email` = your authenticated email
  - `Date Added` = current ISO timestamp

### Test 3: Partner Popup Display
- [ ] Click on the newly created partner marker
- [ ] Verify popup shows user tracking info at bottom:
  - "Added by: [your email]"
  - "Date added: [formatted date]"

### Test 4: Legacy Partners (without user tracking)
- [ ] Click on existing partners (if any)
- [ ] Verify they display normally without user tracking section
- [ ] No errors in console for missing fields

### Test 5: Partner Updates
- [ ] Edit an existing partner (when edit functionality is available)
- [ ] Verify original creator info is preserved (not overwritten)

### Test 6: Console Logging
- [ ] Open browser console while creating partners
- [ ] Look for these log messages:
  - "👤 Adding user tracking data:"
  - User ID, email, and timestamp should be logged
  - "✅ Partner saved successfully"

### Test 7: Error Handling
- [ ] Try creating partner with invalid data
- [ ] Verify error messages display properly
- [ ] User tracking validation should work correctly

## Expected Behavior

### New Partners (Phase 4):
- Will have complete user tracking data
- Show creator info in popups
- Console logs show tracking data

### Legacy Partners:
- May have null/empty user tracking fields
- Display normally without tracking section  
- No console errors

## Troubleshooting

If user tracking fields don't save:
1. Verify Airtable columns exist and are named exactly as specified
2. Check browser console for authentication errors
3. Confirm user is properly authenticated (authState populated)

If popups don't show tracking info:
1. Check that partner object has `createdByEmail` and `dateAdded` properties
2. Verify date formatting doesn't throw errors