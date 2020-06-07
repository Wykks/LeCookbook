import { Injectable, Inject, NgZone, Optional } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import {
  ɵAngularFireSchedulers,
  FIREBASE_OPTIONS,
  FirebaseOptions,
  FIREBASE_APP_NAME,
  FirebaseAppConfig,
} from '@angular/fire';
import { observeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends AngularFireAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_OPTIONS) options: FirebaseOptions,
    @Optional()
    @Inject(FIREBASE_APP_NAME)
    nameOrConfig: string | FirebaseAppConfig | null | undefined,
    zone: NgZone,
    router: Router
  ) {
    super(options, nameOrConfig, zone, router);
    this.authState = this.authState.pipe(
      observeOn(new ɵAngularFireSchedulers(zone).insideAngular)
    );
  }
}
