// J+D Partner Network Map - Authentication System

// OAuth2 PKCE Utility Functions
function generateRandomString(length) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generateCodeChallenge(verifier) {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

// OAuth2 Authentication Functions
async function initiateOAuth() {
  console.log("🔐 Starting OAuth flow...");

  // Generate PKCE parameters
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(96); // 96 bytes -> ~128 chars in base64
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store PKCE parameters in sessionStorage
  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem("oauth_code_verifier", codeVerifier);
  
  // Debug PKCE parameters
  console.log("🔍 Generated code_verifier length:", codeVerifier.length);
  console.log("🔍 Generated state length:", state.length);

  // Build authorization URL
  const authUrl = new URL(
    `${OAUTH_CONFIG.airtableUrl}/oauth2/v1/authorize`
  );
  authUrl.searchParams.append("client_id", OAUTH_CONFIG.clientId);
  authUrl.searchParams.append("redirect_uri", OAUTH_CONFIG.redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", OAUTH_CONFIG.scope);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("code_challenge", codeChallenge);
  authUrl.searchParams.append("code_challenge_method", "S256");

  console.log("🔗 Redirecting to:", authUrl.toString());
  console.log("📋 Requested scopes:", OAUTH_CONFIG.scope);

  // Redirect to Airtable OAuth
  window.location.href = authUrl.toString();
}

async function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const error = urlParams.get("error");

  // Check for OAuth errors
  if (error) {
    console.error("❌ OAuth error:", error);
    showAuthError("Authentication failed: " + error);
    return false;
  }

  // Verify we have the required parameters
  if (!code || !state) {
    console.log("ℹ️ No OAuth callback parameters found");
    return false;
  }

  // Verify state parameter
  const storedState = sessionStorage.getItem("oauth_state");
  if (state !== storedState) {
    console.error("❌ State parameter mismatch - possible CSRF attack");
    showAuthError("Security error: Invalid state parameter");
    return false;
  }

  console.log(
    "✅ OAuth callback received, exchanging code for tokens..."
  );
  console.log("🔍 Code:", code?.substring(0, 20) + "...");
  console.log("🔍 State:", state);

  try {
    // Exchange authorization code for tokens
    console.log("🔄 Starting token exchange...");
    const tokenResponse = await exchangeCodeForTokens(code);
    console.log("🔍 Token response:", tokenResponse ? "received" : "null");

    if (tokenResponse.access_token) {
      // Get user information
      const userInfo = await getUserInfo(tokenResponse.access_token);
      console.log("🔍 User info retrieved:", userInfo);
      console.log("🔍 User info fields available:", Object.keys(userInfo));
      console.log("🔍 User name field:", userInfo.name || "not available");
      console.log("🔍 User email field:", userInfo.email || "not available");

      // Verify access to required J+D Lab Network base
      const hasBaseAccess = await verifyBaseAccess(
        tokenResponse.access_token
      );

      if (hasBaseAccess) {
        // Store authentication data
        authState.isAuthenticated = true;
        authState.accessToken = tokenResponse.access_token;
        authState.refreshToken = tokenResponse.refresh_token;
        authState.userEmail = userInfo.email;
        authState.userName = userInfo.name || userInfo.displayName || userInfo.email;
        authState.userId = userInfo.id;

        // Store in localStorage for persistence
        localStorage.setItem("auth_token", tokenResponse.access_token);
        localStorage.setItem("refresh_token", tokenResponse.refresh_token);
        localStorage.setItem("user_email", userInfo.email);
        localStorage.setItem("user_name", userInfo.name || userInfo.displayName || userInfo.email);
        localStorage.setItem("user_id", userInfo.id);

        console.log("🎉 Authentication successful!");
        updateAuthUI();

        // Clean up URL and session storage
        history.replaceState(null, null, window.location.pathname);
        sessionStorage.removeItem("oauth_state");
        sessionStorage.removeItem("oauth_code_verifier");

        return true;
      } else {
        console.error("❌ User does not have access to the required J+D Lab Network base");
        showAuthError(
          "Access denied: You must grant access to the J+D Lab Network base to use this application. Please try authenticating again and make sure to select the 'J+D Lab Network' base during authorization."
        );
        return false;
      }
    } else {
      console.error("❌ No access token received");
      showAuthError("Authentication failed: No access token received");
      return false;
    }
  } catch (error) {
    console.error("❌ Token exchange failed:", error);
    console.error("❌ Error type:", error.constructor.name);
    console.error("❌ Error message:", error.message);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      showAuthError("Authentication failed: CORS error - Unable to connect to Airtable token endpoint. This may be due to browser security restrictions.");
    } else {
      showAuthError("Authentication failed: " + error.message);
    }
    return false;
  }
}

async function exchangeCodeForTokens(code) {
  const codeVerifier = sessionStorage.getItem("oauth_code_verifier");
  console.log("🔍 Code verifier found:", codeVerifier ? "yes" : "no");

  const requestBody = {
    grant_type: "authorization_code",
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    code: code,
    code_verifier: codeVerifier,
  };

  console.log("🔍 Token request body:", requestBody);
  console.log("🔍 Lambda proxy endpoint:", OAUTH_CONFIG.lambdaProxyUrl);

  const response = await fetch(
    OAUTH_CONFIG.lambdaProxyUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );
  
  console.log("🔍 Token response status:", response.status);
  console.log("🔍 Token response headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      const errorText = await response.text();
      console.error("🔍 Token exchange error text:", errorText);
      errorData = { error_description: errorText };
    }
    throw new Error(
      `Token exchange failed: ${errorData.error_description || response.statusText}`
    );
  }

  const tokenData = await response.json();
  console.log("🔍 Token exchange successful, access_token received:", tokenData.access_token ? "yes" : "no");
  return tokenData;
}

async function getUserInfo(accessToken) {
  console.log("🔍 Attempting to fetch user info from Airtable...");
  try {
    const response = await fetch(
      "https://api.airtable.com/v0/meta/whoami",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("🔍 User info response status:", response.status);
    console.log("🔍 User info response ok:", response.ok);

    if (response.ok) {
      const userData = await response.json();
      console.log("✅ User info successfully retrieved:", userData);
      console.log("🔍 Available fields:", Object.keys(userData));
      
      // Create a display name from available data
      if (userData.email && userData.email !== "authenticated_user@airtable.com") {
        userData.displayName = userData.email.split('@')[0]; // Use email username part
      } else if (userData.id && userData.id.startsWith('usr')) {
        userData.displayName = `User ${userData.id.slice(-6)}`; // Use last 6 chars of user ID
      } else {
        userData.displayName = "Authenticated User";
      }
      
      return userData;
    } else {
      const errorText = await response.text();
      console.log("❌ whoami endpoint failed with status:", response.status);
      console.log("❌ Error response:", errorText);
      return {
        id: `user_${Date.now()}`,
        email: "authenticated_user@airtable.com",
        displayName: "Authenticated User"
      };
    }
  } catch (error) {
    console.log("User info fetch failed, using fallback:", error);
    console.log("Error details:", error.message);
    return {
      id: `user_${Date.now()}`,
      email: "authenticated_user@airtable.com",
      displayName: "Authenticated User"
    };
  }
}

async function verifyBaseAccess(accessToken) {
  console.log("🔍 Verifying access to required J+D Lab Network base...");
  try {
    // Try to access the specific J+D Lab Network base
    const response = await fetch(
      `https://api.airtable.com/v0/${OAUTH_CONFIG.requiredBaseId}/${AIRTABLE_CONFIG.tableName}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      console.log("✅ User has access to required J+D Lab Network base");
      return true;
    } else {
      console.log("❌ User does not have access to required J+D Lab Network base");
      console.log("Response status:", response.status);
      const errorText = await response.text();
      console.log("Error details:", errorText);
      return false;
    }
  } catch (error) {
    console.log("❌ Error verifying base access:", error);
    return false;
  }
}

function updateAuthUI() {
  const overlay = document.getElementById("auth-overlay");
  const userInfo = document.getElementById("user-info");
  const userName = document.getElementById("user-name");

  if (authState.isAuthenticated) {
    overlay.classList.add("hidden");
    userInfo.classList.remove("hidden");
    userName.textContent = authState.userName || authState.userEmail || "Authenticated User";

    // Load partners now that user is authenticated
    console.log("Authentication complete - loading partners...");
    testAirtableAuth();
    // Note: loadExistingPartners() will be called by map initialization
  } else {
    overlay.classList.remove("hidden");
    userInfo.classList.add("hidden");
  }
}

function logout() {
  console.log("🚪 Logging out...");

  // Clear authentication state
  authState.isAuthenticated = false;
  authState.accessToken = null;
  authState.refreshToken = null;
  authState.userEmail = null;
  authState.userName = null;
  authState.userId = null;

  // Clear localStorage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_id");

  // Update UI
  updateAuthUI();
}

function checkExistingAuth() {
  console.log("🔍 Checking for existing authentication...");

  const token = localStorage.getItem("auth_token");
  const userEmail = localStorage.getItem("user_email");
  const userName = localStorage.getItem("user_name");
  const userId = localStorage.getItem("user_id");

  if (token && userEmail && userId) {
    console.log("✅ Found existing authentication");
    authState.isAuthenticated = true;
    authState.accessToken = token;
    authState.refreshToken = localStorage.getItem("refresh_token");
    authState.userEmail = userEmail;
    authState.userName = userName || userEmail; // Fallback to email if name not stored
    authState.userId = userId;
    updateAuthUI();
    return true;
  }

  console.log("ℹ️ No existing authentication found");
  return false;
}

function showAuthError(message) {
  const overlay = document.getElementById("auth-overlay");
  const authMessage = overlay.querySelector(".auth-message");
  
  // Create or update error message
  let errorDiv = authMessage.querySelector(".auth-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "auth-error";
    errorDiv.style.cssText = "color: #ff0064; margin-top: 20px; padding: 15px; background: rgba(255,0,100,0.1); border: 1px solid #ff0064; border-radius: 4px;";
    authMessage.appendChild(errorDiv);
  }
  
  errorDiv.textContent = message;
  overlay.classList.remove("hidden");
}