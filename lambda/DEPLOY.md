# AWS Lambda OAuth Proxy Deployment

This Lambda function acts as a proxy for the OAuth2 token exchange with Airtable, bypassing CORS restrictions.

## Prerequisites

1. AWS CLI installed and configured
2. AWS account with Lambda access
3. IAM permissions for Lambda function creation and management

## Manual Deployment Steps

### 1. Create the Lambda Function

```bash
# Navigate to the lambda directory
cd lambda

# Create deployment package
zip oauth-proxy.zip oauth-proxy.js

# Create the Lambda function (first time only)
aws lambda create-function \
  --function-name jd-map-oauth-proxy \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler oauth-proxy.handler \
  --zip-file fileb://oauth-proxy.zip \
  --description "OAuth2 token exchange proxy for J+D Network Map"
```

### 2. Create API Gateway (if needed)

```bash
# Create REST API
aws apigateway create-rest-api --name jd-map-oauth-proxy

# Get the API ID from the response, then create resources and methods
# This is complex via CLI, consider using AWS Console for API Gateway setup
```

### 3. Using AWS Console (Recommended)

1. **Create Lambda Function:**
   - Go to AWS Lambda Console
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `jd-map-oauth-proxy`
   - Runtime: Node.js 18.x
   - Create function

2. **Upload Code:**
   - In the function page, upload the `oauth-proxy.zip` file
   - Or copy-paste the code from `oauth-proxy.js`

3. **Create API Gateway:**
   - Go to API Gateway Console
   - Create new REST API
   - Create resource: `/oauth/token`
   - Create method: `POST`
   - Integration type: Lambda Function
   - Lambda function: `jd-map-oauth-proxy`
   - Enable CORS for the method
   - Deploy API to a stage (e.g., "prod")

4. **Configure CORS:**
   - In API Gateway, select your method
   - Actions → Enable CORS
   - Access-Control-Allow-Origin: `https://master.d3u92f9fdv7kxv.amplifyapp.com`
   - Access-Control-Allow-Headers: `Content-Type`
   - Access-Control-Allow-Methods: `POST,OPTIONS`

5. **Deploy:**
   - Actions → Deploy API
   - Create new stage: "prod"
   - Note the Invoke URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

## Environment Variables

The Lambda function doesn't require environment variables, but you may want to add:

- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `AIRTABLE_BASE_URL`: Base URL for Airtable API (defaults to www.airtable.com)

## Testing

Test the function with curl:

```bash
curl -X POST https://YOUR_API_GATEWAY_URL/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "code": "test_code",
    "code_verifier": "test_verifier", 
    "client_id": "your_client_id",
    "redirect_uri": "https://master.d3u92f9fdv7kxv.amplifyapp.com/"
  }'
```

## Security Notes

- The function only accepts requests from your specific Amplify domain
- All OAuth credentials are passed through without storage
- Consider adding rate limiting for production use
- Monitor CloudWatch logs for any issues

## Next Steps

After deployment, update your client-side code to use the Lambda proxy endpoint instead of calling Airtable directly.