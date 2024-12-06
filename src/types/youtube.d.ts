declare namespace google.accounts.oauth2 {
  interface TokenClient {
    callback: (response: TokenResponse) => void;
    requestAccessToken(overrideConfig?: TokenClientConfig): void;
  }

  interface TokenClientConfig {
    client_id: string;
    scope: string;
    prompt?: string;
    access_type?: string;
    callback?: (response: TokenResponse) => void;
  }

  interface TokenResponse {
    access_token: string;
    error?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }

  function initTokenClient(config: TokenClientConfig): TokenClient;
}

declare namespace gapi.client {
  function init(config: {
    apiKey: string;
    discoveryDocs: string[];
  }): Promise<void>;

  function getToken(): {
    access_token: string;
  } | null;

  function setToken(token: { access_token: string; } | null): void;

  namespace youtube {
    namespace channels {
      function list(params: {
        part: string[];
        id?: string[];
        forHandle?: string;
      }): Promise<{
        result: {
          items?: any[];
        };
      }>;
    }

    namespace search {
      function list(params: {
        part: string[];
        q?: string;
        channelId?: string;
        type?: string[];
        maxResults?: number;
        order?: string;
        publishedAfter?: string;
      }): Promise<{
        result: {
          items?: any[];
        };
      }>;
    }
  }
}