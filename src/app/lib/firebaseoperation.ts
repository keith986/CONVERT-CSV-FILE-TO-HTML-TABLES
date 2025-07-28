import { 
  collection, 
  addDoc, 
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
  const batch = data.map(async (item) => {
    const docData = {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return addDoc(collection(db, COLLECTION_NAME), docData);
  });
  
  await Promise.all(batch);
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
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  }));

  //await Promise.all(querySnapshot)
};

export const deleteDataFromFirebase = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
