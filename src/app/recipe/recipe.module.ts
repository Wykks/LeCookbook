import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ImageWithStatusModule } from '../shared/image-with-status/image-with-status.module';
import { LoadingOrErrorModule } from '../shared/loading-or-error/loading-or-error.module';
import { PageModule } from '../shared/page/page.module';
import { RecipeCategoryModule } from '../shared/recipe-category/recipe-category.module';
import { RecipeImageModule } from '../shared/recipe-image/recipe-image.module';
import { MdRecipeViewComponent } from './md-recipe-view/md-recipe-view.component';
import { RecipeIndexComponent } from './recipe-index.component';
import { XsRecipeViewComponent } from './xs-recipe-view/xs-recipe-view.component';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
import { TimingComponent } from './timing/timing.component';
import { DirectivesComponent } from './directives/directives.component';

export const routes: Routes = [
  {
    path: ':recipeId',
    component: RecipeIndexComponent,
  },
  {
    path: ':recipeId/edit',
    loadChildren: () =>
      import('../edit-recipe/edit-recipe.module').then(
        (m) => m.EditRecipeModule
      ),
  },
];

@NgModule({
  declarations: [
    RecipeIndexComponent,
    XsRecipeViewComponent,
    MdRecipeViewComponent,
    IngredientsListComponent,
    TimingComponent,
    DirectivesComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    PageModule,
    LoadingOrErrorModule,
    LayoutModule,
    ImageWithStatusModule,
    RecipeCategoryModule,
    RecipeImageModule,
  ],
})
export class RecipeModule {}
