import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as cuid from 'cuid';
import firebase from 'firebase/app';
import { combineLatest, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Recipe } from '../../../../models/recipe';
import { UserService } from '../user.service';

export interface RecipeImage {
  name: string;
  imageAsDataURL: string | null;
}

export const RECIPE_IMAGE_PREFIX = 'recipes/';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private collection = this.db.collection<Recipe>('recipes');

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private storage: AngularFireStorage
  ) {}

  addRecipe(recipe: Partial<Recipe>, images: (string | null)[]) {
    const createdAt = <any>firebase.firestore.FieldValue.serverTimestamp();
    const updatedAt = <any>firebase.firestore.FieldValue.serverTimestamp();
    const recipeImages = this.prepareRecipeImages(images);
    const imageNames = recipeImages.map((recipeImage) =>
      recipeImage ? recipeImage.name : null
    );
    return combineLatest([
      this.userService.getCurrentUsername(),
      this.userService.getCurrentUser(),
    ]).pipe(
      take(1),
      switchMap(async ([currentUsername, currentUser]) => {
        const createdBy = {
          username: currentUsername!,
          uid: currentUser!.uid,
        };
        const createdRecipe = await this.collection.add({
          ...(<Recipe>recipe),
          createdBy,
          createdAt,
          updatedAt,
          viewCount: 0,
          imageNames,
        });
        return { createdRecipe, recipeImages };
      })
    );
  }

  uploadImages(recipeId: string, recipeImages: (RecipeImage | null)[]) {
    return recipeImages
      .filter(
        (recipeImage): recipeImage is RecipeImage =>
          !!recipeImage && !!recipeImage.imageAsDataURL
      )
      .map((recipeImage) =>
        this.storage
          .ref(`${RECIPE_IMAGE_PREFIX}${recipeId}/${recipeImage.name}`)
          .putString(recipeImage.imageAsDataURL!, 'data_url')
          .snapshotChanges()
      );
  }

  getImageFullUrl(recipeId: string, imageName: string) {
    return this.storage
      .ref(`${RECIPE_IMAGE_PREFIX}${recipeId}/${imageName}`)
      .getDownloadURL();
  }

  async updateRecipe(
    recipeId: string,
    newRecipe: Partial<Recipe>,
    newImages: (string | null)[]
  ) {
    const recipeImages = this.prepareRecipeImages(newImages);
    newRecipe.imageNames = recipeImages.map((recipeImage) =>
      recipeImage ? recipeImage.name : null
    );
    newRecipe.updatedAt = <any>firebase.firestore.FieldValue.serverTimestamp();
    await this.collection.doc(recipeId).update({ ...newRecipe });
    return recipeImages;
  }

  removeRecipe(recipeId: string) {
    console.log(recipeId);
    return this.collection.doc(recipeId).delete();
  }

  // async addNote(recipeId: string, note: string) {
  //   return this.collection.doc(recipeId).update({ note });
  // }

  // async removeNote(recipeId: string) {
  //   return this.collection.doc(recipeId).update({ note: undefined });
  // }

  getUserRecipes() {
    return this.userService.getCurrentUser().pipe(
      take(1),
      switchMap((currentUser) =>
        this.db
          .collection<Recipe>('recipes', (ref) =>
            ref.where('createdBy.uid', '==', currentUser!.uid)
          )
          .get()
      ),
      map((snapshots) =>
        snapshots.docs.map(
          (snapshot) =>
            <Recipe>{
              id: snapshot.id,
              ...snapshot.data(),
            }
        )
      )
    );
  }

  getPublicRecipes() {
    return this.db
      .collection<Recipe>('recipes', (ref) =>
        ref.where('showInPublicList', '==', true)
      )
      .get()
      .pipe(
        map((snapshots) =>
          snapshots.docs.map(
            (snapshot) =>
              <Recipe>{
                id: snapshot.id,
                ...snapshot.data(),
              }
          )
        )
      );
  }

  getRecipe(recipeId: string) {
    return this.collection
      .doc<Recipe>(recipeId)
      .get()
      .pipe(
        map((snap): Recipe | undefined =>
          snap.exists ? { ...(<Recipe>snap.data()), id: snap.id } : undefined
        )
      );
  }

  canEditRecipe(recipe: Recipe) {
    return this.userService.getCurrentUser().pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          return of(false);
        }
        if (recipe.createdBy.uid === user.uid) {
          return of(true);
        }
        return this.userService.isAdmin();
      })
    );
  }

  private prepareRecipeImages(images: (string | null)[]) {
    return images.map((image): RecipeImage | null => {
      if (image && image.startsWith('data:')) {
        return {
          name: cuid.slug(),
          imageAsDataURL: image,
        };
      } else if (image) {
        return {
          name: image,
          imageAsDataURL: null,
        };
      }
      return null;
    });
  }
}
