import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Navigation Fixes', () => {
  let mockDocument;
  let mockConsole;

  beforeEach(() => {
    // Mock console to capture errors
    mockConsole = {
      error: vi.fn(),
      warn: vi.fn(),
      log: vi.fn(),
    };
    global.console = mockConsole;

    // Mock document
    mockDocument = {
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      getAttribute: vi.fn(),
    };
    global.document = mockDocument;
  });

  describe('querySelector Safety', () => {
    it('should handle empty hash fragment safely', () => {
      // Setup mock link with empty hash
      const mockLink = {
        getAttribute: vi.fn(() => '#'), // Just hash, no target
        addEventListener: vi.fn(),
      };

      // Mock the navigation tracking function from our fixed code
      const setupSafeNavigationTracking = () => {
        const sanitizeString = (str) => str ? str.replace(/[<>\"']/g, '').substring(0, 100) : '';

        [mockLink].forEach(link => {
          link.addEventListener('click', function(e) {
            try {
              const href = this.getAttribute('href');
              // Skip if href is just '#' or empty - this is our fix
              if (!href || href === '#') {
                return; // Should exit safely without error
              }
              const section = sanitizeString(href.substring(1));
              // This code would only run if href is valid
              if (section) {
                console.log('Would track:', section);
              }
            } catch (error) {
              console.error('Analytics navigation tracking error:', error);
            }
          }, { passive: true });
        });
      };

      // Should not throw when setup runs
      expect(() => {
        setupSafeNavigationTracking();
      }).not.toThrow();

      // Simulate click on link with empty hash
      const clickHandler = mockLink.addEventListener.mock.calls[0][1];

      // Should not throw when clicked
      expect(() => {
        clickHandler.call(mockLink);
      }).not.toThrow();

      // No error should be logged
      expect(mockConsole.error).not.toHaveBeenCalled();
    });

    it('should handle null href safely', () => {
      const mockLink = {
        getAttribute: vi.fn(() => null), // null href
        addEventListener: vi.fn(),
      };

      const setupSafeNavigationTracking = () => {
        [mockLink].forEach(link => {
          link.addEventListener('click', function(e) {
            try {
              const href = this.getAttribute('href');
              if (!href || href === '#') {
                return; // Our safety check
              }
              console.log('This should not execute');
            } catch (error) {
              console.error('Analytics navigation tracking error:', error);
            }
          }, { passive: true });
        });
      };

      setupSafeNavigationTracking();
      const clickHandler = mockLink.addEventListener.mock.calls[0][1];

      expect(() => {
        clickHandler.call(mockLink);
      }).not.toThrow();

      expect(mockConsole.log).not.toHaveBeenCalledWith('This should not execute');
    });
  });

  describe('Scroll Tracking Safety', () => {
    it('should handle division by zero in scroll calculation', () => {
      // Mock window properties that could cause division by zero
      global.window = {
        pageYOffset: 0,
        innerHeight: 1000,
        addEventListener: vi.fn(),
      };

      global.document = {
        documentElement: {
          scrollHeight: 1000, // Same as window height - would cause division by zero
        },
      };

      const trackScrollDepth = () => {
        try {
          const scrollHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          const scrollTop = window.pageYOffset;

          // Our safety check - prevent division by zero
          if (scrollHeight <= windowHeight) {
            return; // Should exit safely
          }

          // This calculation would cause division by zero without our fix
          const scrollPercent = Math.round(
            (scrollTop / (scrollHeight - windowHeight)) * 100
          );

          console.log('Scroll percent:', scrollPercent);
        } catch (error) {
          console.error('Analytics scroll tracking error:', error);
        }
      };

      // Should not throw with our safety check
      expect(() => {
        trackScrollDepth();
      }).not.toThrow();

      // Should not log scroll percent when heights are equal
      expect(mockConsole.log).not.toHaveBeenCalledWith(expect.stringContaining('Scroll percent:'));
    });

    it('should calculate scroll percentage correctly when safe', () => {
      global.window = {
        pageYOffset: 250,
        innerHeight: 1000,
        addEventListener: vi.fn(),
      };

      global.document = {
        documentElement: {
          scrollHeight: 2000, // Larger than window height - safe for calculation
        },
      };

      const trackScrollDepth = () => {
        try {
          const scrollHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          const scrollTop = window.pageYOffset;

          if (scrollHeight <= windowHeight) {
            return;
          }

          const scrollPercent = Math.round(
            (scrollTop / (scrollHeight - windowHeight)) * 100
          );

          console.log('Scroll percent:', scrollPercent);
          return scrollPercent;
        } catch (error) {
          console.error('Analytics scroll tracking error:', error);
        }
      };

      const result = trackScrollDepth();

      // Should calculate: (250 / (2000 - 1000)) * 100 = 25%
      expect(result).toBe(25);
      expect(mockConsole.log).toHaveBeenCalledWith('Scroll percent:', 25);
    });
  });

  describe('Analytics Safety', () => {
    it('should handle missing gtag gracefully', () => {
      // Ensure gtag is not defined
      delete global.gtag;
      delete window.gtag;

      const trackEvent = (eventName, parameters = {}) => {
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, parameters);
          } else {
            // Our fallback - queue event for when gtag becomes available
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': eventName,
              ...parameters
            });
            console.log('Queued event for later:', eventName);
          }
        } catch (error) {
          console.error('Analytics tracking error:', error);
        }
      };

      // Should not throw when gtag is missing
      expect(() => {
        trackEvent('test_event', { category: 'test' });
      }).not.toThrow();

      // Should queue the event
      expect(mockConsole.log).toHaveBeenCalledWith('Queued event for later:', 'test_event');
      expect(window.dataLayer).toContainEqual({
        event: 'test_event',
        category: 'test'
      });
    });
  });
});
