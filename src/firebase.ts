import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore pointing to the applet-specific Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export { collection, getDocs, doc, setDoc, deleteDoc };
