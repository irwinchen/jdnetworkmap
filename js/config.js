// J+D Partner Network Map - Configuration

// OAuth2 Configuration for Airtable
const OAUTH_CONFIG = {
  clientId: "acff4d2d-a468-4f15-a3ee-d9cfea00512e",
  redirectUri: "https://master.d3u92f9fdv7kxv.amplifyapp.com/",
  scope: "data.records:read data.records:write user.email:read",
  airtableUrl: "https://www.airtable.com",
  targetWorkspaceId: "wsp521eG1mYR4mexh",
  requiredBaseId: "appwdh7OXsghNRy6k", // J+D Lab Network base ID
  lambdaProxyUrl: "https://89ylgt7orf.execute-api.us-east-1.amazonaws.com/prod/oauth",
};

// Airtable Configuration
const AIRTABLE_CONFIG = {
  baseId: "appwdh7OXsghNRy6k",
  tableName: "Partners",
  apiUrl: "https://api.airtable.com/v0",
  // Note: No longer using static API key - will use OAuth token from authState
};

// Debug redirect URI
console.log("🔗 Current redirect URI:", OAUTH_CONFIG.redirectUri);

// Authentication state
const authState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  userEmail: null,
  userName: null,
  userId: null,
  isLoading: false,
};

// Application state for partner management
const appState = {
  mapMode: "view", // "view", "add", "edit"
  selectedPartner: null,
  partners: [],
  filters: {
    connectors: true,
    informationHubs: true,
    funders: true,
    newsOrganizations: true,
    communityColleges: true,
    libraries: true,
    others: true,
  },
  currentBounds: null,
  zoomLevel: 4,
};