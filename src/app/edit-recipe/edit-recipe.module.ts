import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserGuard } from '../core/user.guard';
import { DisableFormModule } from '../shared/disable-form/disable-form.module';
import { ImageWithStatusModule } from '../shared/image-with-status/image-with-status.module';
import { PageModule } from '../shared/page/page.module';
import { DirectivesInputComponent } from './directives-input/directives-input.component';
import { EditRecipeIndexComponent } from './edit-recipe-index.component';
import { ImageInputComponent } from './image-inputs/image-input/image-input.component';
import { ImageInputsComponent } from './image-inputs/image-inputs.component';
import { IngredientInputComponent } from './ingredients-input/ingredient-input/ingredient-input.component';
import { IngredientsInputComponent } from './ingredients-input/ingredients-input.component';
import { TimeInputComponent } from './time-input/time-input.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    canActivate: [AngularFireAuthGuard, UserGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    component: EditRecipeIndexComponent,
  },
];

@NgModule({
  declarations: [
    EditRecipeIndexComponent,
    TimeInputComponent,
    ImageInputsComponent,
    ImageInputComponent,
    IngredientsInputComponent,
    IngredientInputComponent,
    DirectivesInputComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    PageModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    ImageWithStatusModule,
    DisableFormModule,
  ],
})
export class EditRecipeModule {}
