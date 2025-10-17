/**
 * Ohio Partners Import Module
 * Extracts and imports partner data from J+D Strategic Conversations document
 *
 * @author J+D Development Team - Partner Information Extraction Specialist
 * @version 1.0
 */

/**
 * Ohio partner data extracted from J+D_StrategicConversations.md
 * Each partner includes name, type, address, and additional metadata
 */
const OHIO_PARTNERS_DATA = [
    {
        name: "Cuyahoga Community College",
        type: "Community College",
        address: "700 Carnegie Ave, Cleveland, OH 44115",
        latitude: 41.5007,
        longitude: -81.6873,
        description: "Tri-C is Ohio's first and largest community college, providing access to quality, affordable education and programs. Partner in J+D Community Listening Fellowship and certificate programs.",
        contact: "",
        email: "info@tri-c.edu",
        phone: "(216) 987-6000",
        website: "https://www.tri-c.edu",
        projectLink: "",
        notes: "Active J+D partner in Cleveland. Involved in Community Listening Fellowship (second cohort) and My Cleveland Agenda project. Provides venue support, prints flyers, and hosts events for fellows. Part of certificate program collaboration. Primary contact for cohort: Tri-C provides physical infrastructure and community connections.",
        sourceDocument: "J+D_StrategicConversations.md - CLEVELAND/OHIO section"
    },
    {
        name: "Signal Cleveland",
        type: "News Organization",
        address: "1422 Euclid Ave, Suite 627, Cleveland, OH 44115",
        latitude: 41.5027,
        longitude: -81.6789,
        description: "Independent nonprofit news organization providing data-driven local journalism for Northeast Ohio. Key to J+D's Ohio strategy.",
        contact: "",
        email: "info@signalcleveland.org",
        phone: "",
        website: "https://signalcleveland.org",
        projectLink: "",
        notes: "Critical partner in J+D Ohio strategy. Provides editorial support and context for Community Listening Fellowship. Handles final edits of the My Cleveland Agenda. Strategic Conversations document notes: 'Signal is probably going to be the key to Ohio strategy.' J+D seeking to create more resilient network beyond Signal dependence.",
        sourceDocument: "J+D_StrategicConversations.md - CLEVELAND/OHIO section"
    },
    {
        name: "Neighborhood Media Foundation",
        type: "Connector",
        address: "Cleveland, OH",
        latitude: 41.4993,
        longitude: -81.6944,
        description: "Community media organization supporting neighborhood journalism and local publishers in Cleveland. Acts as community media coordinator for J+D programs.",
        contact: "Rich",
        email: "",
        phone: "",
        website: "",
        projectLink: "",
        notes: "Community Media Coordinator role ($5,000 funding). Secured four community publishers to publish pieces as part of My Cleveland Agenda project. Supports community media outlets collaboration/content creation ($2,000 allocated to support community media, $500 per pattern for 4 outlets). Strategic Conversations mentions potential role for Rich in thinking about community media. Fellowship cost breakdown includes Rich at NMF as community media coordinator.",
        sourceDocument: "J+D_StrategicConversations.md - CLEVELAND/OHIO section"
    },
    {
        name: "Sinclair Community College",
        type: "Community College",
        address: "444 W Third St, Dayton, OH 45402",
        latitude: 39.7589,
        longitude: -84.1916,
        description: "Ohio's largest single-campus community college serving the Greater Dayton region. Expressed interest in working with J+D.",
        contact: "",
        email: "info@sinclair.edu",
        phone: "(937) 512-3000",
        website: "https://www.sinclair.edu",
        projectLink: "",
        notes: "Interested partner in Dayton, Ohio. Mentioned in Strategic Conversations as 'a college in Ohio that is interested in working with us.' Not yet active in programming but identified for future Ohio expansion strategy. Could help diversify J+D's Ohio network beyond Cleveland concentration.",
        sourceDocument: "J+D_StrategicConversations.md - CLEVELAND/OHIO section"
    }
];

/**
 * Simple geocoding function using OpenStreetMap Nominatim API
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number} | null>} Coordinates or null if failed
 */
async function geocodeAddress(address) {
    if (!address || address.trim() === '') {
        return null;
    }

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=us&limit=1`;
        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`Geocoding failed for "${address}": HTTP ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            };
        } else {
            console.warn(`No geocoding results found for "${address}"`);
            return null;
        }
    } catch (error) {
        console.error(`Geocoding error for "${address}":`, error);
        return null;
    }
}

/**
 * Add delay between geocoding requests to be respectful to the API
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Import Ohio partners to the database
 * This function processes the partners data and adds them to the Airtable database
 */
async function importOhioPartners() {
    console.log("🚀 Starting Ohio Partners Import...");
    console.log(`📊 Found ${OHIO_PARTNERS_DATA.length} partners to process`);

    // Check if user is authenticated
    if (!authState.isAuthenticated || !authState.accessToken) {
        console.error("❌ User must be authenticated to import partners");
        alert("Please login with Airtable before importing partners.");
        return { success: false, message: "Authentication required" };
    }

    const results = {
        success: true,
        processed: 0,
        added: 0,
        skipped: 0,
        errors: [],
        partners: []
    };

    console.log("🔍 Processing partners with geocoding...");

    for (let i = 0; i < OHIO_PARTNERS_DATA.length; i++) {
        const partnerData = OHIO_PARTNERS_DATA[i];
        results.processed++;

        console.log(`\n📍 Processing ${i + 1}/${OHIO_PARTNERS_DATA.length}: ${partnerData.name}`);

        try {
            // Check if coordinates are provided directly
            let coordinates = null;
            if (partnerData.latitude && partnerData.longitude) {
                coordinates = {
                    lat: partnerData.latitude,
                    lng: partnerData.longitude
                };
                console.log(`✅ Using pre-calculated coordinates: ${coordinates.lat}, ${coordinates.lng}`);
            } else if (partnerData.address && partnerData.address.trim() !== '') {
                // Try geocoding as fallback
                console.log(`🌍 Geocoding address: ${partnerData.address}`);
                coordinates = await geocodeAddress(partnerData.address);

                if (!coordinates) {
                    console.log(`⚠️  Skipping ${partnerData.name} - geocoding failed`);
                    results.skipped++;
                    results.errors.push({
                        partner: partnerData.name,
                        error: "Geocoding failed - unable to determine coordinates"
                    });
                    continue;
                }
                console.log(`✅ Geocoded to: ${coordinates.lat}, ${coordinates.lng}`);
            } else {
                console.log(`⚠️  Skipping ${partnerData.name} - no address or coordinates provided`);
                results.skipped++;
                results.errors.push({
                    partner: partnerData.name,
                    error: "No address or coordinates provided - location data required for database entry"
                });
                continue;
            }

            // Prepare partner data for Airtable
            const airtablePartnerData = {
                name: partnerData.name,
                type: partnerData.type,
                address: partnerData.address,
                description: partnerData.description,
                contact: partnerData.contact,
                email: partnerData.email,
                phone: partnerData.phone,
                website: partnerData.website,
                projectLink: partnerData.projectLink,
                notes: partnerData.notes,
                latitude: coordinates.lat,
                longitude: coordinates.lng
            };

            // Save to Airtable using existing function
            console.log(`💾 Saving ${partnerData.name} to Airtable...`);
            const saveResult = await savePartnerToAirtable(airtablePartnerData);

            if (saveResult.success) {
                console.log(`✅ Successfully saved ${partnerData.name}`);
                results.added++;
                results.partners.push({
                    name: partnerData.name,
                    id: saveResult.id,
                    coordinates: coordinates
                });

                // Add to partner manager if available
                if (window.partnerManager) {
                    const fullPartnerData = {
                        ...airtablePartnerData,
                        id: saveResult.id
                    };
                    window.partnerManager.addPartnerMarker(fullPartnerData);
                }
            } else {
                console.error(`❌ Failed to save ${partnerData.name}:`, saveResult.message);
                results.errors.push({
                    partner: partnerData.name,
                    error: saveResult.message
                });
            }

            // Rate limiting - delay between requests
            if (i < OHIO_PARTNERS_DATA.length - 1) {
                console.log("⏳ Waiting 1 second before next request...");
                await delay(1000);
            }

        } catch (error) {
            console.error(`❌ Error processing ${partnerData.name}:`, error);
            results.errors.push({
                partner: partnerData.name,
                error: error.message || "Unknown error"
            });
        }
    }

    // Generate final report
    console.log("\n" + "=".repeat(60));
    console.log("📊 OHIO PARTNERS IMPORT COMPLETE");
    console.log("=".repeat(60));
    console.log(`✅ Successfully added: ${results.added} partners`);
    console.log(`⚠️  Skipped: ${results.skipped} partners`);
    console.log(`📋 Total processed: ${results.processed} partners`);

    if (results.errors.length > 0) {
        console.log(`\n❌ Errors encountered:`);
        results.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error.partner}: ${error.error}`);
        });
        results.success = results.added > 0; // Partial success if some added
    }

    console.log("=".repeat(60));

    return results;
}

/**
 * Display import results to user
 */
function displayImportResults(results) {
    let message = `Ohio Partners Import Complete!\n\n`;
    message += `✅ Successfully added: ${results.added} partners\n`;
    message += `⚠️ Skipped: ${results.skipped} partners\n`;
    message += `📋 Total processed: ${results.processed} partners\n`;

    if (results.errors.length > 0) {
        message += `\n❌ Issues encountered:\n`;
        results.errors.forEach((error, index) => {
            message += `${index + 1}. ${error.partner}: ${error.error}\n`;
        });
    }

    if (results.partners.length > 0) {
        message += `\n📍 Added partners:\n`;
        results.partners.forEach((partner, index) => {
            message += `${index + 1}. ${partner.name}\n`;
        });
    }

    alert(message);
    return results;
}

/**
 * Public function to start the import process
 * Can be called from browser console: startOhioPartnersImport()
 */
async function startOhioPartnersImport() {
    try {
        const results = await importOhioPartners();
        displayImportResults(results);
        return results;
    } catch (error) {
        console.error("❌ Import process failed:", error);
        alert(`Import failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Make functions available globally for browser console access
if (typeof window !== 'undefined') {
    window.startOhioPartnersImport = startOhioPartnersImport;
    window.importOhioPartners = importOhioPartners;
    window.OHIO_PARTNERS_DATA = OHIO_PARTNERS_DATA;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OHIO_PARTNERS_DATA,
        importOhioPartners,
        startOhioPartnersImport,
        geocodeAddress
    };
}

console.log("📋 Ohio Partners Import Module loaded");
console.log("💡 To start import, run: startOhioPartnersImport()");
