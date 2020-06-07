import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import type { Recipe } from '../../models/recipe';

const firebase = admin.initializeApp();

const functionsWithRegion = functions.region('europe-west1');

const DISPLAY_NAME_PREFIX = 'COOKBOOKUSER:';

export const changeUsername = functionsWithRegion.https.onCall(
  async (data, context) => {
    const { displayName } = data;
    if (!/^[a-z0-9]+$/i.test(displayName)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid username format'
      );
    }
    const uid = context.auth!.uid;
    const db = firebase.firestore();
    const user = await admin.auth().getUser(uid);
    const previousUsername = user.displayName!.substr(
      DISPLAY_NAME_PREFIX.length
    );
    const usernamesCollection = db.collection('usernames');
    const usernameRef = usernamesCollection.doc(displayName);
    let previousUsernameRef: FirebaseFirestore.DocumentReference | null = null;
    if (previousUsername) {
      previousUsernameRef = usernamesCollection.doc(previousUsername);
    }
    try {
      await db.runTransaction(async (transaction) => {
        if (previousUsernameRef) {
          const previousUsernameDoc = await transaction.get(
            previousUsernameRef
          );
          if (
            previousUsernameDoc.exists &&
            previousUsernameDoc.data()!.previousUsername
          ) {
            throw new Error('change-already-pending');
          }
        }
        const usernameDoc = await transaction.get(usernameRef);
        if (usernameDoc.exists) {
          throw new Error('already-exist');
        }
        const usernameData: any = { uid };
        if (previousUsername) {
          usernameData.previousUsername = previousUsername;
        }
        transaction.create(usernameRef, usernameData);
      });
    } catch (e) {
      console.error(e);
      if (e.message === 'already-exist') {
        throw new functions.https.HttpsError('already-exists', e.message);
      } else if (e.message === 'change-already-pending') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'A username change for this user is already pending'
        );
      }
      throw new functions.https.HttpsError('internal', e.message);
    }
    // Done in frontend. But just in case
    const promises: Promise<unknown>[] = [
      admin.auth().updateUser(uid, {
        displayName: `${DISPLAY_NAME_PREFIX}${displayName}`,
      }),
    ];
    if (previousUsernameRef) {
      promises.push(previousUsernameRef.delete());
    }
    return Promise.all(promises);
  }
);

export const createUsername = functionsWithRegion.firestore
  .document('usernames/{username}')
  .onCreate(async (snap, context) => {
    const uid = snap.data()!.uid;
    const { username } = context.params;
    const db = firebase.firestore();
    const recipesQuerySnap = await db
      .collection('recipes')
      .where('createdBy.uid', '==', uid)
      .get();
    const promises: Promise<unknown>[] = [];
    recipesQuerySnap.forEach((doc) => {
      promises.push(doc.ref.update({ 'createdBy.username': `${username}` }));
    });
    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
    }
    // Remove previousUsername from username doc (which mark the username transition done)
    return db.collection('usernames').doc(username).set({ uid });
  });

export const recipeImageOnFinalize = functionsWithRegion.storage
  .object()
  .onFinalize(async (object) => {
    if (!object.name!.startsWith('recipes/')) {
      return null;
    }
    const bucket = firebase.storage().bucket();
    const file = bucket.file(object.name!);
    file.makePublic();
    const [, recipeId, imageName] = file.name.match('^recipes/(.+)/(.+)')!;
    const db = firebase.firestore();
    const recipeDoc = db.doc(`recipes/${recipeId}`);
    return db.runTransaction(async (transaction) => {
      const recipe = <Recipe>(await transaction.get(recipeDoc)).data();
      let imageUrlByName = recipe.imageUrlByName;
      if (!imageUrlByName) {
        imageUrlByName = {};
      }
      imageUrlByName[imageName] = object.mediaLink!;
      transaction.update(recipeDoc, { imageUrlByName });
    });
  });

export const recipeOnUpdate = functionsWithRegion.firestore
  .document('recipes/{recipeId}')
  .onUpdate(async (change, context) => {
    const { recipeId } = context.params;
    const newValue = <Partial<Recipe>>change.after.data();
    const previousValue = <Partial<Recipe>>change.before.data();
    if (
      JSON.stringify(newValue.imageNames) ===
      JSON.stringify(previousValue.imageNames)
    ) {
      console.log('Same images, stopping function...');
      return null;
    }
    const imagesToDelete: string[] = previousValue.imageNames!.filter(
      (imageName): imageName is string =>
        !!imageName && !newValue.imageNames!.includes(imageName)
    );
    if (!imagesToDelete.length) {
      console.log('Nothing to delete, stopping function...');
      return null;
    }
    const db = firebase.firestore();
    const updatePromise: Promise<unknown> = db.runTransaction(
      async (transaction) => {
        const recipe = <Recipe>(await transaction.get(change.after.ref)).data();
        const imageUrlByName = recipe.imageUrlByName!;
        for (const imageToDelete of imagesToDelete) {
          delete imageUrlByName[imageToDelete];
        }
        transaction.update(change.after.ref, { imageUrlByName });
      }
    );
    const bucket = firebase.storage().bucket();
    const imagesRemovePromises = imagesToDelete.map((imageName) =>
      bucket.file(`recipes/${recipeId}/${imageName}`).delete()
    );
    return Promise.all([updatePromise, ...imagesRemovePromises]);
  });

export const recipeOnDelete = functionsWithRegion.firestore
  .document('recipes/{recipeId}')
  .onDelete((_, context) => {
    const { recipeId } = context.params;
    const bucket = firebase.storage().bucket();
    return bucket.deleteFiles({
      prefix: `recipes/${recipeId}`,
    });
  });
