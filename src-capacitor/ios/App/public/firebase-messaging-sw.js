// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyASLMIDhzFU-PIvIiThq1hLc-oBq0v_YeY",
  authDomain: "delivery-system-1.firebaseapp.com",
  databaseURL: "https://delivery-system-1.firebaseio.com",
  projectId: "delivery-system-1",
  storageBucket: "delivery-system-1.appspot.com",
  messagingSenderId: "599630228897",
  appId: "1:599630228897:web:fd4e89a17be0b8b9ed2fe0",
  measurementId: "G-E5290VWM1F"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
