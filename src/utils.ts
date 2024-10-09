import * as fs from 'fs';

export function readFromFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

export function writeToFile(filePath:string,data: string): void {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } 
    });
  }