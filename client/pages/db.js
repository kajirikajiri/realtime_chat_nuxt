import firebase from 'firebase'
import firebaseConfig from './firebaseConfig'
// Get a Firestore instance
export const db = firebase.initializeApp(firebaseConfig).firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore
export { TimeStamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true })
