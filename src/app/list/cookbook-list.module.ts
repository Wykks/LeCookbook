import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthGuard } from '../core/auth.guard';
import { LoadingOrErrorModule } from '../shared/loading-or-error/loading-or-error.module';
import { PageModule } from '../shared/page/page.module';
import { RecipeCategoryModule } from '../shared/recipe-category/recipe-category.module';
import { ImageWithStatusModule } from '../shared/image-with-status/image-with-status.module';
import { CookbookListIndexComponent } from './cookbook-list-index.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipeImageModule } from '../shared/recipe-image/recipe-image.module';
import { ElementRefModule } from '../shared/element-ref/element-ref.module';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const LIST_ROUTES: Routes = [
  {
    path: 'personal',
    canActivate: [AuthGuard],
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
