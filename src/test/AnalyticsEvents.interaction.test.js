import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('AnalyticsEvents User Interaction Errors', () => {
  let mockDocument;
  let mockWindow;
  let mockConsole;

  beforeEach(() => {
    // Mock console
    mockConsole = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    global.console = mockConsole;

    // Mock window WITHOUT gtag initially
    mockWindow = {
      dataLayer: [],
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      pageYOffset: 0,
      innerHeight: 1000,
      location: { hostname: 'heliomedeiros.com' },
    };
    global.window = mockWindow;

    // Mock document
    mockDocument = {
      documentElement: { scrollHeight: 2000 },
      querySelectorAll: vi.fn(() => []),
      getElementById: vi.fn(() => null),
    };
    global.document = mockDocument;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Contact Button Click Before gtag Ready', () => {
    it('should capture ReferenceError when contact button clicked before gtag is defined', () => {
      // Setup contact button mock
      let clickHandler;
      const mockContactBtn = {
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'contact-btn') return mockContactBtn;
        return null;
      });

      // Simulate the current broken code (before our fix)
      const setupBrokenConversionTracking = () => {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            // This is the broken version that causes the error
            gtag('event', 'contact_initiated', {
              event_category: 'conversion',
              event_label: 'hero_contact_button',
              value: 1
            });
          }, { passive: true });
        }
      };

      // Setup tracking
      setupBrokenConversionTracking();

             // Simulate click when gtag is not defined (in our case, set to undefined)
       delete global.gtag;
       expect(() => {
         clickHandler();
       }).toThrow('gtag is not defined');
    });

    it('should handle gtag undefined gracefully with proper error handling', () => {
      // Setup contact button mock
      let clickHandler;
      const mockContactBtn = {
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'contact-btn') return mockContactBtn;
        return null;
      });

      // Simulate the FIXED version with proper error handling
      const setupFixedConversionTracking = () => {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            try {
              if (typeof window.gtag === 'function') {
                window.gtag('event', 'contact_initiated', {
                  event_category: 'conversion',
                  event_label: 'hero_contact_button',
                  value: 1
                });
                console.log('Enhanced Analytics: Contact initiated event tracked');
              } else {
                console.warn('Enhanced Analytics: gtag not available, skipping contact tracking');
              }
            } catch (error) {
              console.error('Enhanced Analytics: Error tracking contact event:', error);
            }
          }, { passive: true });
        }
      };

      // Setup tracking
      setupFixedConversionTracking();

      // Simulate click when gtag is not defined - should NOT throw
      expect(() => {
        clickHandler();
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith('Enhanced Analytics: gtag not available, skipping contact tracking');
    });

    it('should work properly when gtag is available', () => {
      // Add gtag to window
      window.gtag = vi.fn();

      // Setup contact button mock
      let clickHandler;
      const mockContactBtn = {
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'contact-btn') return mockContactBtn;
        return null;
      });

      // Simulate the FIXED version
      const setupFixedConversionTracking = () => {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            try {
              if (typeof window.gtag === 'function') {
                window.gtag('event', 'contact_initiated', {
                  event_category: 'conversion',
                  event_label: 'hero_contact_button',
                  value: 1
                });
                console.log('Enhanced Analytics: Contact initiated event tracked');
              } else {
                console.warn('Enhanced Analytics: gtag not available, skipping contact tracking');
              }
            } catch (error) {
              console.error('Enhanced Analytics: Error tracking contact event:', error);
            }
          }, { passive: true });
        }
      };

      // Setup tracking
      setupFixedConversionTracking();

      // Simulate click when gtag IS available
      clickHandler();

      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_initiated', {
        event_category: 'conversion',
        event_label: 'hero_contact_button',
        value: 1
      });
      expect(console.log).toHaveBeenCalledWith('Enhanced Analytics: Contact initiated event tracked');
    });
  });

  describe('Navigation Link Click Before gtag Ready', () => {
    it('should capture ReferenceError when navigation link clicked before gtag is defined', () => {
      // Setup navigation links mock
      let clickHandler;
      const mockLink = {
        getAttribute: vi.fn(() => '#about'),
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      document.querySelectorAll = vi.fn((selector) => {
        if (selector === 'nav a[href^="#"]') {
          return [mockLink];
        }
        return [];
      });

      // Simulate the current broken code
      const setupBrokenNavigationTracking = () => {
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
          link.addEventListener('click', function(e) {
            const section = this.getAttribute('href').substring(1);
            if (section) {
              // This is the broken version that causes the error
              gtag('event', 'navigation_click', {
                event_category: 'navigation',
                event_label: section,
                navigation_type: 'menu'
              });
            }
          }, { passive: true });
        });
      };

      // Setup tracking
      setupBrokenNavigationTracking();

             // Simulate click when gtag is not defined (in our case, set to undefined)
       delete global.gtag;
       expect(() => {
         clickHandler.call(mockLink);
       }).toThrow('gtag is not defined');
    });

    it('should handle navigation clicks gracefully with proper error handling', () => {
      // Setup navigation links mock
      let clickHandler;
      const mockLink = {
        getAttribute: vi.fn(() => '#about'),
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      document.querySelectorAll = vi.fn((selector) => {
        if (selector === 'nav a[href^="#"]') {
          return [mockLink];
        }
        return [];
      });

      const sanitizeString = (str) => str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';

      // Simulate the FIXED version
      const setupFixedNavigationTracking = () => {
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
          link.addEventListener('click', function(e) {
            try {
              const section = sanitizeString(this.getAttribute('href').substring(1));
              if (section && typeof window.gtag === 'function') {
                window.gtag('event', 'navigation_click', {
                  event_category: 'navigation',
                  event_label: section,
                  navigation_type: 'menu'
                });
              } else if (section) {
                console.warn('Enhanced Analytics: gtag not available, skipping navigation tracking');
              }
            } catch (error) {
              console.error('Enhanced Analytics: Error tracking navigation event:', error);
            }
          }, { passive: true });
        });
      };

      // Setup tracking
      setupFixedNavigationTracking();

      // Simulate click when gtag is not defined - should NOT throw
      expect(() => {
        clickHandler.call(mockLink);
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith('Enhanced Analytics: gtag not available, skipping navigation tracking');
    });
  });

  describe('Section Observer Before gtag Ready', () => {
    it('should handle IntersectionObserver callback when gtag is not defined', () => {
      let observerCallback;
      const mockEntry = {
        isIntersecting: true,
        target: { id: 'about' }
      };

      // Mock IntersectionObserver
      global.IntersectionObserver = vi.fn((callback) => {
        observerCallback = callback;
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      });

      const sanitizeString = (str) => str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';

      // Simulate the FIXED version with proper error handling
      const setupFixedSectionTracking = () => {
        const observerOptions = {
          threshold: 0.6,
          rootMargin: '-80px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              try {
                const sectionName = sanitizeString(entry.target.id);
                if (sectionName && typeof window.gtag === 'function') {
                  window.gtag('event', 'section_view', {
                    event_category: 'navigation',
                    event_label: sectionName,
                    custom_map: {'section_name': sectionName}
                  });
                } else if (sectionName) {
                  console.warn('Enhanced Analytics: gtag not available, skipping section tracking');
                }
              } catch (error) {
                console.error('Enhanced Analytics: Error tracking section view:', error);
              }
            }
          });
        }, observerOptions);

        return sectionObserver;
      };

      // Setup tracking
      setupFixedSectionTracking();

      // Trigger observer callback when gtag is not defined - should NOT throw
      expect(() => {
        observerCallback([mockEntry]);
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith('Enhanced Analytics: gtag not available, skipping section tracking');
    });
  });

  describe('Error Recovery', () => {
    it('should continue working after gtag becomes available', () => {
      // Start without gtag
      expect(window.gtag).toBeUndefined();

      // Setup contact button
      let clickHandler;
      const mockContactBtn = {
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'contact-btn') return mockContactBtn;
        return null;
      });

      const setupFixedConversionTracking = () => {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            try {
              if (typeof window.gtag === 'function') {
                window.gtag('event', 'contact_initiated', {
                  event_category: 'conversion',
                  event_label: 'hero_contact_button',
                  value: 1
                });
                console.log('Enhanced Analytics: Contact initiated event tracked');
              } else {
                console.warn('Enhanced Analytics: gtag not available, skipping contact tracking');
              }
            } catch (error) {
              console.error('Enhanced Analytics: Error tracking contact event:', error);
            }
          }, { passive: true });
        }
      };

      setupFixedConversionTracking();

      // First click - gtag not available
      clickHandler();
      expect(console.warn).toHaveBeenCalledWith('Enhanced Analytics: gtag not available, skipping contact tracking');

      // Now gtag becomes available
      window.gtag = vi.fn();

      // Second click - should work
      clickHandler();
      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_initiated', {
        event_category: 'conversion',
        event_label: 'hero_contact_button',
        value: 1
      });
      expect(console.log).toHaveBeenCalledWith('Enhanced Analytics: Contact initiated event tracked');
    });
  });
});
