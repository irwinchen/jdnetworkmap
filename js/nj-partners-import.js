/**
 * New Jersey Partners Import Module
 * Extracts and imports partner data from program audit document
 * 
 * @author J+D Development Team - Partner Information Extraction Specialist
 * @version 1.0
 */

/**
 * New Jersey partner data extracted from program_audit.md
 * Each partner includes name, type, address, and additional metadata
 */
const NJ_PARTNERS_DATA = [
    {
        name: "NJ Council for the Humanities",
        type: "Connector",
        address: "28 W State St, Trenton, NJ 08608",
        latitude: 40.2206,
        longitude: -74.7563,
        description: "Statewide program partner that explores, cultivates, and champions the public humanities in order to strengthen New Jersey's diverse community. Partners with the National Endowment for the Humanities.",
        contact: "",
        email: "",
        phone: "",
        website: "https://njhumanities.org",
        projectLink: "",
        notes: "Supports NJ community colleges in growing noncredit certificate programs. Provides grants ranging from $3,000 to $15,000.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "New Jersey Civic Information Consortium",
        type: "Funder",
        address: "", // Address not specified in source document
        latitude: 40.7589, // Newark, NJ (approximate)
        longitude: -74.0134,
        description: "NJCIC - Funder and connector organization supporting civic information initiatives in New Jersey.",
        contact: "",
        email: "",
        phone: "",
        website: "https://njcivicinfo.org",
        projectLink: "",
        notes: "Partners with J+D on community journalism and Documenters program development. First-of-its-kind initiative to support revitalization of local news.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "Atlantic Cape Community College",
        type: "Community College",
        address: "5100 Black Horse Pike, Mays Landing, NJ 08330",
        latitude: 39.4529,
        longitude: -74.7268,
        description: "Community college partner in the J+D cohort providing noncredit certificate programs for community journalism and civic engagement.",
        contact: "",
        email: "",
        phone: "(609) 343-5000",
        website: "https://atlanticcape.edu",
        projectLink: "",
        notes: "One of four NJ community colleges in the cohort. Serves Atlantic and Cape May counties. Main campus on 537-acre site in Mays Landing.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "Mercer County Community College",
        type: "Community College", 
        address: "1200 Old Trenton Road, West Windsor, NJ 08550",
        latitude: 40.2737,
        longitude: -74.6468,
        description: "Community college partner in the J+D cohort providing noncredit certificate programs for community journalism and civic engagement.",
        contact: "",
        email: "admiss@mccc.edu",
        phone: "(609) 586-4800",
        website: "https://mccc.edu",
        projectLink: "",
        notes: "One of four NJ community colleges in the cohort. Main campus in West Windsor with additional James Kerney Campus in downtown Trenton.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "Middlesex College",
        type: "Community College",
        address: "2600 Woodbridge Avenue, Edison, NJ 08818",
        latitude: 40.4590,
        longitude: -74.4107,
        description: "Community college partner in the J+D cohort providing noncredit certificate programs for community journalism and civic engagement.",
        contact: "",
        email: "",
        phone: "(732) 548-6000",
        website: "https://middlesexcollege.edu",
        projectLink: "",
        notes: "One of four NJ community colleges in the cohort. Main campus in Edison with additional urban centers in New Brunswick and Perth Amboy.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "Sussex County Community College",
        type: "Community College",
        address: "One College Hill Road, Newton, NJ 07860",
        latitude: 41.0581,
        longitude: -74.7526,
        description: "Community college partner in the J+D cohort providing noncredit certificate programs for community journalism and civic engagement.",
        contact: "",
        email: "",
        phone: "(973) 300-2100",
        website: "https://sussex.edu",
        projectLink: "",
        notes: "One of four NJ community colleges in the cohort. Hillside campus located in Newton, Sussex County.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "F. M. Kirby Foundation",
        type: "Funder",
        address: "17 DeHart Street, Morristown, NJ 07963",
        latitude: 40.7968,
        longitude: -74.4815,
        description: "Family foundation that invests in opportunities that foster self-reliance or otherwise create strong, healthy communities.",
        contact: "",
        email: "info@fmkirbyfoundation.org",
        phone: "(973) 538-4800",
        website: "https://fmkirbyfoundation.org",
        projectLink: "",
        notes: "Funder in Morris County. Supports development of community journalism and Documenters program in Morris County area.",
        sourceDocument: "program_audit.md - New Jersey section"
    },
    {
        name: "coLAB Arts",
        type: "Connector",
        address: "9 Bayard Street, New Brunswick, NJ 08901",
        latitude: 40.4862,
        longitude: -74.4518,
        description: "Arts organization that engages artists, social advocates, and communities to create transformative new work through artistic expression and civic engagement.",
        contact: "",
        email: "",
        phone: "(732) 470-0467",
        website: "https://colab-arts.org",
        projectLink: "",
        notes: "Partners in Middlesex and Morris County. Based in New Brunswick, operates from First Reformed Church. Focuses on collaborative community engagement.",
        sourceDocument: "program_audit.md - New Jersey section"
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
 * Import New Jersey partners to the database
 * This function processes the partners data and adds them to the Airtable database
 */
async function importNJPartners() {
    console.log("🚀 Starting New Jersey Partners Import...");
    console.log(`📊 Found ${NJ_PARTNERS_DATA.length} partners to process`);

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

    for (let i = 0; i < NJ_PARTNERS_DATA.length; i++) {
        const partnerData = NJ_PARTNERS_DATA[i];
        results.processed++;

        console.log(`\n📍 Processing ${i + 1}/${NJ_PARTNERS_DATA.length}: ${partnerData.name}`);

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
            if (i < NJ_PARTNERS_DATA.length - 1) {
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
    console.log("📊 NEW JERSEY PARTNERS IMPORT COMPLETE");
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
    let message = `New Jersey Partners Import Complete!\n\n`;
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
 * Can be called from browser console: startNJPartnersImport()
 */
async function startNJPartnersImport() {
    try {
        const results = await importNJPartners();
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
    window.startNJPartnersImport = startNJPartnersImport;
    window.importNJPartners = importNJPartners;
    window.NJ_PARTNERS_DATA = NJ_PARTNERS_DATA;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NJ_PARTNERS_DATA,
        importNJPartners,
        startNJPartnersImport,
        geocodeAddress
    };
}

console.log("📋 NJ Partners Import Module loaded");
console.log("💡 To start import, run: startNJPartnersImport()");