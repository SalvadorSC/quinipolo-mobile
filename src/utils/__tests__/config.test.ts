import {
  config,
  getRedirectUrl,
  AUTH_TOKEN_STORAGE_KEY,
  PENDING_QUINIPOLO_RECENT_DAYS,
} from '../config';

// Mock __DEV__
const originalDev = global.__DEV__;
beforeEach(() => {
  global.__DEV__ = true;
});

afterEach(() => {
  global.__DEV__ = originalDev;
});

describe('config', () => {
  it('should have correct development configuration', () => {
    expect(config.baseUrl).toBe('http://localhost:3001');
    expect(config.apiBaseUrl).toBe('http://localhost:3000');
    expect(config.isDevelopment).toBe(true);
    expect(config.isProduction).toBe(false);
  });

  it('should have correct production configuration', () => {
    global.__DEV__ = false;

    expect(config.baseUrl).toBe('https://quinipolo.com');
    expect(config.apiBaseUrl).toBe('https://quinipolo.onrender.com');
    expect(config.isDevelopment).toBe(false);
    expect(config.isProduction).toBe(true);
  });

  it('should have supabase configuration', () => {
    expect(config.supabase).toBeDefined();
    expect(config.supabase.url).toBeDefined();
    expect(config.supabase.anonKey).toBeDefined();
  });
});

describe('getRedirectUrl', () => {
  it('should return correct redirect URL', () => {
    const result = getRedirectUrl('/test');
    expect(result).toBe('http://localhost:3001/test');
  });

  it('should handle empty path', () => {
    const result = getRedirectUrl('');
    expect(result).toBe('http://localhost:3001');
  });
});

describe('constants', () => {
  it('should have correct AUTH_TOKEN_STORAGE_KEY', () => {
    expect(AUTH_TOKEN_STORAGE_KEY).toBe('quinipolo-auth-token');
  });

  it('should have correct PENDING_QUINIPOLO_RECENT_DAYS', () => {
    expect(PENDING_QUINIPOLO_RECENT_DAYS).toBe(30);
  });
});
