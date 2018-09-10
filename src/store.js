import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";

//--- Reducers ---
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: "AIzaSyAJpDSPtr37fOmT6aihw87MFva37cy5N9I",
  authDomain: "reactclientpanel-def35.firebaseapp.com",
  databaseURL: "https://reactclientpanel-def35.firebaseio.com",
  projectId: "reactclientpanel-def35",
  storageBucket: "reactclientpanel-def35.appspot.com",
  messagingSenderId: "135662504096"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// Init Firebase Instance
firebase.initializeApp(firebaseConfig);
// Init Firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

// Check For Settings In Local Storage
if (localStorage.getItem("settings") == null) {
  // Default Settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // Set To Local Storage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create Initial State
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

// Create Store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
