// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyD5DubIKAbQ75N7WjlToboTSo3OpHjWZhE",
  authDomain: "mini-docto-56ac7.firebaseapp.com",
  projectId: "mini-docto-56ac7",
  storageBucket: "mini-docto-56ac7.firebasestorage.app",
  messagingSenderId: "706897055634",
  appId: "1:706897055634:web:982ddacc432ba0b7a83b4b",
  measurementId: "G-0FXXT28ZLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
