var admin = require("firebase-admin");
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const serviceAccount = {
  type: process.env.REACT_APP_FIREBASE_TYPE,
  project_id: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  private_key_id: process.env.REACT_APP_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_FIREBASE_CLIENT_ID,
  auth_uri: process.env.REACT_APP_FIREBASE_AUTH_URI,
  token_uri: process.env.REACT_APP_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.REACT_APP_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.REACT_APP_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.REACT_APP_FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://steam-reviews-47666.firebaseio.com'
});

const db = admin.firestore();

module.exports = { admin, db };
