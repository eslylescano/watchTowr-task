# DNS Refresh App

This project is a TypeScript-based utility that performs a DNS refresh for a given hostname. It fetches DNS A records (IP addresses) for a domain, updates a local CSV file with the current records, and tracks the status of each IP (whether it is still `active` or now `hanging`).

## Features

- **Fetch DNS Records**: Queries Google DNS for the current A records of a given domain.
- **Update DNS Records**: Adds new IPs to the CSV file as `active` and marks any previously existing IPs for the same hostname as `hanging`.
- **CSV Record Management**: Loads DNS records from a CSV file and saves updates back to the file. The CSV file will be created automatically if it does not exist.
- **Command-Line Argument Support**: Allows the user to specify the domain to check as a command-line argument.


## Running the App

### Prerequisites

1. Install `ts-node` globally:

   ```bash
   npm install -g ts-node
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

### Running the Script

To run the DNS refresh script, use `ts-node` with the following command:

```bash
ts-node src/index.ts <hostname>
```

For example:

```bash
ts-node src/index.ts example.com
```

### Expected Behavior

- The app fetches the current DNS records for `example.com`.
- If the `dnsRecords.csv` file does not exist, it will be created.
- DNS records for `example.com` are updated in the CSV file:
  - Existing IPs are marked as `hanging`.
  - New IPs are added as `active`.

### Example CSV Output

The CSV file (`dnsRecords.csv`) will contain entries like this:

```csv
hostname,ip,status
example.com,1.1.1.1,hanging
example.com,1.1.1.2,active
```

## Testing

To run the test suite:

```bash
npm run test
```

The tests cover various scenarios, such as:

- Fetching DNS records for a valid hostname.
- Handling invalid hostnames.
- Loading and saving records from/to CSV.
- Updating records when a new IP is added.

### Conclusion

In this project, we've implemented a DNS refresh tool using TypeScript that reads and updates DNS records from a CSV file. While this approach works for smaller data sets and simpler use cases, for scenarios requiring more complex querying or efficient data retrieval, moving to a database would be ideal.

Here are the storage alternatives to CSV:

1. **Relational Databases (SQL)** like **PostgreSQL** or **MySQL** would be suitable for structured data and complex queries. These databases allow you to define relationships and efficiently search, filter, and update records.
   
2. **NoSQL Databases** such as **MongoDB** offer flexibility in schema and are ideal when the data structure may evolve over time. They also support fast reads and writes for larger data sets.

3. **Key-Value Stores** like **Redis** or **DynamoDB** are excellent for simple lookups where querying by a unique key (like a hostname or IP) is needed, offering high performance and low-latency access.

Choosing the right database depends on the application's scale and querying needs, but these databases will offer better performance, scalability, and flexibility than CSV as the project grows.