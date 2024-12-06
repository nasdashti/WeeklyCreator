import { YOUTUBE_CONFIG } from '@/config/youtube';
import toast from 'react-hot-toast';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gsiInited = false;

export async function initializeGapi(): Promise<void> {
  if (gapiInited) return;

  return new Promise((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: YOUTUBE_CONFIG.API_KEY,
          discoveryDocs: YOUTUBE_CONFIG.DISCOVERY_DOCS,
        });
        gapiInited = true;
        resolve();
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
        reject(error);
      }
    });
  });
}

export function initializeTokenClient(): void {
  if (gsiInited) return;

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: YOUTUBE_CONFIG.CLIENT_ID,
    scope: YOUTUBE_CONFIG.SCOPES.join(' '),
    prompt: 'consent',
    hosted_domain: YOUTUBE_CONFIG.AUTH_PARAMS.hosted_domain,
    callback: '', // Will be set during authorization
  });
  gsiInited = true;
}

export async function authorize(): Promise<void> {
  if (!tokenClient) {
    throw new Error('Token client not initialized');
  }

  return new Promise((resolve, reject) => {
    try {
      tokenClient!.callback = async (response) => {
        if (response.error) {
          reject(response.error);
          return;
        }
        resolve();
      };

      if (gapi.client.getToken() === null) {
        tokenClient!.requestAccessToken({
          prompt: 'consent'
        });
      } else {
        resolve();
      }
    } catch (error) {
      console.error('Authorization error:', error);
      reject(error);
    }
  });
}

export async function signIn(): Promise<void> {
  try {
    if (!gapiInited || !gsiInited) {
      await initializeGapi();
      initializeTokenClient();
    }
    await authorize();
    toast.success('Successfully connected to YouTube!');
  } catch (error) {
    console.error('Sign in error:', error);
    toast.error('Failed to connect to YouTube');
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken(null);
  }
}

export function isAuthenticated(): boolean {
  return gapi.client?.getToken() !== null;
}