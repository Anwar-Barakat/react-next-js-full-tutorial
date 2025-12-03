import { fetchData } from '../dataFetcher';

describe('fetchData', () => {
  it.concurrent('should return data successfully', async () => {
    const data = await fetchData(false, 10); // Short delay for tests
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('name', 'Sample Data');
    expect(data).toHaveProperty('value');
    expect(typeof data.id).toBe('number');
    expect(typeof data.name).toBe('string');
    expect(typeof data.value).toBe('string');
  });

  it.concurrent('should reject with an error when shouldError is true', async () => {
    await expect(fetchData(true, 10)).rejects.toThrow('Failed to fetch data: Network error or server issue.');
  });
});
