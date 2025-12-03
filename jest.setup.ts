import '@testing-library/jest-dom';
import 'jest-fetch-mock'; // Import jest-fetch-mock
import { cleanup } from '@testing-library/react';

// Before each test, make sure fetch is mocked
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(global, 'fetch').mockImplementation(async () => {
    return Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      // Add other methods that your fetch calls might use
    } as Response);
  });
});

// Optionally, you can reset all mocks after each test
afterEach(() => {
  jest.restoreAllMocks();
});

afterEach(cleanup);
