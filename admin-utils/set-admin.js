// USAGE: node set-admin staging example@stuff.com

const admin = require('firebase-admin');

const target = process.argv[2];

const serviceAccount = require(`./${target}-admin-sdk.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

const email = process.argv[3];

admin
  .auth()
  .getUserByEmail(email)
  .then((user) =>
    admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    })
  )
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
