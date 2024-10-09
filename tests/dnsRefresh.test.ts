import axios from 'axios';
import { fetchDNSRecords, loadDNSRecords } from '../src/dnsRefresh';
import * as path from 'path';

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

    test('Should throw an error for an invalid hostname', async () => {
        const mockDNSResponse = {
            data: {
                Status: 3,
                TC: false,
                RD: true,
                RA: true,
                AD: true,
                CD: false,
                Question: [
                    {
                        name: 'invalid.example.com.',
                        type: 1,
                    },
                ],
                Authority: [
                    {
                        name: 'example.com.',
                        type: 6,
                        TTL: 1800,
                        data: 'ns.icann.org. noc.dns.icann.org. 2024081432 7200 3600 1209600 3600',
                    },
                ],
                Comment: 'Response from 2001:500:8f::53.',
            },
        };

        mockedAxios.get.mockResolvedValue(mockDNSResponse);

        await expect(fetchDNSRecords('invalid.example.com')).rejects.toThrow(
            'Failed to fetch DNS records for invalid.example.com: 3'
        );
    });


    test('Should load DNS records from CSV', async() => {
        const currentFilePath = __filename;
        const currentDirectory = path.dirname(currentFilePath);

        const csvFileName = 'dnsRecords.csv';

        const csvFilePath = path.join(currentDirectory, csvFileName);
        const dnsRecords = await loadDNSRecords(csvFilePath);
        expect(dnsRecords).toEqual([{ hostname: 'example.com', currentIPs: ['1.1.1.1'] }]);
    });
});
