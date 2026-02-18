import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
//@ts-ignore
import {  initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyALPuFysIUUvSiWvKkKykX4yFf3f_AKybc",
  authDomain: "focusontube-4f523.firebaseapp.com",
  projectId: "focusontube-4f523",
  storageBucket: "focusontube-4f523.firebasestorage.app",
  messagingSenderId: "774212518761",
  appId: "1:774212518761:web:eae1cb5452defd4e79b3f8",
  measurementId: "G-H9SWS4XY66",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);