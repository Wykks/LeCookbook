import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import type firebase from 'firebase/app';
import { from, of, ReplaySubject } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

// NOTE: Also used in cloud functions
const DISPLAY_NAME_PREFIX = 'COOKBOOKUSER:';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$ = this.angularFireAuth.authState.pipe(map((user) => !!user));

  private currentUser = new ReplaySubject<null | firebase.User>(1);
  private currentDisplayName = new ReplaySubject<null | string>(1);

  constructor(
    private readonly angularFireAuth: AngularFireAuth,
    private readonly db: AngularFirestore,
    private readonly fns: AngularFireFunctions
  ) {
    this.angularFireAuth.authState
      .pipe(
        tap((user) => {
          this.currentUser.next(user);
        }),
        filter((user): user is firebase.User => !!user),
        map((user) => {
          if (
            !user.displayName ||
            !user.displayName.startsWith(DISPLAY_NAME_PREFIX)
          ) {
            return null;
          }
          return user.displayName.substr(DISPLAY_NAME_PREFIX.length);
        })
      )
      .subscribe((displayName) => this.currentDisplayName.next(displayName));
  }

  logout() {
    return this.angularFireAuth.signOut();
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  signInWithPopup(provider: firebase.auth.AuthProvider) {
    return this.angularFireAuth.signInWithPopup(provider);
  }

  signInWithRedirect(provider: firebase.auth.AuthProvider) {
    return this.angularFireAuth.signInWithRedirect(provider);
  }

  isAdmin() {
    return this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (!user) {
          return of(false);
        }
        return from(user.getIdTokenResult()).pipe(
          map((idTokenResult) => !!idTokenResult.claims.admin)
        );
      })
    );
  }

  isUsernameFree(username: string) {
    return this.db
      .collection('usernames')
      .doc(username)
      .get()
      .pipe(
        withLatestFrom(this.currentUser),
        map(([snap, currentUser]) => {
          if (!snap.exists) {
            return true;
          }
          return snap.get('uid') === currentUser!.uid;
        })
      );
  }

  setUsername(username: string) {
    const callable = this.fns.httpsCallable('changeUsername');
    return callable({ displayName: username })
      .pipe(
        withLatestFrom(this.currentUser),
        switchMap(([, currentUser]) => {
          return currentUser!.updateProfile({
            displayName: `${DISPLAY_NAME_PREFIX}${username}`,
          });
        }),
        tap(() => {
          this.currentDisplayName.next(username);
        })
      )
      .toPromise();
  }

  getCurrentUsername() {
    return this.currentDisplayName.asObservable();
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }
}
