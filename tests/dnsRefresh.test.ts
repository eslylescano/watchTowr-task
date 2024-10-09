import axios from 'axios';
import { fetchDNSRecords } from '../src/dnsRefresh';


jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('DNS Refresh Tests', () => {
  test('Should fetch A records for a given hostname from Google DNS', async () => {
    const mockDNSResponse = {
      data: {
        Status: 0,
        Answer: [
          {
            name: 'example.com.',
            type: 1,
            TTL: 2533,
            data: '93.184.215.14',
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockDNSResponse);

    const result = await fetchDNSRecords('example.com');
    expect(result).toEqual(['93.184.215.14']);
  });
});
