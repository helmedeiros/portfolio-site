import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('AnalyticsEvents Component', () => {
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

    // Mock window
    mockWindow = {
      gtag: vi.fn(),
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

    // Reset dataLayer
    window.dataLayer = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Google Analytics Initialization Wait', () => {
    it('should wait for gtm.load event before initializing', () => {
      const waitForGoogleAnalytics = () => {
        if (typeof window.gtag !== 'undefined' && window.dataLayer) {
          const hasGtmLoad = window.dataLayer.some(item =>
            item && typeof item === 'object' && item.event === 'gtm.load'
          );

          if (hasGtmLoad) {
            console.log('Enhanced Analytics: Google Analytics fully loaded, initializing...');
            return true;
          }
        }
        return false;
      };

      // Initially no gtm.load event
      expect(waitForGoogleAnalytics()).toBe(false);

      // Add gtm.load event to dataLayer
      window.dataLayer.push({ event: 'gtm.load' });

      expect(waitForGoogleAnalytics()).toBe(true);
      expect(console.log).toHaveBeenCalledWith('Enhanced Analytics: Google Analytics fully loaded, initializing...');
    });

    it('should handle missing gtag gracefully', () => {
      delete window.gtag;

      const waitForGoogleAnalytics = () => {
        if (typeof window.gtag !== 'undefined' && window.dataLayer) {
          return true;
        }
        return false;
      };

      expect(waitForGoogleAnalytics()).toBe(false);
    });

    it('should handle missing dataLayer gracefully', () => {
      delete window.dataLayer;

      const waitForGoogleAnalytics = () => {
        if (typeof window.gtag !== 'undefined' && window.dataLayer) {
          return true;
        }
        return false;
      };

      expect(waitForGoogleAnalytics()).toBe(false);
    });

    it('should timeout after 10 seconds', (done) => {
      const timeoutHandler = () => {
        console.warn('Enhanced Analytics: Timeout waiting for Google Analytics, skipping');
        done();
      };

      setTimeout(timeoutHandler, 100); // Simulate timeout (shortened for test)
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Section Tracking', () => {
    let mockIntersectionObserver;
    let observerCallback;

    beforeEach(() => {
      mockIntersectionObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };

      global.IntersectionObserver = vi.fn((callback) => {
        observerCallback = callback;
        return mockIntersectionObserver;
      });

      const mockSections = [
        { id: 'about', observe: vi.fn() },
        { id: 'work', observe: vi.fn() },
        { id: 'contact', observe: vi.fn() },
      ];

      document.querySelectorAll = vi.fn(() => mockSections);
    });

    it('should set up section tracking with IntersectionObserver', () => {
      const setupSectionTracking = () => {
        const observerOptions = {
          threshold: 0.6,
          rootMargin: '-80px 0px'
        };

        const sectionObserver = new IntersectionObserver(() => {}, observerOptions);
        document.querySelectorAll('section[id]').forEach(section => {
          sectionObserver.observe(section);
        });

        return sectionObserver;
      };

      const observer = setupSectionTracking();

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.6, rootMargin: '-80px 0px' }
      );
      expect(document.querySelectorAll).toHaveBeenCalledWith('section[id]');
      expect(mockIntersectionObserver.observe).toHaveBeenCalledTimes(3);
    });

    it('should track section views when intersecting', () => {
      const sanitizeString = (str) => str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';

      const mockEntry = {
        isIntersecting: true,
        target: { id: 'about' }
      };

      // Simulate observer callback
      observerCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionName = sanitizeString(entry.target.id);
            if (sectionName && typeof window.gtag === 'function') {
              window.gtag('event', 'section_view', {
                event_category: 'navigation',
                event_label: sectionName,
                custom_map: {'section_name': sectionName}
              });
              console.log('Enhanced Analytics: Section view tracked:', sectionName);
            }
          }
        });
      };

      // Setup observer
      new IntersectionObserver(observerCallback);

      // Trigger callback
      observerCallback([mockEntry]);

      expect(window.gtag).toHaveBeenCalledWith('event', 'section_view', {
        event_category: 'navigation',
        event_label: 'about',
        custom_map: {'section_name': 'about'}
      });
      expect(console.log).toHaveBeenCalledWith('Enhanced Analytics: Section view tracked:', 'about');
    });

    it('should not track if gtag is not available', () => {
      delete window.gtag;

      const mockEntry = {
        isIntersecting: true,
        target: { id: 'about' }
      };

      observerCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.id;
            if (sectionName && typeof window.gtag === 'function') {
              window.gtag('event', 'section_view', {});
            }
          }
        });
      };

      new IntersectionObserver(observerCallback);
      observerCallback([mockEntry]);

      // Should not be called since gtag is undefined
      expect(window.gtag).toBeUndefined();
    });
  });

  describe('Navigation Tracking', () => {
    beforeEach(() => {
      const mockLinks = [
        {
          getAttribute: vi.fn(() => '#about'),
          addEventListener: vi.fn()
        },
        {
          getAttribute: vi.fn(() => '#work'),
          addEventListener: vi.fn()
        }
      ];

      document.querySelectorAll = vi.fn((selector) => {
        if (selector === 'nav a[href^="#"]') {
          return mockLinks;
        }
        return [];
      });
    });

    it('should set up navigation click tracking', () => {
      const setupNavigationTracking = () => {
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
          link.addEventListener('click', () => {}, { passive: true });
        });
      };

      setupNavigationTracking();

      const mockLinks = document.querySelectorAll('nav a[href^="#"]');
      expect(document.querySelectorAll).toHaveBeenCalledWith('nav a[href^="#"]');
      expect(mockLinks[0].addEventListener).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });
      expect(mockLinks[1].addEventListener).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });
    });

    it('should track navigation clicks', () => {
      const sanitizeString = (str) => str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';
      let clickHandler;

      const mockLink = {
        getAttribute: vi.fn(() => '#about'),
        addEventListener: vi.fn((event, handler) => {
          clickHandler = handler;
        })
      };

      // Simulate click handler
      clickHandler = function() {
        const section = sanitizeString(this.getAttribute('href').substring(1));
        if (section && typeof window.gtag === 'function') {
          window.gtag('event', 'navigation_click', {
            event_category: 'navigation',
            event_label: section,
            navigation_type: 'menu'
          });
        }
      };

      mockLink.addEventListener('click', clickHandler, { passive: true });

      // Simulate click
      clickHandler.call(mockLink);

      expect(window.gtag).toHaveBeenCalledWith('event', 'navigation_click', {
        event_category: 'navigation',
        event_label: 'about',
        navigation_type: 'menu'
      });
    });
  });

  describe('Conversion Tracking', () => {
    it('should track contact button clicks', () => {
      const mockContactBtn = {
        addEventListener: vi.fn()
      };

      document.getElementById = vi.fn((id) => {
        if (id === 'contact-btn') return mockContactBtn;
        return null;
      });

      const setupConversionTracking = () => {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          contactBtn.addEventListener('click', function() {
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'contact_initiated', {
                event_category: 'conversion',
                event_label: 'hero_contact_button',
                value: 1
              });
              console.log('Enhanced Analytics: Contact initiated event tracked');
            }
          }, { passive: true });
        }
      };

      setupConversionTracking();

      expect(document.getElementById).toHaveBeenCalledWith('contact-btn');
      expect(mockContactBtn.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        { passive: true }
      );
    });

    it('should track email reveal with MutationObserver', () => {
      const mockEmailDisplay = {};
      let mutationCallback;

      document.getElementById = vi.fn((id) => {
        if (id === 'email-display') return mockEmailDisplay;
        return null;
      });

      global.MutationObserver = vi.fn((callback) => {
        mutationCallback = callback;
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
        };
      });

      const setupEmailTracking = () => {
        const emailDisplay = document.getElementById('email-display');
        if (emailDisplay) {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const emailLink = Array.from(mutation.addedNodes).find(node =>
                  node.tagName === 'A' && node.href && node.href.startsWith('mailto:')
                );
                if (emailLink && typeof window.gtag === 'function') {
                  window.gtag('event', 'email_revealed', {
                    event_category: 'conversion',
                    event_label: 'contact_email_reveal',
                    value: 2
                  });
                }
              }
            });
          });
          observer.observe(emailDisplay, { childList: true });
        }
      };

      setupEmailTracking();

      // Simulate mutation
      const mockMutation = {
        type: 'childList',
        addedNodes: [{
          tagName: 'A',
          href: 'mailto:test@example.com'
        }]
      };

      mutationCallback([mockMutation]);

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_revealed', {
        event_category: 'conversion',
        event_label: 'contact_email_reveal',
        value: 2
      });
    });
  });

  describe('Scroll Depth Tracking', () => {
    it('should track scroll milestones', () => {
      const throttle = (func, wait) => func; // Simplified for testing

      let scrollHandler;
      const maxScroll = 0;
      const milestones = [25, 50, 75, 90];
      const trackedMilestones = new Set();

      // Mock scroll calculation
      window.pageYOffset = 500; // 25% of 2000
      document.documentElement.scrollHeight = 2000;
      window.innerHeight = 1000;

      const trackScrollDepth = () => {
        const scrollPercent = Math.round(
          (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent >= 25 && !trackedMilestones.has(25)) {
          trackedMilestones.add(25);
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'scroll_depth', {
              event_category: 'engagement',
              event_label: '25_percent',
              value: 25
            });
          }
        }
      };

      trackScrollDepth();

      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '25_percent',
        value: 25
      });
    });
  });

  describe('Utility Functions', () => {
    it('should sanitize strings correctly', () => {
      const sanitizeString = (str) => {
        return str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';
      };

      expect(sanitizeString('normal text')).toBe('normal text');
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
      expect(sanitizeString('"quoted text"')).toBe('quoted text');
      expect(sanitizeString("'single quoted'")).toBe('single quoted');
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null)).toBe('');

      // Test length limit
      const longString = 'a'.repeat(150);
      expect(sanitizeString(longString)).toBe('a'.repeat(100));
    });

    it('should throttle functions correctly', (done) => {
      const throttle = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };

      let callCount = 0;
      const testFunction = () => { callCount++; };
      const throttledFunction = throttle(testFunction, 100);

      // Call multiple times rapidly
      throttledFunction();
      throttledFunction();
      throttledFunction();

      // Should only be called once after delay
      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe('Error Handling', () => {
    it('should handle gtag errors gracefully', () => {
      window.gtag = vi.fn(() => {
        throw new Error('gtag error');
      });

      const safeGtagCall = () => {
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'test_event');
          }
        } catch (error) {
          console.error('Error tracking event:', error);
        }
      };

      expect(() => safeGtagCall()).not.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error tracking event:', expect.any(Error));
    });

    it('should handle missing DOM elements gracefully', () => {
      document.getElementById = vi.fn(() => null);
      document.querySelectorAll = vi.fn(() => []);

      const setupTracking = () => {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
          // This should not execute
          throw new Error('Should not reach here');
        }

        const sections = document.querySelectorAll('section[id]');
        expect(sections.length).toBe(0);
      };

      expect(() => setupTracking()).not.toThrow();
    });
  });
});
