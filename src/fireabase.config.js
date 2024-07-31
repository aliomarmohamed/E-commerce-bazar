// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
//https://firebase.google.com/docs/web/setup#available-libraries
// Import other Firebase services as needed
import firebase from 'firebase/app';
import 'firebase/auth'; // Import other Firebase services as needed

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBYS3l7tyaKZyxWgVEIngQCnkvct8M2PUE",
    authDomain: "bazarapp-507a6.firebaseapp.com",
    projectId: "bazarapp-507a6",
    storageBucket: "bazarapp-507a6.appspot.com",
    messagingSenderId: "889607681349",
    appId: "1:889607681349:web:48b33c4f7dca20d72e3a2c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
