export const YOUTUBE_CONFIG = {
  CLIENT_ID: '616121273191-5hg2brgk4l0qis7rbkfddp81uvq4enj1.apps.googleusercontent.com',
  API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
  SCOPES: ['https://www.googleapis.com/auth/youtube.readonly'],
  DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
  AUTH_PARAMS: {
    hosted_domain: 'stackblitz.com',
    redirect_uri: 'https://stackblitz.com/auth/callback'
  }
};