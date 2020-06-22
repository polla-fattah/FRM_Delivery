import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import "firebase/functions"


var firebaseConfig = {
  apiKey: "AIzaSyASLMIDhzFU-PIvIiThq1hLc-oBq0v_YeY",
  authDomain: "delivery-system-1.firebaseapp.com",
  databaseURL: "https://delivery-system-1.firebaseio.com",
  projectId: "delivery-system-1",
  storageBucket: "delivery-system-1.appspot.com",
  messagingSenderId: "599630228897",
  appId: "1:599630228897:web:fd4e89a17be0b8b9ed2fe0",
  measurementId: "G-E5290VWM1F"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.functions()
const currentUser = auth.currentUser

// firebase collections
const usersDB = db.collection('users')
const deliveryDB = db.collection('delivery')
const regionsDB = db.collection('deliveryGroup')


export {
  db,
  functions,
  auth,
  currentUser,
  usersDB,
  deliveryDB,
  regionsDB
}
