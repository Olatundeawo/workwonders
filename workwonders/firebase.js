const admin = require('firebase-admin');
const serviceAccount = require('./.config/serviceAccountKey.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'workwonders-f537b.appspot.com'
});

const bucket = admin.storage().bucket()
// console.log('Bucket Instance', bucket)

module.exports = bucket;
