const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

// reference to db location
let thingsRef;
// turn off realtime stream
let unsubscribe;

const provider = new firebase.auth.GoogleAuthProvider();

const db = firebase.firestore();


signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  if (user) {
    thingsRef = db.collection('things');

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: 'fake name',
        weight: 50,
        createdAt: serverTimestamp()
      });
    };
//
    unsubscribe = thingsRef
      .where('uid', '==', user.uid)
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        return `<li>${ doc.data().name }</li>`
      });

      thingsList.innerHTML = items.join('');
    });

    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `
      <h3>Hello ${user.displayName} !</h3><p>User ID: ${user.uid}</p>
    `;
  } else {
    unsubscribe && unsubscribe();

    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = ``;
  }
});
