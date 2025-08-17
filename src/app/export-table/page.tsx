"use client"
import { useState, useEffect } from 'react';
import { fetchDataCollectionFromFirebase, fetchDataFromFirebase } from '../lib/firebaseoperation.ts';

interface TableInfo {
  id: string;
  name: string;
  previewData?: any[];
}

export default function Home() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      await fetchDataCollectionFromFirebase()
      .then((response) => {
      setTables(response);
    }) 
    .catch((error) => {
      console.error('Error fetching tables:', error);
    })
    // Update with your API endpoint
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handlePreviewClick = async (tableId: string) => {
    setLoading(true);
    try {
      const response = await fetchDataFromFirebase(tableId);
      setPreviewData(response.records);
      setSelectedTable(tableId);
    } catch (error) {
      console.error('Error fetching preview:', error);
    }
    setLoading(false);
  };

  const handleDownload = async (format: 'excel' | 'csv') => {
    if (!selectedTable) return;
    
    try {
      const response = await fetch(`/api/tables/${selectedTable}/download?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `table.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <>
    <div className="px-20 flex">
      <div className="w-full mx-6">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3" id="imp">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              Convert your tables into structured Excel / CSV file
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Table Name</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!!tables && tables.map((table) => {
                return (
                <tr key={table.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{table.id}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handlePreviewClick(table.id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
            </table>
        </div>

        {loading && (
          <div className="text-center py-4">Loading preview...</div>
        )}

        {previewData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="overflow-x-auto shadow-md sm:rounded-lg mb-4">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead>
                  {previewData[0] && (
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="px-6 py-3 bg-gray-50 dark:bg-gray-700">{key}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                    {previewData.map((row, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800">
                      {Object.values(row).map((value: any, i) => (
                        <td key={i} className="px-6 py-4">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleDownload('excel')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download Excel
              </button>
              <button
                onClick={() => handleDownload('csv')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download CSV
              </button>
            </div>
          </div>
          )}
      </div>
    </div>
    </>
  );
}
