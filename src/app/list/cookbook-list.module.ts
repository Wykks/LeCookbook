import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ElementRefModule } from '../shared/element-ref/element-ref.module';
import { ImageWithStatusModule } from '../shared/image-with-status/image-with-status.module';
import { LoadingOrErrorModule } from '../shared/loading-or-error/loading-or-error.module';
import { PageModule } from '../shared/page/page.module';
import { RecipeCategoryModule } from '../shared/recipe-category/recipe-category.module';
import { RecipeImageModule } from '../shared/recipe-image/recipe-image.module';
import { CookbookListIndexComponent } from './cookbook-list-index.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const LIST_ROUTES: Routes = [
  {
    path: 'personal',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    component: CookbookListIndexComponent,
  },
  {
    path: 'public',
    component: CookbookListIndexComponent,
  },
];

@NgModule({
  declarations: [CookbookListIndexComponent, RecipeCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    PageModule,
    LoadingOrErrorModule,
    ImageWithStatusModule,
    RecipeCategoryModule,
    RecipeImageModule,
    ElementRefModule,
  ],
})
export class CookbookListModule {}
