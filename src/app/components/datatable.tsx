import React, {useState} from 'react';
import { updateDataInFirebase, deleteRowDataFromFirebase } from '../lib/firebaseoperation';
import { toast } from 'react-toastify';

interface DataTableProps {
  data: any[]; 
  onRefresh? : () => void;
}

const datatable = ({ data, onRefresh}) => {
const [editingId, setEditingId] = useState<string | null>(null);
const [editingData, setEditingData] = useState<any>({});
const dataId = data.id

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">No data available. Upload a CSV file to get started.</p>
      </div>
    );
  }

  const headers = Object.keys(data.records[0]).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key));

  const handleEdit = (row, indx) => {
    setEditingId(row);
    const rowData: any = {};
    headers.forEach(header => {
      rowData[header] = row[header];
    });
    setEditingData(rowData, indx);
  };

  const handleSave = async (event) => {
    if (!editingId) return;
    const recordIndex = event.target.id;
    await updateDataInFirebase({
      dataId: dataId,
      editingData: editingData,
      recordIndex: recordIndex
    })
    .then(res => {
      if(res.status === "green"){
      toast.success(res.message,{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      })
        setEditingId(null);
        setEditingData({});
        onRefresh?.()
      }else{
      toast.error("Could not update! Try again later.",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      })
      }
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
      })
    })
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleDelete = async (indx, row) => {
    if (!confirm('Are you sure you want to delete this row?')) return; 
      await deleteRowDataFromFirebase({dataId: dataId, recordIndex : indx, deletingData: row})
      .then(res => {
      if(res.status === "green"){
      toast.success(res.message,{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      })
        setEditingId(null);
        setEditingData({});
        onRefresh?.()
      }else{
      toast.error("Could not update! Try again later.",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      })
      }
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
      })
      })   
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" id="ttbl" style={{maxWidth: "1150px", width: "100%"}}>
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Data Table ({data.records.length} records)</h2>
      </div>
      
      <div className="overflow-x-auto max-h-100" id="thee_tbl">
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {data.records.map((row, indx) => (
              <tr key={indx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-800">{indx + 1}</td>
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-800">
                     {editingId === row ? (
                      <input
                        type="text"
                        value={editingData[header] || ''}
                        onChange={(e) => setEditingData({
                          ...editingData,
                          [header]: e.target.value
                        })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      row[header]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === row ? (
                    <div className="space-x-2">
                      <button
                        id={indx}
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900 cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(row, indx)}
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(indx, row)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default datatable;