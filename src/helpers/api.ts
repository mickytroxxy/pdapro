import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where, updateDoc, GeoPoint, orderBy, limit, deleteDoc, onSnapshot, Timestamp, FirestoreError, startAfter, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeFirestore } from 'firebase/firestore'
import { geohashForLocation, geohashQueryBounds,Geohash} from 'geofire-common';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// @ts-ignore
import geohash from "ngeohash";
import axios from "axios";
import { showToast } from "./methods";
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyBtkgz6FSmZQxgDAyUltQQ_YtG9JgD_4VM",
  authDomain: "playmyjam-5edf2.firebaseapp.com",
  projectId: "playmyjam-5edf2",
  storageBucket: "playmyjam-5edf2.firebasestorage.app",
  messagingSenderId: "222000269743",
  appId: "1:222000269743:web:ef180161121b3fc945475a"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true })
const auth = getAuth(app);
export const getGeoPoint = (latitude: number, longitude: number) => geohashForLocation([latitude, longitude]);

export const createData = async (tableName: string, docId: string, data: any): Promise<boolean> => {
  try {
    await setDoc(doc(db, tableName, docId), data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const loginApi = async (phoneNumber: string, password: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber), where("password", "==", password), where("deleted", "==", false)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getSecretKeys = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "secrets")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getDataList = async (cb:(...args:any)=> void) => {
  try {
      const querySnapshot = await getDocs(query(collection(db, "dataList")));
      const data = querySnapshot.docs.map(doc => doc.data());
      cb(data)
  } catch (e) {
      cb(e);
  }
}
export const updateData = async (tableName: string, docId: string, obj: { field: string; value: any }): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, { [obj.field]: obj.value });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const deleteData = async (tableName: string, docId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, tableName, docId));
    return true;
  } catch (e) {
    return false;
  }
};

export const updateUser = async (tableName: string, docId: string, obj:any): Promise<boolean> => {
    try {
      const docRef = doc(db, tableName, docId);
      await updateDoc(docRef, obj);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
export const getUserDetailsByPhone = async (phoneNumber: string): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "clients"), where("phoneNumber", "==", phoneNumber)));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
};
export const uploadFile = async (file: string, path: string): Promise<string> => {
  const storage = getStorage(app);
  const fileRef = ref(storage, path);
  const response = await fetch(file);
  const blob = await response.blob();
  const uploadTask = await uploadBytesResumable(fileRef, blob);
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};

const getGeohashRange = (latitude:number,longitude:number,distance:number) => {
  const lat = 0.0144927536231884;
  const lon = 0.0181818181818182;
  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;
  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;
  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);
  return {
    lower,
    upper
  };
};

export const getMusicList = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicByGenre = async (genre: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), where("genre", "==", genre)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicByArtist = async (artistId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), where("artistId", "==", artistId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicByVenue = async (venueId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), where("venueId", "==", venueId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicByPopularity = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), orderBy("playCount", "desc"), limit(10)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicByLatest = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music"), orderBy("date", "desc"), limit(10)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicBySearch = async (searchTerm: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data.filter(music => 
      music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getMusicById = async (musicId: string): Promise<any> => {
  try {
    const docRef = doc(db, "music", musicId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateMusicPlayCount = async (musicId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "music", musicId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentPlayCount = docSnap.data().playCount || 0;
      await updateDoc(docRef, { playCount: currentPlayCount + 1 });
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getMusicGenres = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "music")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    const genres = new Set(data.map(music => music.genre));
    return Array.from(genres);
  } catch (e) {
    console.error(e);
    return [];
  }
};