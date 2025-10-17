/**
 * New Mexico Partners Import Module
 * Extracts and imports partner data from J+D Strategic Conversations document
 *
 * @author J+D Development Team - Partner Information Extraction Specialist
 * @version 1.0
 */

/**
 * New Mexico partner data extracted from J+D _StrategicConversations.md
 * Each partner includes name, type, address, and additional metadata
 * All GPS coordinates have been pre-calculated for optimal performance
 */
const NM_PARTNERS_DATA = [
    {
        name: "New Mexico Local News Fund",
        type: "Connector",
        address: "501 Halona Street, Santa Fe, NM 87501",
        latitude: 35.6846,
        longitude: -105.9378,
        description: "Empowering newsrooms through funding, mentorship, and community support to ensure every New Mexican has access to vital, trustworthy journalism. Co-leads Press Forward New Mexico initiative with the Thornburg Foundation.",
        contact: "Rashad Mahmood (Executive Director), Denise (Business Development and Communications Director)",
        email: "foundation@santafecf.org",
        phone: "505-988-9715",
        website: "https://www.nmlocalnews.org",
        projectLink: "",
        notes: "Operates through Santa Fe Community Foundation. J+D partnership includes co-designing grant program, managing advisory board of 7 members, and supporting new cohort of 4 NM community colleges. Combined funding from J+D, Press Forward, and NM Department of Workforce Solutions ($77k per college over 2 years). Partnership launched cohort in August 2025 with in-person skills training scheduled for September 2025.",
        sourceDocument: "J+D _StrategicConversations.md - New Mexico section"
    },
    {
        name: "Dona Ana Community College",
        type: "Community College",
        address: "2800 Sonoma Ranch Blvd, Las Cruces, NM 88011",
        latitude: 32.2877,
        longitude: -106.7551,
        description: "Community college partner in the J+D New Mexico cohort, developing programs that equip New Mexicans to participate in getting, sharing, and discussing reliable local news and information. Located in Las Cruces serving Dona Ana County.",
        contact: "",
        email: "",
        phone: "575-528-7000",
        website: "https://dacc.nmsu.edu",
        projectLink: "",
        notes: "One of four NM community colleges selected for 2025 cohort. Serves Las Cruces community with focus on Native American, rural, and Hispanic communities. Receives $77k over two years from J+D, Press Forward, and NM Department of Workforce Solutions. Part of New Mexico State University system. Has established or identified partnerships with local news outlets including Organ Mountain News.",
        sourceDocument: "J+D _StrategicConversations.md - New Mexico section"
    },
    {
        name: "Eastern New Mexico University-Roswell",
        type: "Community College",
        address: "52 University Boulevard, Roswell, NM 88202",
        latitude: 33.3943,
        longitude: -104.5230,
        description: "Community college partner in the J+D New Mexico cohort providing high-quality, affordable education and lifelong learning opportunities. Developing programs to equip New Mexicans with local journalism and information skills.",
        contact: "",
        email: "",
        phone: "575-624-7112",
        website: "https://www.roswell.enmu.edu",
        projectLink: "",
        notes: "One of four NM community colleges selected for 2025 cohort. Established in 1958, serves Roswell community. Receives $77k over two years from J+D, Press Forward, and NM Department of Workforce Solutions. Demonstrates learning and experimentation orientation with focus on engaging community members and assessing local info needs. Part of ENMU system.",
        sourceDocument: "J+D _StrategicConversations.md - New Mexico section"
    },
    {
        name: "Santa Fe Community College",
        type: "Community College",
        address: "6401 Richards Avenue, Santa Fe, NM 87508",
        latitude: 35.6338,
        longitude: -106.0055,
        description: "Community college partner in the J+D New Mexico cohort developing programs to equip New Mexicans to participate in getting, sharing, and discussing reliable local news and information. Serves Santa Fe and surrounding communities.",
        contact: "",
        email: "testingcenter@sfcc.edu",
        phone: "505-428-1000",
        website: "https://www.sfcc.edu",
        projectLink: "",
        notes: "One of four NM community colleges selected for 2025 cohort. Serves Santa Fe community with focus on Native American, rural, and Hispanic communities. Receives $77k over two years from J+D, Press Forward, and NM Department of Workforce Solutions. Has established or identified partnerships with local news outlets including KSFR radio station. Geographic proximity to NMLNF enables strong local collaboration.",
        sourceDocument: "J+D _StrategicConversations.md - New Mexico section"
    },
    {
        name: "Southeast New Mexico College",
        type: "Community College",
        address: "1500 University Drive, Carlsbad, NM 88220",
        latitude: 32.4207,
        longitude: -104.2288,
        description: "Community college partner in the J+D New Mexico cohort (formerly New Mexico State University Carlsbad, became independent in July 2021). Developing programs to equip New Mexicans with local journalism and community information skills.",
        contact: "",
        email: "",
        phone: "575-234-9200",
        website: "https://senmc.edu",
        projectLink: "",
        notes: "One of four NM community colleges selected for 2025 cohort. Serves Carlsbad community in southeastern New Mexico. Receives $77k over two years from J+D, Press Forward, and NM Department of Workforce Solutions. Recently became independent public institution. Demonstrates strong commitment to workforce-aligned pathways including internships and entrepreneurship opportunities for program participants.",
        sourceDocument: "J+D _StrategicConversations.md - New Mexico section"
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
 * Import New Mexico partners to the database
 * This function processes the partners data and adds them to the Airtable database
 */
async function importNMPartners() {
    console.log("🚀 Starting New Mexico Partners Import...");
    console.log(`📊 Found ${NM_PARTNERS_DATA.length} partners to process`);

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

    console.log("🔍 Processing partners with pre-calculated coordinates...");

    for (let i = 0; i < NM_PARTNERS_DATA.length; i++) {
        const partnerData = NM_PARTNERS_DATA[i];
        results.processed++;

        console.log(`\n📍 Processing ${i + 1}/${NM_PARTNERS_DATA.length}: ${partnerData.name}`);

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
            if (i < NM_PARTNERS_DATA.length - 1) {
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
    console.log("📊 NEW MEXICO PARTNERS IMPORT COMPLETE");
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
    let message = `New Mexico Partners Import Complete!\n\n`;
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
 * Can be called from browser console: startNMPartnersImport()
 */
async function startNMPartnersImport() {
    try {
        const results = await importNMPartners();
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
    window.startNMPartnersImport = startNMPartnersImport;
    window.importNMPartners = importNMPartners;
    window.NM_PARTNERS_DATA = NM_PARTNERS_DATA;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NM_PARTNERS_DATA,
        importNMPartners,
        startNMPartnersImport,
        geocodeAddress
    };
}

console.log("📋 NM Partners Import Module loaded");
console.log("💡 To start import, run: startNMPartnersImport()");
