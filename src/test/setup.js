// Test setup file
import { vi } from 'vitest';

// Mock Google Analytics gtag function
global.gtag = vi.fn();
global.dataLayer = [];

// Mock window object for browser APIs
Object.defineProperty(window, 'gtag', {
  value: global.gtag,
  writable: true,
});

Object.defineProperty(window, 'dataLayer', {
  value: global.dataLayer,
  writable: true,
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock MutationObserver
global.MutationObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();

  // Reset dataLayer properly
  global.dataLayer = [];
  window.dataLayer = global.dataLayer;

  // Reset gtag
  global.gtag = vi.fn();
  delete window.gtag;
  window.gtag = global.gtag;
});
