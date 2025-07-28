export interface DataRow {
  id: string;
  [key: string]: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CsvData {
  headers: string[];
  rows: any[][];
}