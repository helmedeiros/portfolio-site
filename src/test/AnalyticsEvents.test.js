import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('AnalyticsEvents Component', () => {
  let mockGtag;
  let mockDataLayer;
  let mockConsole;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Mock gtag function
    mockGtag = vi.fn();
    mockDataLayer = [];

    // Mock console methods
    mockConsole = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };

    // Replace console methods
    vi.spyOn(console, 'log').mockImplementation(mockConsole.log);
    vi.spyOn(console, 'warn').mockImplementation(mockConsole.warn);
    vi.spyOn(console, 'error').mockImplementation(mockConsole.error);

    // Clean up any existing globals
    delete window.gtag;
    delete window.dataLayer;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trackEvent function', () => {
    it('should use gtag when available', () => {
      // Setup
      window.gtag = mockGtag;

      // Load and execute the component script
      const componentScript = `
        const trackEvent = (eventName, parameters = {}) => {
          try {
            if (typeof window.gtag === 'function') {
              window.gtag('event', eventName, parameters);
              console.log('Enhanced Analytics: Event tracked:', eventName, parameters);
            } else {
              console.warn('Enhanced Analytics: gtag not available, queuing event:', eventName);
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'event': eventName,
                ...parameters
              });
            }
          } catch (error) {
            console.error('Enhanced Analytics: Error tracking event:', eventName, error);
          }
        };

        // Test the function
        trackEvent('test_event', { test_param: 'test_value' });
      `;

      eval(componentScript);

      // Verify
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', { test_param: 'test_value' });
      expect(mockConsole.log).toHaveBeenCalledWith('Enhanced Analytics: Event tracked:', 'test_event', { test_param: 'test_value' });
    });

    it('should queue events in dataLayer when gtag is not available', () => {
      // Setup - no gtag available
      window.dataLayer = mockDataLayer;

      const componentScript = `
        const trackEvent = (eventName, parameters = {}) => {
          try {
            if (typeof window.gtag === 'function') {
              window.gtag('event', eventName, parameters);
              console.log('Enhanced Analytics: Event tracked:', eventName, parameters);
            } else {
              console.warn('Enhanced Analytics: gtag not available, queuing event:', eventName);
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'event': eventName,
                ...parameters
              });
            }
          } catch (error) {
            console.error('Enhanced Analytics: Error tracking event:', eventName, error);
          }
        };

        trackEvent('test_event', { test_param: 'test_value' });
      `;

      eval(componentScript);

      // Verify
      expect(mockConsole.warn).toHaveBeenCalledWith('Enhanced Analytics: gtag not available, queuing event:', 'test_event');
      expect(window.dataLayer).toContainEqual({
        'event': 'test_event',
        'test_param': 'test_value'
      });
    });

    it('should handle errors gracefully', () => {
      // Setup - gtag that throws an error
      window.gtag = vi.fn(() => {
        throw new Error('gtag error');
      });

      const componentScript = `
        const trackEvent = (eventName, parameters = {}) => {
          try {
            if (typeof window.gtag === 'function') {
              window.gtag('event', eventName, parameters);
              console.log('Enhanced Analytics: Event tracked:', eventName, parameters);
            } else {
              console.warn('Enhanced Analytics: gtag not available, queuing event:', eventName);
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'event': eventName,
                ...parameters
              });
            }
          } catch (error) {
            console.error('Enhanced Analytics: Error tracking event:', eventName, error);
          }
        };

        trackEvent('test_event', { test_param: 'test_value' });
      `;

      eval(componentScript);

      // Verify error handling
      expect(mockConsole.error).toHaveBeenCalledWith(
        'Enhanced Analytics: Error tracking event:',
        'test_event',
        expect.any(Error)
      );
    });
  });

  describe('Contact button tracking', () => {
    it('should track contact button clicks', () => {
      // Setup
      window.gtag = mockGtag;
      document.body.innerHTML = '<button id="contact-btn">Contact Us</button>';

      const setupScript = `
        const trackEvent = (eventName, parameters = {}) => {
          if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, parameters);
          }
        };

        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            trackEvent('contact_initiated', {
              'event_category': 'conversion',
              'event_label': 'hero_contact_button',
              'value': 1
            });
          }, { passive: true });
        }
      `;

      eval(setupScript);

      // Trigger click
      const contactBtn = document.getElementById('contact-btn');
      contactBtn.click();

      // Verify
      expect(mockGtag).toHaveBeenCalledWith('event', 'contact_initiated', {
        'event_category': 'conversion',
        'event_label': 'hero_contact_button',
        'value': 1
      });
    });

    it('should handle missing contact button gracefully', () => {
      // Setup - no contact button in DOM
      window.gtag = mockGtag;

      const setupScript = `
        const trackEvent = (eventName, parameters = {}) => {
          if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, parameters);
          }
        };

        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            trackEvent('contact_initiated', {
              'event_category': 'conversion',
              'event_label': 'hero_contact_button',
              'value': 1
            });
          }, { passive: true });
        }
      `;

      eval(setupScript);

      // Should not throw error and gtag should not be called
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('Navigation tracking', () => {
    it('should track navigation clicks', () => {
      // Setup
      window.gtag = mockGtag;
      document.body.innerHTML = `
        <nav>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      `;

      const setupScript = `
        const sanitizeString = (str) => {
          return str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';
        };

        const trackEvent = (eventName, parameters = {}) => {
          if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, parameters);
          }
        };

        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
          link.addEventListener('click', function(e) {
            const section = sanitizeString(this.getAttribute('href').substring(1));
            if (section) {
              trackEvent('navigation_click', {
                'event_category': 'navigation',
                'event_label': section,
                'navigation_type': 'menu'
              });
            }
          }, { passive: true });
        });
      `;

      eval(setupScript);

      // Trigger click on about link
      const aboutLink = document.querySelector('a[href="#about"]');
      aboutLink.click();

      // Verify
      expect(mockGtag).toHaveBeenCalledWith('event', 'navigation_click', {
        'event_category': 'navigation',
        'event_label': 'about',
        'navigation_type': 'menu'
      });
    });
  });

  describe('External link tracking', () => {
    it('should track external link clicks', () => {
      // Setup
      window.gtag = mockGtag;

      // Mock window.location.hostname
      delete window.location;
      window.location = { hostname: 'heliomedeiros.com' };

      document.body.innerHTML = `
        <a href="https://github.com/helmedeiros">GitHub</a>
        <a href="https://heliomedeiros.com/blog">Internal Link</a>
      `;

      const setupScript = `
        const sanitizeString = (str) => {
          return str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';
        };

        const trackEvent = (eventName, parameters = {}) => {
          if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, parameters);
          }
        };

        document.querySelectorAll('a[href^="http"]').forEach(link => {
          if (link.hostname === window.location.hostname) return;

          link.addEventListener('click', function(e) {
            const linkText = sanitizeString(this.textContent.trim());
            const linkUrl = this.href;
            const linkDomain = this.hostname;

            trackEvent('outbound_click', {
              'event_category': 'engagement',
              'event_label': linkDomain,
              'link_text': linkText,
              'link_url': linkUrl
            });
          }, { passive: true });
        });
      `;

      eval(setupScript);

      // Click external link (GitHub)
      const githubLink = document.querySelector('a[href^="https://github.com"]');
      githubLink.click();

      // Verify external link was tracked
      expect(mockGtag).toHaveBeenCalledWith('event', 'outbound_click', {
        'event_category': 'engagement',
        'event_label': 'github.com',
        'link_text': 'GitHub',
        'link_url': 'https://github.com/helmedeiros'
      });

      // Internal link should not be tracked
      const internalLink = document.querySelector('a[href^="https://heliomedeiros.com"]');
      mockGtag.mockClear();
      internalLink.click();
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('Initialization and error handling', () => {
    it('should initialize tracking successfully', () => {
      // Setup
      window.gtag = mockGtag;
      document.body.innerHTML = `
        <button id="contact-btn">Contact</button>
        <nav><a href="#about">About</a></nav>
        <section id="about">About content</section>
      `;

      const initScript = `
        console.log('Enhanced Analytics: Starting initialization...');

        const sanitizeString = (str) => {
          return str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';
        };

        const trackEvent = (eventName, parameters = {}) => {
          try {
            if (typeof window.gtag === 'function') {
              window.gtag('event', eventName, parameters);
              console.log('Enhanced Analytics: Event tracked:', eventName, parameters);
            }
          } catch (error) {
            console.error('Enhanced Analytics: Error tracking event:', eventName, error);
          }
        };

        const initializeTracking = () => {
          try {
            console.log('Enhanced Analytics: Initializing all tracking...');

            // Setup contact tracking
            const contactBtn = document.getElementById('contact-btn');
            if (contactBtn) {
              contactBtn.addEventListener('click', function() {
                trackEvent('contact_initiated', {
                  'event_category': 'conversion',
                  'event_label': 'hero_contact_button',
                  'value': 1
                });
              }, { passive: true });
            }

            trackEvent('analytics_enhanced_loaded', {
              'event_category': 'system',
              'event_label': 'tracking_initialized'
            });

            console.log('Enhanced Analytics: All tracking initialized successfully');
          } catch (error) {
            console.error('Enhanced Analytics: Initialization failed:', error);
          }
        };

        initializeTracking();
      `;

      eval(initScript);

      // Verify initialization
      expect(mockConsole.log).toHaveBeenCalledWith('Enhanced Analytics: Starting initialization...');
      expect(mockConsole.log).toHaveBeenCalledWith('Enhanced Analytics: Initializing all tracking...');
      expect(mockConsole.log).toHaveBeenCalledWith('Enhanced Analytics: All tracking initialized successfully');

      // Verify system event was tracked
      expect(mockGtag).toHaveBeenCalledWith('event', 'analytics_enhanced_loaded', {
        'event_category': 'system',
        'event_label': 'tracking_initialized'
      });
    });

    it('should handle initialization errors gracefully', () => {
      // Setup - gtag that throws an error
      window.gtag = vi.fn(() => {
        throw new Error('gtag initialization error');
      });

      const initScript = `
        const trackEvent = (eventName, parameters = {}) => {
          try {
            if (typeof window.gtag === 'function') {
              window.gtag('event', eventName, parameters);
            }
          } catch (error) {
            console.error('Enhanced Analytics: Error tracking event:', eventName, error);
          }
        };

        const initializeTracking = () => {
          try {
            trackEvent('analytics_enhanced_loaded', {
              'event_category': 'system',
              'event_label': 'tracking_initialized'
            });
            console.log('Enhanced Analytics: All tracking initialized successfully');
          } catch (error) {
            console.error('Enhanced Analytics: Initialization failed:', error);
          }
        };

        initializeTracking();
      `;

      eval(initScript);

      // Should handle error gracefully
      expect(mockConsole.error).toHaveBeenCalledWith(
        'Enhanced Analytics: Error tracking event:',
        'analytics_enhanced_loaded',
        expect.any(Error)
      );
    });
  });

  describe('String sanitization', () => {
    it('should sanitize strings properly', () => {
      const sanitizeScript = `
        const sanitizeString = (str) => {
          return str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';
        };

        window.testSanitize = sanitizeString;
      `;

      eval(sanitizeScript);

      // Test cases
      expect(window.testSanitize('normal text')).toBe('normal text');
      expect(window.testSanitize('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
      expect(window.testSanitize('"quoted" text')).toBe('quoted text');
      expect(window.testSanitize("'single' quotes")).toBe('single quotes');
      expect(window.testSanitize(null)).toBe('');
      expect(window.testSanitize(undefined)).toBe('');

      // Test length limit
      const longString = 'a'.repeat(150);
      expect(window.testSanitize(longString)).toBe('a'.repeat(100));
    });
  });
});
