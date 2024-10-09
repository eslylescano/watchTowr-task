import axios from 'axios';
import { readFromFile } from './utils';

export const fetchDNSRecords = async (hostname: string): Promise<string[]> => {
    const response = await axios.get(`https://dns.google.com/resolve?name=${hostname}&type=A`);

    if (response.data.Status !== 0) {
        throw new Error(`Failed to fetch DNS records for ${hostname}: ${response.data.Status}`);
    }

    return response.data.Answer.map((record: { data: string }) => record.data);
};

export const loadDNSRecords = async (filePath: string): Promise<{ hostname: string; currentIPs: string[]; }[]> => {
    const csvData = await readFromFile(filePath);

    return csvData.split('\n').slice(1).map((line: { split: (arg0: string) => [any, any]; }) => {
        const [hostname, ip] = line.split(',');
        return { hostname, currentIPs: [ip.trim()] };
    });
};
