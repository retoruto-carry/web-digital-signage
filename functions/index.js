const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addInterruptPage = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  if (!req.body || !req.body.url) {
    res.status(400).send('Request Body Not Found or Invalid')
    return
  }
  const page = {
    url: req.body.url,
    durationMillisecond: req.body.durationMillisecond | 5000,
    createdAt: new Date()
  }
  console.log('!')
  console.log(page)
  console.log('!')
  return admin
    .firestore()
    .collection('interruptPages')
    .add(page)
    .then((docRef) => {
      console.log('===')
      docRef.get().then((snapshot) => {
        if (snapshot.exists) {
          console.log('Document retrieved successfully.', snapshot.data())
        }
      })
      res.status(200).send(docRef.id)
    })
    .catch((err) => {
      console.error(err)
      // 登録に失敗したら500を返す
      res.status(500).send('Error adding document')
    })
})
