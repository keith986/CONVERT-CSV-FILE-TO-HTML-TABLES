import { 
  collection, 
  addDoc, 
  getDoc,
  getDocs, 
  doc, 
  deleteDoc,
  query,
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
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const qSnapshot = await getDocs(q);
  
  return qSnapshot.docs.map(doc => ({
    id: doc.id
  }));

  await Promise.all(qSnapshot)
};

export const fetchDataFromFirebase = async (id: string): Promise<void> => {
  console.log(id)
  const q = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(q);
  if (docSnap.exists()) {
  return docSnap.data();
  }
  return;

  //await Promise.all(querySnapshot)
};

export const deleteDataFromFirebase = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
