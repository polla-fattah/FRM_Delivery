import Vue from 'vue'

// Your personal API key.
// Get it here: https://console.cloud.google.com/google/maps-apis
const API_KEY = `AIzaSyBP44ygxKKdl1Dtayc3J55yD0NAlCn96jQ`;
const CALLBACK_NAME = `gmapsCallback`;
console.log("_________________________")
console.log(Vue.prototype.$mapInitialized)
console.log("_________________________")

let resolveInitPromise;
let rejectInitPromise;
// This promise handles the initialization
// status of the google maps script.
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

export default function init() {
  // If Google Maps already is initialized
  // the `initPromise` should be resolved
  // eventually.
  if (Vue.prototype.$mapInitialized) return initPromise;

  Vue.prototype.$mapInitialized = true;
  // The callback function is called by
  // the Google Maps script if it is
  // successfully loaded.
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google);

  // We inject a new script tag into
  // the `<head>` of our HTML to load
  // the Google Maps script.
  const script = document.createElement(`script`);
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}`;
  script.onerror = rejectInitPromise;
  document.querySelector(`head`).appendChild(script);

  return initPromise;
}
