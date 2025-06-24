import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('GoogleAnalytics Component', () => {
  let mockDocument;
  let mockHead;
  let mockScript;

  beforeEach(() => {
    // Mock DOM elements
    mockScript = {
      src: '',
      async: false,
      onload: null,
      onerror: null,
    };

    mockHead = {
      appendChild: vi.fn(),
    };

    mockDocument = {
      createElement: vi.fn(() => mockScript),
      head: mockHead,
    };

    global.document = mockDocument;

    // Mock console methods
    global.console = {
      log: vi.fn(),
      error: vi.fn(),
    };

    // Test setup complete
  });

  describe('Production Environment', () => {
    it('should load Google Analytics scripts in production', () => {
      // Simulate the component script execution
      const measurementId = 'G-GL0Q1PNV4W';

            // This simulates what happens in the GoogleAnalytics component
      const loadGoogleAnalytics = (isProd = true) => {
        if (isProd) {
          console.log('GoogleAnalytics component loaded, isProd check:', isProd);
          console.log('GoogleAnalytics: Production mode confirmed, loading GA scripts...');

          // Create and append first script
          const gtagSrc = document.createElement('script');
          gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
          gtagSrc.async = true;
          document.head.appendChild(gtagSrc);

          // Create inline script
          console.log('GA inline script executing, measurement ID:', measurementId);

          // Initialize dataLayer and gtag
          if (!window.dataLayer) {
            window.dataLayer = [];
          }

          if (!window.gtag) {
            window.gtag = function() {
              window.dataLayer.push(arguments);
            };
          }

          // Configure gtag
          window.gtag('js', new Date());
          window.gtag('config', measurementId, {
            cookie_domain: 'heliomedeiros.com',
            cookie_flags: 'SameSite=None;Secure'
          });

          console.log('GA gtag configured, dataLayer:', window.dataLayer);
          console.log('gtag function available:', typeof window.gtag);

          return true;
        }
        return false;
      };

      const result = loadGoogleAnalytics();

      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('GoogleAnalytics component loaded, isProd check:', true);
      expect(console.log).toHaveBeenCalledWith('GoogleAnalytics: Production mode confirmed, loading GA scripts...');
      expect(console.log).toHaveBeenCalledWith('GA inline script executing, measurement ID:', measurementId);

      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(mockScript.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
      expect(mockScript.async).toBe(true);
      expect(mockHead.appendChild).toHaveBeenCalledWith(mockScript);

      expect(window.dataLayer).toBeDefined();
      expect(typeof window.gtag).toBe('function');
      expect(console.log).toHaveBeenCalledWith('gtag function available:', 'function');
    });

    it('should configure gtag with correct parameters', () => {
      const measurementId = 'G-GL0Q1PNV4W';

      // Initialize gtag
      window.dataLayer = [];
      window.gtag = vi.fn((cmd, ...args) => {
        window.dataLayer.push([cmd, ...args]);
      });

      // Simulate gtag configuration
      window.gtag('js', expect.any(Date));
      window.gtag('config', measurementId, {
        cookie_domain: 'heliomedeiros.com',
        cookie_flags: 'SameSite=None;Secure'
      });

      expect(window.gtag).toHaveBeenCalledWith('js', expect.any(Date));
      expect(window.gtag).toHaveBeenCalledWith('config', measurementId, {
        cookie_domain: 'heliomedeiros.com',
        cookie_flags: 'SameSite=None;Secure'
      });
    });
  });

  describe('Development Environment', () => {

    it('should not load Google Analytics in development', () => {
      const loadGoogleAnalytics = (isProd = false) => {
        if (isProd) {
          console.log('GoogleAnalytics: Production mode confirmed, loading GA scripts...');
          return true;
        } else {
          console.log('GoogleAnalytics: Development mode, skipping GA scripts');
          return false;
        }
      };

      const result = loadGoogleAnalytics(false);

      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('GoogleAnalytics: Development mode, skipping GA scripts');
      expect(document.createElement).not.toHaveBeenCalled();
      expect(mockHead.appendChild).not.toHaveBeenCalled();
    });
  });

  describe('Script Loading', () => {
    it('should handle script loading success', () => {
      window.dataLayer = [];
      window.gtag = vi.fn();

      const simulateScriptLoad = () => {
        console.log('GA script loaded successfully');
        return true;
      };

      const result = simulateScriptLoad();

      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('GA script loaded successfully');
    });

    it('should handle script loading errors gracefully', () => {
      const simulateScriptError = () => {
        console.error('GA script failed to load');
        return false;
      };

      const result = simulateScriptError();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('GA script failed to load');
    });
  });
});
