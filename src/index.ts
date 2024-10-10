import { fetchDNSRecords, loadDNSRecords, saveDNSRecords, updateDNSRecords } from "./dnsRefresh";
import * as path from 'path';

const runDNSRefresh = async (url: string) => {
    const csvFilePath = path.join(__dirname, 'dnsRecords.csv');

    const dnsRecords = await loadDNSRecords(csvFilePath);
    const ip = await fetchDNSRecords(url);
    let newRecord = { hostname: url, ip };

    let updatedRecords = updateDNSRecords(dnsRecords, newRecord);
    await saveDNSRecords(updatedRecords, csvFilePath);
};

const [,, url] = process.argv;

if (!url) {
    console.error('Please provide a URL as an argument.');
    process.exit(1);
}

runDNSRefresh(url).catch(err => console.error('Error running DNS refresh:', err));
