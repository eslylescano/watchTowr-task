import axios from 'axios';

export const fetchDNSRecords = async (hostname: string): Promise<string[]> => {
    const response = await axios.get(`https://dns.google.com/resolve?name=${hostname}&type=A`);

    if (response.data.Status !== 0) {
        throw new Error(`Failed to fetch DNS records for ${hostname}: ${response.data.Status}`);
    }

    return response.data.Answer.map((record: { data: string }) => record.data);
};
