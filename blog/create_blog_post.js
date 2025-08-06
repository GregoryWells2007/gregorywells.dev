function create_post(inContent, inTitle) {
  const db = firebase.firestore();
  const admins = db.collection("Posts");
  admins
    .add({
      title: inTitle,
      content: inContent,
      date: new Date(),
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
