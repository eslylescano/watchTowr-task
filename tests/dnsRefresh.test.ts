import axios from 'axios';
import { fetchDNSRecords, loadDNSRecords, saveDNSRecords } from '../src/dnsRefresh';
import * as path from 'path';
import { readFromFile } from '../src/utils';

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

        const records = [
            { hostname: 'example.com', ip: '1.1.1.1' },
            { hostname: 'example.com', ip: '1.2.4.5' },
            { hostname: 'anotherdomain.com', ip: '2.2.2.2' },
        ];

        const dnsRecords = await loadDNSRecords(csvFilePath);
        expect(dnsRecords).toEqual(records);
    });

    test('Should save DNS records to CSV and verify the content', async () => {
        const currentFilePath = __filename;
        const currentDirectory = path.dirname(currentFilePath);
        const csvFileName = 'dnsRecords.csv';
        const csvFilePath = path.join(currentDirectory, csvFileName);
        
        const records = [
            { hostname: 'example.com', ip: '1.1.1.1' },
            { hostname: 'example.com', ip: '1.2.4.5' },
            { hostname: 'anotherdomain.com', ip: '2.2.2.2' },
        ];
    
        await saveDNSRecords(records, csvFilePath);
    
        const fileContent = await readFromFile(csvFilePath);
        const expectedCsvData = 'hostname,ip\nexample.com,1.1.1.1\nexample.com,1.2.4.5\nanotherdomain.com,2.2.2.2';
    
        expect(fileContent.trim()).toBe(expectedCsvData);
    });
});
