import * as firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyAv9Nv1aVKX4godxRztSFy5s1wObdR8Sgc",
    authDomain: "stfi-game.firebaseapp.com",
    databaseURL: "https://stfi-game.firebaseio.com",
    projectId: "stfi-game",
    storageBucket: "stfi-game.appspot.com",
}

firebase.initializeApp(firebaseConfig)

let firestore = firebase.firestore()

export default firestore
