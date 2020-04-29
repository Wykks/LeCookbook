import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  RouterModule,
  Routes,
} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./cookbook-list/cookbook-list.module').then(
        (m) => m.CookbookListModule
      ),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class AppModule {}
