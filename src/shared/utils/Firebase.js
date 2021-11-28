import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLjW-3g5O6-TzefgKjqc6Mqh9TOg-fJvo",
  authDomain: "facultadtp-2dd10.firebaseapp.com",
  projectId: "facultadtp-2dd10",
  storageBucket: "facultadtp-2dd10.appspot.com",
  messagingSenderId: "1079198003514",
  appId: "1:1079198003514:web:ca590dc26660ef36dce003",
  measurementId: "G-HLH6HGVFEB"
};

export default firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore(firebase);
export const storage = firebase.storage();
