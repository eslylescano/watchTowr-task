import axios from 'axios';
import { readFromFile, writeToFile } from './utils';

export const fetchDNSRecords = async (hostname: string): Promise<string[]> => {
    const response = await axios.get(`https://dns.google.com/resolve?name=${hostname}&type=A`);

    if (response.data.Status !== 0) {
        throw new Error(`Failed to fetch DNS records for ${hostname}: ${response.data.Status}`);
    }

    return response.data.Answer.map((record: { data: string }) => record.data);
};

export const loadDNSRecords = async (filePath: string): Promise<{ hostname: string; ip: string }[]> => {
    try {
        const csvData = await readFromFile(filePath);

        return csvData.split('\n').slice(1).map((line: string) => {
            const [hostname, ip] = line.split(',');
            return { hostname, ip: ip.trim() };
        });
    } catch (error) {
        console.error(`Failed to load DNS records from ${filePath}:`, error);
        throw new Error(`Could not load DNS records from ${filePath}`);
    }
};


export const saveDNSRecords = async (records: { hostname: string; ip: string }[], filePath: string) => {
    const csvData = [
        'hostname,ip',
        ...records.map(record => `${record.hostname},${record.ip}`),
    ].join('\n');

    try {
        await writeToFile(filePath, csvData);
    } catch (error) {
        console.error(`Failed to save DNS records to ${filePath}:`, error);
    }
};


