/**
 * Welcome to the MAIS API Gateway!
 * 
 * This Cloudflare Worker acts as a secure proxy between the frontend application and the Supabase backend.
 * - It intercepts all requests to /api/.
 * - It injects the Supabase Service Role Key for authentication.
 * - It forwards the request to the Supabase REST API.
 * This ensures that no sensitive credentials are ever exposed to the client-side.
 */

// Define the environment variables and secrets available to the Worker
export interface Env {
  // The Supabase URL, set in wrangler.toml
  SUPABASE_URL: string;
  // The Supabase Service Role Key, injected as a secret
  SUPABASE_SERVICE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Remove the /api prefix to get the intended Supabase path (e.g., /users, /messages)
    const apiPath = url.pathname.replace(/^\/api/, '');

    // Construct the full target URL for the Supabase REST API
    const targetUrl = `${env.SUPABASE_URL}${apiPath}${url.search}`;

    // Create a new set of headers for the outgoing request
    const requestHeaders = new Headers(request.headers);

    // Set the mandatory Supabase authentication headers using the secret key
    requestHeaders.set('apikey', env.SUPABASE_SERVICE_KEY);
    requestHeaders.set('Authorization', `Bearer ${env.SUPABASE_SERVICE_KEY}`);

    // Forward the request to Supabase with the original method, new headers, and original body
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: request.body,
      redirect: 'follow'
    });

    // Return the response from Supabase back to the original client
    return response;
  },
};