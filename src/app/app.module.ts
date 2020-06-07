import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  RouterModule,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import '@firebase/auth';
import { IonicModule, IonicRouteStrategy, NavController } from '@ionic/angular';
import { skip } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { LayoutModule } from './core/layout/layout.module';
import { ROUTES } from './routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }), // TODO: Implement better preload strategy
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireFunctionsModule,
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // App not stable because of firebase issue...
      registrationStrategy: 'registerWithDelay:2000',
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: REGION, useValue: 'europe-west1' },
  ],
})
export class AppModule {
  constructor(angularFireAuth: AngularFireAuth, navController: NavController) {
    angularFireAuth.authState.pipe(skip(1)).subscribe((user) => {
      if (!user) {
        navController.navigateBack('login', { replaceUrl: true });
      }
    });
  }
}
