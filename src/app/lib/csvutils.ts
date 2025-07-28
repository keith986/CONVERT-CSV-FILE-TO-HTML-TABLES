import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<CsvData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSV parsing failed'));
          return;
        }
        
        const data = results.data as string[][];
        const headers = data[0];
        const rows = data.slice(1);
        
        resolve({ headers, rows });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const convertToObjects = (csvData: CsvData): any[] => {
  return csvData.rows.map(row => {
    const obj: any = {};
    csvData.headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
};