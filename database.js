import * as mapFunctions from "./map.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGOimpUrzNr7CnQFr1qp0w93X8w7fS11o",
  authDomain: "carte-bde-373d7.firebaseapp.com",
  projectId: "carte-bde-373d7",
  storageBucket: "carte-bde-373d7.appspot.com",
  messagingSenderId: "981295285127",
  appId: "1:981295285127:web:bc0d3f7fda264ae3a40922",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const usersCollection = firestore.collection("users");

// Retrieve all documents in the collection
export function initDB() {
  usersCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());

      mapFunctions.addAndPushMarker(doc.data().x, doc.data().y, {
        name: doc.data().name,
        city: doc.data().city,
        isStage: doc.data().isStage,
      });
    });
    console.log("All users retrieved successfully");
  });
}

// Add a new document
export function addUser(name, city, isStage) {
  if (
    typeof name !== "string" &&
    typeof city !== "string" &&
    typeof isStage !== "boolean"
  ) {
    console.log("Un des champs est invalide");
    return;
  }

  mapFunctions.getPosFromAdresse(city).then((pos) => {
    usersCollection
      .add({ name, city, isStage, x: pos.latitude, y: pos.longitude })
      .then((docRef) => {
        console.log("User added with ID: ", docRef.id);
        mapFunctions.addAndPushMarker(pos.latitude, pos.longitude, {
          name,
          city,
          isStage,
        });
      })
      .catch((error) => {
        console.error("Error adding user: ", error);
      });
  });
}
