// J+D Partner Network Map - Configuration

// OAuth2 Configuration for Airtable
const OAUTH_CONFIG = {
  clientId: "acff4d2d-a468-4f15-a3ee-d9cfea00512e",
  redirectUri: "https://master.d3u92f9fdv7kxv.amplifyapp.com/", // Restored trailing slash to match Airtable registration
  scope: "data.records:read data.records:write user.email:read",
  airtableUrl: "https://airtable.com",
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

// Immediate OAuth configuration diagnostics on page load
console.log("🚀 J+D Partner Map - OAuth Configuration Check");
console.log("=".repeat(50));
console.log("🔍 Client ID:", OAUTH_CONFIG.clientId);
console.log("🔍 Client ID length:", OAUTH_CONFIG.clientId.length);
console.log("🔍 Client ID format:", OAUTH_CONFIG.clientId.match(/^[a-f0-9-]{36}$/) ? "✅ Valid UUID" : "❌ Invalid format");
console.log("🔍 Redirect URI:", OAUTH_CONFIG.redirectUri);
console.log("🔍 Redirect URI protocol:", OAUTH_CONFIG.redirectUri.startsWith('https://') ? "✅ HTTPS" : "❌ Not HTTPS");
console.log("🔍 Current page URL:", window.location.href);
console.log("🔍 Current hostname:", window.location.hostname);
console.log("🔍 Expected hostname:", new URL(OAUTH_CONFIG.redirectUri).hostname);
console.log("🔍 Hostname match:", new URL(OAUTH_CONFIG.redirectUri).hostname === window.location.hostname ? "✅ Match" : "❌ Mismatch");
console.log("🔍 Scope:", OAUTH_CONFIG.scope);
console.log("🔍 Airtable URL:", OAUTH_CONFIG.airtableUrl);
console.log("🔍 Debug mode active:", new URLSearchParams(window.location.search).get('debug') === 'simple' ? "✅ Simple OAuth" : "Standard PKCE");

// Browser detection
const userAgent = navigator.userAgent;
const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
const isChrome = /chrome/i.test(userAgent);
const isBrave = /brave/i.test(userAgent) || navigator.brave;
console.log("🌐 Browser:", isSafari ? "Safari" : isChrome ? "Chrome" : isBrave ? "Brave" : "Other");
console.log("🍪 Cookies enabled:", navigator.cookieEnabled ? "✅ Yes" : "❌ No");
console.log("🔒 HTTPS connection:", location.protocol === 'https:' ? "✅ Yes" : "❌ No");
console.log("=".repeat(50));

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