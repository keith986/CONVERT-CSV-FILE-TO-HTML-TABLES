import { 
  collection, 
  addDoc, 
  getDoc,
  getDocs, 
  doc, 
  deleteDoc,
  updateDoc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase.tsx';

const COLLECTION_NAME = 'csvData';

export const uploadDataToFirebase = async (data: any[]): Promise<void> => {
  // Create a single document with the table name and data array
    const docData = {
      records: data.map(item => ({
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Add the document to Firebase
    await addDoc(collection(db, COLLECTION_NAME), docData);
    
    console.log(`Successfully uploaded ${data.length} records`);

    //await Promise.all(batch);
};

export const fetchDataCollectionFromFirebase = async (): Promise<void> => {
  const q = collection(db, COLLECTION_NAME);
  const qSnapshot = await getDocs(q);
  
   return qSnapshot.docs.map(doc => ({
    id : doc.id
   }));

 await Promise.all(qSnapshot)
};

export const fetchDataFromFirebase = async (id: string): Promise<void> => {
  const q = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(q);
  if (docSnap.exists()) {
  return docSnap.data();
  }
  return;

  await Promise.all(docSnap)
};

export const deleteDataFromFirebase = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateDataInFirebase = async ({dataId, editingData, recordIndex}: {dataId: string,editingData: any,recordIndex: number}): Promise<void> => {
  try{
    
  const docRef = doc(db, COLLECTION_NAME, dataId);
  const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Document does not exist');
    }

  const currentData = docSnap.data();
  const records = currentData.records || [];

  const updatedRecord = {
    ...records[recordIndex],
    ...editingData
  };

  const updatedRecords = [...records];
  updatedRecords[recordIndex] = updatedRecord;

  await updateDoc(docRef, {
    records: updatedRecords
  })

  return {status: "green", message: "Data updated successfully"};

}catch(error){
  console.log(error.message)
}
  await Promise.all(docSnap)
};

export const deleteRowDataFromFirebase = async ({dataId, recordIndex, deletingData} : {dataId: string, recordIndex : number, deletingData : any} ): Promise<void> => {
   try{
    
  const docRef = doc(db, COLLECTION_NAME, dataId);
  const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Document does not exist');
    }

  const currentData = docSnap.data();
  const records = currentData.records || [];

   const updatedRecords = records.filter((_: any, idx: number) => idx !== recordIndex);

    await updateDoc(docRef, {
      records: updatedRecords
    });

  return {status: "green", message: "Data deleted successfully"};

}catch(error){
  console.log(error.message)
}
  await Promise.all(docSnap)
};
