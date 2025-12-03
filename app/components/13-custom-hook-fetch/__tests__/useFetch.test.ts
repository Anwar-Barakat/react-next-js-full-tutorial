import { renderHook, waitFor } from '@testing-library/react';
import useFetch from '../components/useFetch';

// Mock the global fetch in jest.setup.ts, so it's already done globally

describe('useFetch', () => {
  const mockUrl = 'https://example.com/data';
  const mockData = { message: 'Success' };
  const mockError = new Error('Failed to fetch');

  beforeEach(() => {
    // Reset mocks before each test
    // global.fetch is mocked globally in jest.setup.ts
    // We can override it here for specific test cases
    jest.spyOn(global, 'fetch').mockClear();
  });

  it.concurrent('should fetch data successfully', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const { result } = renderHook(() => useFetch(mockUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });

  it.concurrent('should handle fetch error', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)
    );

    const { result } = renderHook(() => useFetch(mockUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(new Error('HTTP error! status: 404'));
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });

  it.concurrent('should handle network error', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.reject(mockError));

    const { result } = renderHook(() => useFetch(mockUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });
});
