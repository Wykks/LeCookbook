import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageModule } from '../shared/page/page.module';
import { LoginIndexComponent } from './login-index.component';

const routes: Routes = [
  {
    path: '',
    component: LoginIndexComponent,
  },
];

@NgModule({
  declarations: [LoginIndexComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PageModule,
  ],
})
export class LoginModule {}
