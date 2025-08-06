"use client"
import { useState, useEffect } from 'react';
import { parseCSV, convertToObjects } from './lib/csvutils.ts';
import { uploadDataToFirebase, fetchDataCollectionFromFirebase, fetchDataFromFirebase, deleteDataFromFirebase } from './lib/firebaseoperation.ts';
import { toast } from 'react-toastify';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.tsx';
import Link from "next/link"
import DataTable from './components/datatable';
import Createnewtable from './components/create-new-table'
import $ from 'jquery'

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [isCollection, setIsCollection] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [isTable, setIsTable] = useState([]);

  const fetchDataFirebase = async () => {
    await fetchDataCollectionFromFirebase()
    .then((response) => {
      setIsCollection(response);
    })
    .catch((err) => {console.error('Could not fetch your table(s)' + err.message)})
  }
    
  useEffect( () => {
    fetchDataFirebase()
  }, [isCollection])

  const loadData = async (ev) => {  
    $('#tbl').show('1000');
    $('#imp').hide('1000');
    $('#c-n-t').hide('1000');
    try {
      setIsLoading(true);
      setIsTable(ev.target.id);
      const fetchedData = await fetchDataFromFirebase(ev.target.id);
      setData({records : fetchedData.records, id : ev.target.id});
    } catch (error) {
      console.error('Failed to load data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDelete = async(ev) => {
    await deleteDoc(doc(db , "csvData", ev.target.id));
    window.location.reload();
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return; 
    try {
      if(file.type === 'text/csv'){
      const csvData = await parseCSV(file);
      const objects = convertToObjects(csvData);
      await uploadDataToFirebase(objects);
      setTimeout(()=>{
        setIsUploading(true);
        event.target.value = '';
      },1000)
      }else{
      event.target.value = '';
      toast.error('Upload failed. Please check your CSV format.',{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      });  
      } 
      //Reset file input
    }catch(error){
      toast.error('Upload failed:' + error.message,{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false, 
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
      })
    }finally{
      setIsUploading(false);
    }
  };

  const toggleDrop = () => {
    $('#tbl').hide('1000')
    $('#imp').show('1000')
    $('#c-n-t').hide('1000')
  }

  const toggleDrop2 = () => {
    $('#tbl').hide('1000')
    $('#c-n-t').show('1000')
    $('#imp').hide('1000')
  }

  const refreshing = async () => {
    const fetchedData = await fetchDataFromFirebase(isTable.toString());
    if(fetchedData.records === [] || fetchedData.records.length === 0){
      const id = isTable.toString();
      await deleteDataFromFirebase(id);
      window.location.reload();
    }else{
    setData({records : fetchedData.records, id : isTable.toString()});
    }
  }

  return (
    <>
    <div className="px-20 flex">
      <div>
   <aside id="sidebar-multi-level-sidebar" className="relative z-40 w-64 h-100 h-max-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div className="h-full px-3 py-4 overflow-y-auto backdrop-blur-sm bg-white/30 dark:bg-gray-800 rounded-lg">
      <ul className="space-y-2 font-medium">
         <li onClick={toggleDrop2}>
            <a href="#" className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-800 group">
               <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v3c0 .5523.44772 1 1 1h10.5M3 15v-4m0 4h11M3 11V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v5M3 11h18m0 0v1M8 11v8m4-8v8m4-8v2m1 4h2m0 0h2m-2 0v2m0-2v-2"/> 
               </svg>
               <span className="ms-3">Create new table</span>
            </a>
         </li>
         <li onClick={toggleDrop}>
            <a href="#" className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-800 group">
               <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Import table</span>
            </a>
         </li>
         <li className="w-full mt-6">
           <span className="w-full flex items-center justify-center whitespace-nowrap">My Tables</span>
         </li>
         {!!isCollection && isCollection.map((col, _id) => {
          return (
         <li key={_id} id={col.id} onClick={loadData} className={isTable === col.id ? "bg-gray-100 dark:bg-gray-700 rounded-lg" : ""}>
            <Link href="#" id={col.id} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group z-10">
               <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
               <path stroke="currentColor" strokeWidth="2" d="M3 11h18M3 15h18M8 10.792V19m4-8.208V19m4-8.208V19M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap text-sm overflow-hidden text-ellipsis" id={col.id}>Table {1 + _id}</span>
               <svg className="w-5 h-5 text-gray-300 dark:text-gray-800 hover:text-red-800 z-100" id={col.id} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" onClick={handleFileDelete}> 
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
               </svg>
            </Link>
         </li>
          );
         }
        )}
      </ul>
   </div>
   </aside>
      </div>
      <div className="w-full mx-6">
<div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3 hidden" id="imp">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Transform CSV data into structured tables with ease
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">From chaos to clarity: Convert CSV to interactive tables.Your CSV data, now in organized table format.</p>
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Turn your CSV data into powerful, table-based insights.</p>
        </caption>
    </table>

    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">       
<div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
      
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">.CSV file only</p>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
            />
        </div>
        
    </label>
</div> 
<p className="mt-3 float-right text-sm font-normal text-green-500 dark:text-green-400">{isUploading && ( "successfully uploaded")}</p>
</caption>
    </table>
    
</div>     
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg' id="tbl" style={{maxWidth: "1150px", width: "100%"}}>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading data...</span>
              </div>
            ) : (
              <div id="ref">
              <DataTable data={data} onRefresh={refreshing}/>
              </div>
            )}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3 hidden" id="c-n-t">
      <Createnewtable />
      </div> 

      </div>

    </div>
    </>
  );
}
