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
  //pagination
  const [currentPage, setCurrentPage] = useState(1)

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
    try {
      // Get the specific table element with id "table-prnt"
      const tableElement = document.getElementById('table-prnt');
      
      if (!tableElement) {
      console.error('Table not found');
      return;
      }

      // Extract table data from the displayed table
      const rows = tableElement.querySelectorAll('tr');
      const tableData = [];
    
      rows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      const rowData = Array.from(cells).map(cell => cell.textContent.trim());
      tableData.push(rowData);
      });

      // Convert to the requested format
      let content, mimeType, fileExtension;

      if (format === 'csv') {
      content = tableData.map(row => 
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      mimeType = 'text/csv';
      fileExtension = 'csv';
      } else if (format === 'excel') {
      // For Excel, we'll use CSV format with Excel mime type
      content = tableData.map(row => 
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      mimeType = 'application/vnd.ms-excel';
      fileExtension = 'csv'; // or 'xls' if you prefer
      }

      // Create and download the file
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const rowPerPage = 5;
  const lastIndex = rowPerPage * currentPage;
  const firstIndex = lastIndex - rowPerPage;
  const records = tables.slice(firstIndex, lastIndex)
  const nPage = Math.ceil(tables.length / rowPerPage)
  const numbers = [...Array(nPage + 1).keys()].slice(1)

function handlePage (id) {
   setCurrentPage(id)
}

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
                <th scope="col" className="px-6 py-3">No.</th>
                <th scope="col" className="px-6 py-3">Table Name</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!!records && records.map((table,index) => {
                return (
                <tr key={table.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{index + 1}.</td>
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

             <div className='row text-white flex  w-full overflow-auto mt-3'>
      <nav className='flex'>
        <ul className='flex max-w-100'>

          {!!numbers && numbers.map((n, i) => {
            return (
              <li key={i}>
                  <button className={`${currentPage === n ? 'bg-red-600 text-white' : 'bg-white'} mx-1 px-1 text-gray-800 dark:text-gray-800 rounded cursor-pointer hover:scale-85`} onClick={() => handlePage(n)}>{n}</button>
                </li>
                   );
          })}

        </ul>
      </nav> 
        </div>

        </div>

        {loading && (
          <div className="text-center py-4">Loading preview...</div>
        )}

        {previewData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="overflow-x-auto shadow-md sm:rounded-lg mb-4 max-h-100">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" id='table-prnt'>
                <thead>
                  {previewData[0] && (
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700">No.</th>
                      {Object.keys(previewData[0]).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key)).map((key) => (
                        <th key={key} className="px-6 py-3 bg-gray-50 dark:bg-gray-700">{key}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                    {previewData.map((row, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800">
                      <td className="px-6 py-4">{index + 1}</td>
                      {Object.keys(row)
                        .filter(key => !['id', 'createdAt', 'updatedAt'].includes(key))
                        .map((key) => (
                          <td key={key} className="px-6 py-4">{String(row[key])}</td>
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
