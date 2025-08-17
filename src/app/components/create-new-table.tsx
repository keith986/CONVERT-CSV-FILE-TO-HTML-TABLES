import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadDataToFirebase } from '../lib/firebaseoperation.ts';

export default function TableCreator() {
  const [numColumns, setNumColumns] = useState('');
  const [headers, setHeaders] = useState([]);

  // Handle column number change to generate header inputs
  const handleColumnsChange = (value) => {
    setNumColumns(value);
    const columnCount = parseInt(value);
    
    if (columnCount > 0) {
      // Create array for headers based on column count
      const newHeaders = Array.from({ length: columnCount }, (_, index) => 
        headers[index] || `Column ${index + 1}`
      );
      setHeaders(newHeaders);
    } else {
      setHeaders([]);
    }
  };

   const generateDummyValue = (header, index) => {
    const headerLower = header.toLowerCase();
    if (headerLower.includes('name')) return `Sample Name ${index}`;
    if (headerLower.includes('email')) return `user${index}@example.com`;
    if (headerLower.includes('phone')) return `+1-555-${String(index).padStart(4, '0')}`;
    if (headerLower.includes('date')) return new Date().toISOString().split('T')[0];
    if (headerLower.includes('price') || headerLower.includes('amount')) return (Math.random() * 1000).toFixed(2);
    return `Sample ${index}`;
  };

// Update specific header
  const updateHeader = (index, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };


  const createTable = async() => {
       // Validate inputs
    if (!numColumns || parseInt(numColumns) <= 0) {
      toast.error('Please enter a valid number of columns',{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      });
      return;
    }
    
    if (headers.some(header => !header.trim())) {
      toast.error('Please fill in all header names',{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      });
      return;
    }

   // Create dummy row with sample data or formulas
    const dummyRow = headers.map((header, index) => generateDummyValue(header, index));
    // Create table data array as objects with headers as keys
    const tableDataArray = [dummyRow].map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    await uploadDataToFirebase(tableDataArray)
    .then(() => {
      toast.success('Successfully created!',{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      });
    })
    .catch((err) => {
      toast.error(err.message,{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      });
    })
    
    // Reset form after successful creation
    resetForm();    
  }

  // Reset form
  const resetForm = () => {
    setNumColumns('');
    setHeaders([]);
  };

  return (
    <div className="space-y-6">
      {/* Table Creator Form */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3" id="imp">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Create table(s) manually
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Fill in the inputs to create a custom table.</p>
          </caption>
          
          <caption className="p-2 text-lg font-semibold text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            No. of column
          </caption>
          <caption className="p-2 text-lg text-center rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            <input 
              type="number" 
              className="w-full border rounded-4xl outline-none text-center p-2" 
              value={numColumns}
              onChange={(e) => handleColumnsChange(e.target.value)}
              min="1"
              placeholder="Enter number of columns"
            />
          </caption>

          {/* Dynamic Header Inputs */}
          {headers.length > 0 && (
            <>
              <caption className="p-2 text-lg font-semibold text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Column Headers 
              </caption>
              <caption className="p-2 text-lg text-center rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
                  {headers.map((header, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Column {index + 1} 
                        </label>
                        <input
                          type="text"
                          className="border rounded-lg outline-none text-center p-2 w-full"
                          value={header}
                          onChange={(e) => updateHeader(index, e.target.value)}
                          placeholder={`Header ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </caption>
            </>
          )}
          
          <caption className="p-5 text-lg text-center w-min-full rtl:text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                className="px-6 py-2 bg-green-600 text-white border-none rounded-full outline-none cursor-pointer hover:bg-green-700 hover:scale-95 transition-all"
                onClick={createTable}
              >
                Create Table
              </button>
              <button 
                type="button" 
                className="px-6 py-2 bg-gray-500 text-white border-none rounded-full outline-none cursor-pointer hover:bg-gray-600 hover:scale-95 transition-all"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </caption>
        </table>
      </div>
    </div>
  );
}

