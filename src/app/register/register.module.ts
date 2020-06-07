import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegisterIndexComponent } from './register-index.component';
import { UsernameInputModule } from '../shared/username-input/username-input.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterIndexComponent,
  },
];

@NgModule({
  declarations: [RegisterIndexComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    UsernameInputModule,
  ],
})
export class RegisterModule {}
