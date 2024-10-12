// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq1jdqSWfr7Ad2MrMyQ0qgqlFM1bh53pA",
  authDomain: "students-data-with-react.firebaseapp.com",
  projectId: "students-data-with-react",
  storageBucket: "students-data-with-react.appspot.com",
  messagingSenderId: "708931994139",
  appId: "1:708931994139:web:0b36e022b12395f0bc6ebe",
  measurementId: "G-7WB9N72YP1",
  databaseURL: "https://students-data-with-react-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;