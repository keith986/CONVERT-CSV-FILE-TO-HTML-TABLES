import React from 'react';

const datatable = ({ data }) => {

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">No data available. Upload a CSV file to get started.</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key));

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{maxWidth: "1150px", width: "100%"}}>
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Data Table ({data.length} records)</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-white dark:text-white">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default datatable;