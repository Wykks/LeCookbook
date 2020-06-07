import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageModule } from '../shared/page/page.module';
import { UsernameInputModule } from '../shared/username-input/username-input.module';
import { ChooseUsernameIndexComponent } from './choose-username-index.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseUsernameIndexComponent,
  },
];

@NgModule({
  declarations: [ChooseUsernameIndexComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PageModule,
    UsernameInputModule,
  ],
})
export class ChooseUsernameModule {}
