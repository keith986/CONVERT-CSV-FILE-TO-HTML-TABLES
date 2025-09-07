import React, {useState} from 'react';
import { updateDataInFirebase, deleteRowDataFromFirebase, deleteDataFromFirebase, deleteTable } from '../lib/firebaseoperation';
import { toast } from 'react-toastify';

interface DataTableProps {
  data: any[]; 
  onRefresh? : () => void;
}


const datatable = ({ data, onRefresh}: DataTableProps) => {
const [editingId, setEditingId] = useState<string | null>(null);
const [editingData, setEditingData] = useState<any>({});
const [isAddingRow, setIsAddingRow] = useState(false);
const [newRowData, setNewRowData] = useState<any>({});
const dataId = data.id;
//pagination
const [currentPage, setCurrentPage] = useState(1)
// Drag state
const [draggedColumn, setDraggedColumn] = useState(null);
const [dragOverColumn, setDragOverColumn] = useState(null);

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">No data available. Upload a CSV file to get started.</p>
      </div>
    );
  }

  if(data.records === null || data.records === [] || data.records.length === 0){
    const id = dataId;
    deleteDataFromFirebase(id);
    window.location.reload()
  }
  
const headers = Object.keys(data.records[0]).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key));
const [columnOrder, setColumnOrder] = useState(Object.keys(data.records[0]).filter(key => !['id', 'createdAt', 'updatedAt'].includes(key)));

  if(headers.length === 0){
    const id = dataId;
    deleteDataFromFirebase(id);
    window.location.reload()
  }

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

  const handleDeleteTable = async () => {
    if (!confirm('Are you sure you want to delete table?')) return; 
      await deleteTable({dataId: dataId})
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
        window.location.reload();
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
  }

  const rowPage = 10;
  const lastIndex = rowPage * currentPage;
  const firstIndex = lastIndex - rowPage;
  const tbl_records = data.records.slice(firstIndex , lastIndex);
  const nPage = Math.ceil(data.records.length / rowPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1)

  function handlePage (id) {
   setCurrentPage(id)
  }

  // Add after other handler functions
const handleAddRow = () => {
  setIsAddingRow(true);
  const emptyRow = {};
  headers.forEach(header => {
    emptyRow[header] = '';
  });
  setNewRowData(emptyRow);
};

const handleSaveNewRow = async () => {
  // Assuming you'll add a new Firebase function to handle this
  await updateDataInFirebase({
    dataId: dataId,
    editingData: newRowData,
    recordIndex: data.records.length // Add to end of records
  })
  .then(res => {
    if(res.status === "green"){
      toast.success("Row added successfully!");
      setIsAddingRow(false);
      setNewRowData({});
      onRefresh?.();
    }
  })
  .catch(err => {
    toast.error("Failed to add row: " + err.message);
  });
};

  // Handle drag start
  const handleDragStart = (e, columnKey) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  // Handle drag over
  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnKey);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  // Handle drop
  const handleDrop = (e, targetColumnKey) => {
    e.preventDefault();
    
    if (draggedColumn && draggedColumn !== targetColumnKey) {
      const newColumnOrder = [...columnOrder];
      const draggedIndex = newColumnOrder.indexOf(draggedColumn);
      const targetIndex = newColumnOrder.indexOf(targetColumnKey);
      
      // Remove dragged column from its current position
      newColumnOrder.splice(draggedIndex, 1);
      // Insert it at the target position
      newColumnOrder.splice(targetIndex, 0, draggedColumn);
      
      setColumnOrder(newColumnOrder);
    }
    
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Add this after your other state declarations
const [showDeleteColumn, setShowDeleteColumn] = useState<string | null>(null);

// Add this with your other handler functions
const handleDeleteColumn = async (columnName: string) => {
  if (!confirm(`Are you sure you want to delete column "${columnName}"?`)) return;

  // Remove column from column order
  const newColumnOrder = columnOrder.filter(col => col !== columnName);
  setColumnOrder(newColumnOrder);

  // Remove column data from all records
  const updatedRecords = data.records.map(record => {
    const newRecord = {...record};
    delete newRecord[columnName];
    return newRecord;
  });

  // Update the data in Firebase
  await updateDataInFirebase({
    dataId: dataId,
    editingData: updatedRecords,
    recordIndex: -1 // Use -1 to indicate whole table update
  })
  .then(res => {
    if(res.status === "green") {
      toast.success(res.message);
      onRefresh?.();
    } else {
      toast.error("Could not delete column. Try again later.");
    }
  })
  .catch(err => {
    toast.error(err.message);
  });
  };

  // Function to check if a value is an array or object
const isArrayOrObject = (value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return (trimmed.startsWith('[') && trimmed.endsWith(']')) || 
           (trimmed.startsWith('{') && trimmed.endsWith('}'));
  }
  return Array.isArray(value) || (typeof value === 'object' && value !== null);
};

// Function to parse string representation of arrays/objects
const parseValue = (value) => {
  if (typeof value === 'string') {
    try {
      // Handle empty objects/arrays
      if (value.trim() === '{}' || value.trim() === '[]') {
        return JSON.parse(value.trim());
      }
      
      // Try to parse as JSON first
      return JSON.parse(value);
    } catch (e) {
      // If JSON parsing fails, try to evaluate as JavaScript (be careful with this in production)
      try {
        return eval(`(${value})`);
      } catch (evalError) {
        return value; // Return original if parsing fails
      }
    }
  }
  return value;
};

// Dropdown component for arrays/objects
const ArrayObjectDropdown = ({ value, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const parsedValue = parseValue(value);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleItemClick = (item, key, type) => {
    onItemClick(item, key, type);
    setIsOpen(false); // Close dropdown after selection
  };

  if (Array.isArray(parsedValue)) {
    const displayText = parsedValue.length === 0 ? 'Empty' : `View`;
    
    return (
      <div className="relative inline-block">
        <button
          onClick={toggleDropdown}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          {displayText}
          <svg 
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && parsedValue.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
            {parsedValue.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item, index, 'array')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium text-blue-600">{key}:</span>{' '}
                <span className="text-gray-700">
                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              </button>
            ))}
          </div>
        )}
        
        {isOpen && parsedValue.length === 0 && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="px-3 py-2 text-xs text-gray-500">No items</div>
          </div>
        )}
      </div>
    );
  } 
  
  else if (typeof parsedValue === 'object' && parsedValue !== null) {
    const entries = Object.entries(parsedValue);
    const displayText = entries.length === 0 ? 'Empty' : `View`;
    
    return (
      <div className="relative inline-block">
        <button
          onClick={toggleDropdown}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors flex items-center gap-1"
        >
          {displayText}
          <svg 
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && entries.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
            {entries.map(([key, val], index) => (
              <button
                key={index}
                onClick={() => handleItemClick(val, key, 'object')}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium text-green-600">{key}:</span>{' '}
                <span className="text-gray-700">
                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              </button>
            ))}
          </div>
        )}
        
        {isOpen && entries.length === 0 && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="px-3 py-2 text-xs text-gray-500">No properties</div>
          </div>
        )}
      </div>
    );
  }
  
  return value; // Return original value if not array/object
};

// Function to render array/object as dropdown
const renderAsDropdown = (value, onItemClick) => {
  return <ArrayObjectDropdown value={value} onItemClick={onItemClick} />;
};

// Modified table cell renderer
const renderCell = (value, header, row, editingId, editingData, setEditingData, onDropdownItemClick) => {
  if (isArrayOrObject(value)) {
    return renderAsDropdown(value, onDropdownItemClick);
  }
  
  // For editing functionality
  if (editingId === row.id) {
    return (
      <input
        type="text"
        value={editingData[header] || ''}
        onChange={(e) => setEditingData({
          ...editingData,
          [header]: e.target.value
        })}
        className="w-full px-2 py-1 border rounded"
      />
    );
  }
  
  return value;
};


  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" id="ttbl">
      {/*
      style={{maxWidth: "1150px", width: "100%"}}
      */}

<div className="px-6 py-4 flex justify-between items-center">
  <h2 className="text-xl font-semibold">Data Table ({data.records.length} records)</h2>
  <div>
  <button 
    onClick={handleAddRow}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-3 cursor-pointer rounded"
  >
    Add Row
  </button>
  <button 
    onClick={handleDeleteTable}
    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-3 rounded cursor-pointer"
  >
    Delete Table
  </button>
  </div>
</div>

<div className="w-full">
{isAddingRow && (
  <tr className="bg-transparent w-full">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">New</td>
    {headers.map((header) => (
      <td key={header} className="px-6 py-4 whitespace-nowrap text-sm">
        <input
          type="text"
          value={newRowData[header] || ''}
          onChange={(e) => setNewRowData({
            ...newRowData,
            [header]: e.target.value
          })}
          className="w-full px-2 py-1 border rounded"
        />
      </td>
    ))}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="space-x-2">
        <button
          onClick={handleSaveNewRow}
          className="text-green-600 hover:text-green-900 cursor-pointer"
        >
          Save
        </button>
        <button
          onClick={() => {
            setIsAddingRow(false);
            setNewRowData({});
          }}
          className="text-red-600 hover:text-red-900 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </td>
  </tr>
)}
</div>
      <div className="overflow-x-auto max-h-100" id="thee_tbl">
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Id</th>
              {columnOrder.map((header) => (
                <th
                  key={header}
                  draggable
                  onDragStart={(e) => handleDragStart(e, header)}
                  onDragOver={(e) => handleDragOver(e, header)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, header)}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={() => setShowDeleteColumn(header)}
                  onMouseLeave={() => setShowDeleteColumn(null)}
                  className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-all-scroll
                  ${draggedColumn === header ? 'opacity-50 bg-blue-100' : ''}
                  ${dragOverColumn === header && draggedColumn !== header ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  `}
                >
                  <span className="mx-2">⋮⋮</span>
                  {header}
                  {showDeleteColumn === header && (
                  <button
                  onClick={() => handleDeleteColumn(header)}
                  className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete column"
                  >
                  <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5v14m-6-8h6m-6 4h6m4.506-1.494L15.012 12m0 0 1.506-1.506M15.012 12l1.506 1.506M15.012 12l-1.506-1.506M20 19H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1Z"/>
                  </svg>
                  </button>
                  )}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr> 
          </thead>
          <tbody className="overflow-auto">
            {tbl_records.map((row, indx) => (
              <tr key={indx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-100">{indx + 1}</td>
                {columnOrder.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-100">
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
                    ):(
                  renderCell(
                  row[header], 
                  header, 
                  row, 
                  editingId, 
                  editingData, 
                  setEditingData
                )
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

      <div className='text-white flex w-full overflow-auto mt-3'>
      <nav className='flex'>
        <ul className='flex max-w-100'>

          {!!numbers && numbers.map((n, i) => {
            return (
              <li key={i}>
                  <button className={`${currentPage === n ? 'bg-red-600 text-white' : 'bg-white'} m-1 px-1 text-gray-800 dark:text-gray-800 rounded cursor-pointer hover:scale-85`} onClick={() => handlePage(n)}>{n}</button>
                </li>
                   );
          })}

        </ul>
      </nav> 
        </div>

    </div>
  );
};

export default datatable;