/**
 * Southern Design Challenge Partners Import Module
 * Extracts and imports partner data from J+D Strategic Conversations document
 *
 * @author J+D Development Team - Partner Information Extraction Specialist
 * @version 1.0
 */

/**
 * Southern Design Challenge cohort data extracted from J+D_StrategicConversations.md
 * Each partner includes name, type, address, coordinates, and program context
 *
 * Program Context:
 * - Lumina Foundation grant for Civic Info Challenge
 * - Each college receives $5k seed funding
 * - Design Summit planned for November 6-8, 2025
 * - Goal: Support colleges in using design thinking to develop local news/info projects
 * - Colleges selected from 11 applications
 * - Target communities include rural, Hispanic, and Black communities in the South
 */
const SOUTHERN_PARTNERS_DATA = [
    {
        name: "Community College of Baltimore County",
        type: "Community College",
        address: "800 South Rolling Road, Baltimore, MD 21228",
        latitude: 39.2296,
        longitude: -76.7443,
        description: "Community college partner in the Southern Design Challenge cohort focused on using design thinking to develop local news and information projects for marginalized communities in Baltimore.",
        contact: "",
        email: "",
        phone: "(443) 840-4049",
        website: "https://www.ccbcmd.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Focus on increasing flow of local news and information in surrounding communities. CCBC has three main campuses in Baltimore County (Catonsville, Dundalk, Essex).",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "MD"
    },
    {
        name: "Houston Community College",
        type: "Community College",
        address: "3100 Main Street, Houston, TX 77002",
        latitude: 29.7411,
        longitude: -95.3631,
        description: "Community college partner in the Southern Design Challenge cohort. Despite Houston being a major media market, historically marginalized communities in the city lack adequate representation and coverage.",
        contact: "",
        email: "",
        phone: "(713) 718-2000",
        website: "https://www.hccs.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Application noted gaps in local coverage for historically marginalized Houston communities despite being a major media market. More experience in the local news arena.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "TX"
    },
    {
        name: "San Antonio College",
        type: "Community College",
        address: "1819 N Main Avenue, San Antonio, TX 78212",
        latitude: 29.4459,
        longitude: -98.4962,
        description: "Community college partner in the Southern Design Challenge cohort. Part of Alamo Colleges District, the oldest public two-year college in Texas serving over 20,000 students each semester.",
        contact: "",
        email: "",
        phone: "(210) 486-0000",
        website: "https://www.alamo.edu/sac",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Located just north of downtown San Antonio. Part of Alamo Colleges District. Oldest public two-year college in Texas.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "TX"
    },
    {
        name: "Santa Fe College",
        type: "Community College",
        address: "3000 NW 83rd Street, Gainesville, FL 32606",
        latitude: 29.6952,
        longitude: -82.3823,
        description: "Community college partner in the Southern Design Challenge cohort. Main campus on 175 acres in northwest Gainesville with additional centers in Starke and Alachua.",
        contact: "",
        email: "",
        phone: "(352) 395-5000",
        website: "https://www.sfcollege.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Team led by Siwiecki. Multiple campus locations including Blount Center, Andrews Center, and Perry Center for Emerging Technologies.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "FL"
    },
    {
        name: "Northwest Arkansas Community College",
        type: "Community College",
        address: "1 College Drive, Bentonville, AR 72712",
        latitude: 36.3529,
        longitude: -94.2088,
        description: "Community college partner in the Southern Design Challenge cohort. Largest community college in Arkansas, conveniently located off Interstate 49 in Benton County.",
        contact: "",
        email: "",
        phone: "(479) 986-4000",
        website: "https://www.nwacc.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Largest community college in Arkansas. Main campus in Bentonville in northwest Arkansas.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "AR"
    },
    {
        name: "Florida State College at Jacksonville",
        type: "Community College",
        address: "101 W State Street, Jacksonville, FL 32202",
        latitude: 30.3280,
        longitude: -81.6606,
        description: "Community college partner in the Southern Design Challenge cohort. Multi-campus institution serving Jacksonville area with Downtown, North, South, Kent, Cecil, and Deerwood locations.",
        contact: "",
        email: "",
        phone: "(904) 632-3000",
        website: "https://www.fscj.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Multiple campus locations throughout Jacksonville. Downtown Campus serves as main administrative center.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "FL"
    },
    {
        name: "Prince George's Community College",
        type: "Community College",
        address: "301 Largo Road, Largo, MD 20774",
        latitude: 38.8867,
        longitude: -76.8263,
        description: "Community college partner in the Southern Design Challenge cohort. Located in Largo, Maryland, part of the Washington, D.C. metro area in Prince George's County.",
        contact: "",
        email: "",
        phone: "(301) 546-0600",
        website: "https://www.pgcc.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Main campus in Largo with University Town Center and Laurel College Center locations. Part of D.C. metro area.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "MD"
    },
    {
        name: "Jones College",
        type: "Community College",
        address: "900 S Court Street, Ellisville, MS 39437",
        latitude: 31.6041,
        longitude: -89.1956,
        description: "Community college partner in the Southern Design Challenge cohort. Public community college in Ellisville, Mississippi (also known as Jones County Junior College or JCJC).",
        contact: "",
        email: "",
        phone: "(601) 477-4000",
        website: "https://www.jcjc.edu",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Also known as Jones County Junior College (JCJC). Located in Ellisville, Mississippi.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "MS"
    },
    {
        name: "University of Southern Mississippi Roy Howard Community Journalism Center",
        type: "Community College",
        address: "114 Southern Miss Drive, Hattiesburg, MS 39406",
        latitude: 31.3282,
        longitude: -89.3370,
        description: "Community journalism center partner in the Southern Design Challenge cohort. Part of USM School of Media and Communication, established by Scripps Howard Fund to support community journalism initiatives.",
        contact: "",
        email: "",
        phone: "(601) 266-4283",
        website: "https://www.usm.edu/media-communication/rhcjc.php",
        projectLink: "",
        notes: "Part of Southern Design Challenge cohort (2025). Lumina Foundation Civic Info Challenge. $5k seed funding. Design Summit Nov 6-8, 2025. Established by Scripps Howard Fund. Part of USM School of Media and Communication. Officially launched in 2024-2025. Focus on community journalism training and media literacy.",
        sourceDocument: "J+D_StrategicConversations.md - DESIGN CHALLENGE section",
        state: "MS"
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
 * Import Southern Design Challenge partners to the database
 * This function processes the partners data and adds them to the Airtable database
 */
async function importSouthernPartners() {
    console.log("🚀 Starting Southern Design Challenge Partners Import...");
    console.log(`📊 Found ${SOUTHERN_PARTNERS_DATA.length} partners to process`);

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

    console.log("🔍 Processing Southern Design Challenge cohort partners...");

    for (let i = 0; i < SOUTHERN_PARTNERS_DATA.length; i++) {
        const partnerData = SOUTHERN_PARTNERS_DATA[i];
        results.processed++;

        console.log(`\n📍 Processing ${i + 1}/${SOUTHERN_PARTNERS_DATA.length}: ${partnerData.name} (${partnerData.state})`);

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
                    coordinates: coordinates,
                    state: partnerData.state
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
            if (i < SOUTHERN_PARTNERS_DATA.length - 1) {
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
    console.log("\n" + "=".repeat(70));
    console.log("📊 SOUTHERN DESIGN CHALLENGE PARTNERS IMPORT COMPLETE");
    console.log("=".repeat(70));
    console.log(`✅ Successfully added: ${results.added} partners`);
    console.log(`⚠️  Skipped: ${results.skipped} partners`);
    console.log(`📋 Total processed: ${results.processed} partners`);
    console.log(`🗺️  States covered: MD, TX, FL, AR, MS`);

    if (results.errors.length > 0) {
        console.log(`\n❌ Errors encountered:`);
        results.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error.partner}: ${error.error}`);
        });
        results.success = results.added > 0; // Partial success if some added
    }

    if (results.partners.length > 0) {
        console.log(`\n📍 Successfully added partners by state:`);
        const byState = {};
        results.partners.forEach(p => {
            if (!byState[p.state]) byState[p.state] = [];
            byState[p.state].push(p.name);
        });
        Object.keys(byState).sort().forEach(state => {
            console.log(`   ${state}: ${byState[state].length} partner(s)`);
            byState[state].forEach(name => console.log(`      - ${name}`));
        });
    }

    console.log("=".repeat(70));

    return results;
}

/**
 * Display import results to user
 */
function displayImportResults(results) {
    let message = `Southern Design Challenge Partners Import Complete!\n\n`;
    message += `✅ Successfully added: ${results.added} partners\n`;
    message += `⚠️ Skipped: ${results.skipped} partners\n`;
    message += `📋 Total processed: ${results.processed} partners\n`;
    message += `🗺️  States covered: MD, TX, FL, AR, MS\n`;

    if (results.errors.length > 0) {
        message += `\n❌ Issues encountered:\n`;
        results.errors.forEach((error, index) => {
            message += `${index + 1}. ${error.partner}: ${error.error}\n`;
        });
    }

    if (results.partners.length > 0) {
        message += `\n📍 Added partners:\n`;
        results.partners.forEach((partner, index) => {
            message += `${index + 1}. ${partner.name} (${partner.state})\n`;
        });
    }

    alert(message);
    return results;
}

/**
 * Public function to start the import process
 * Can be called from browser console: startSouthernPartnersImport()
 */
async function startSouthernPartnersImport() {
    try {
        const results = await importSouthernPartners();
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
    window.startSouthernPartnersImport = startSouthernPartnersImport;
    window.importSouthernPartners = importSouthernPartners;
    window.SOUTHERN_PARTNERS_DATA = SOUTHERN_PARTNERS_DATA;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SOUTHERN_PARTNERS_DATA,
        importSouthernPartners,
        startSouthernPartnersImport,
        geocodeAddress
    };
}

console.log("📋 Southern Partners Import Module loaded");
console.log("💡 To start import, run: startSouthernPartnersImport()");
