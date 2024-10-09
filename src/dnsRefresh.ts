import axios from 'axios';

export const fetchDNSRecords = async (hostname: string): Promise<string[]> => {
    const response = await axios.get(`https://dns.google.com/resolve?name=${hostname}&type=A`);
    return response.data.Answer.map((record: { data: string }) => record.data);
  };