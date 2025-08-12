import axios from 'axios';
import { fetchPacks } from '../lib/api';

jest.mock('axios');

describe('web api client', () => {
  it('fetchPacks calls /packs', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const mockGet = jest.fn().mockResolvedValue({ data: [] });
    // @ts-ignore - axios.create mocked shape
    mockedAxios.create.mockReturnValue({ get: mockGet });

    const res = await fetchPacks();
    expect(res).toEqual([]);
    expect(mockGet).toHaveBeenCalledWith('/packs');
  });
});
