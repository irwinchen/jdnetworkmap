const https = require('https');
const querystring = require('querystring');

exports.handler = async (event) => {
    // Enable CORS for your Amplify domain
    const corsHeaders = {
        'Access-Control-Allow-Origin': 'https://master.d3u92f9fdv7kxv.amplifyapp.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    console.log('Received event:', JSON.stringify(event, null, 2));

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: '',
        };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const { code, code_verifier, client_id, redirect_uri } = body;

        // Validate required parameters
        if (!code || !code_verifier || !client_id || !redirect_uri) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: 'missing_parameters',
                    error_description: 'Missing required parameters'
                }),
            };
        }

        // Prepare the token exchange request
        const tokenData = querystring.stringify({
            grant_type: 'authorization_code',
            client_id: client_id,
            redirect_uri: redirect_uri,
            code: code,
            code_verifier: code_verifier,
        });

        // Make the token exchange request to Airtable
        const tokenResponse = await makeHttpsRequest({
            hostname: 'www.airtable.com',
            path: '/oauth2/v1/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(tokenData),
            },
        }, tokenData);

        // Parse the response
        const responseData = JSON.parse(tokenResponse.body);

        if (tokenResponse.statusCode !== 200) {
            return {
                statusCode: tokenResponse.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(responseData),
            };
        }

        // Return the tokens
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(responseData),
        };

    } catch (error) {
        console.error('OAuth proxy error:', error);
        console.error('Error stack:', error.stack);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'server_error',
                error_description: 'Internal server error: ' + error.message
            }),
        };
    }
};

// Helper function to make HTTPS requests
function makeHttpsRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}