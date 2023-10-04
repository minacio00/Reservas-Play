// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrJ7jkgLRmhtBO3zdj6X90clKd5BAfemI",
  authDomain: "reservas-play.firebaseapp.com",
  projectId: "reservas-play",
  storageBucket: "reservas-play.appspot.com",
  messagingSenderId: "909578210055",
  appId: "1:909578210055:web:385617538ef017bfac13a2",
  measurementId: "G-EX39YVKDPY"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// const analytics = getAnalytics(firebaseApp);