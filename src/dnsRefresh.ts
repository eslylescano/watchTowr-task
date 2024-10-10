import axios from 'axios';
import { readFromFile, writeToFile } from './utils';

export const fetchDNSRecords = async (hostname: string): Promise<string[]> => {
    const response = await axios.get(`https://dns.google.com/resolve?name=${hostname}&type=A`);

    if (response.data.Status !== 0) {
        throw new Error(`Failed to fetch DNS records for ${hostname}: ${response.data.Status}`);
    }

    return response.data.Answer.map((record: { data: string }) => record.data);
};

export const loadDNSRecords = async (filePath: string): Promise<{ hostname: string; ip: string; status:string }[]> => {
    try {
        const csvData = await readFromFile(filePath);

        return csvData.split('\n').slice(1).map((line: string) => {
            const [hostname, ip, status] = line.split(',');
            return { hostname, ip, status };
        });
    } catch (error) {
        console.error(`Failed to load DNS records from ${filePath}:`, error);
        throw new Error(`Could not load DNS records from ${filePath}`);
    }
};


export const saveDNSRecords = async (records: { hostname: string; ip: string,status:string }[], filePath: string) => {
    const csvData = [
        'hostname,ip,status',
        ...records.map(record => `${record.hostname},${record.ip},${record.status}`),
    ].join('\n');

    try {
        await writeToFile(filePath, csvData);
    } catch (error) {
        console.error(`Failed to save DNS records to ${filePath}:`, error);
    }
};


export const updateDNSRecords = (
    records: { hostname: string; ip: string; status: string }[],
    newRecord: { hostname: string; ip: string }
) => {
    const { hostname, ip } = newRecord;

    const existingIP = records.find(record => record.hostname === hostname && record.ip === ip);

    if (existingIP) {
        return records;
    }

    const updatedRecords = records.map(record => {
        if (record.hostname === hostname) {
            return { ...record, status: 'hanging' };
        }
        return record;
    });

    updatedRecords.push({ hostname, ip, status: 'active' });

    return updatedRecords;
};


