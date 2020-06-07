import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageModule } from '../shared/page/page.module';
import { UsernameInputModule } from '../shared/username-input/username-input.module';
import { AccountIndexComponent } from './account-index.component';

const routes: Routes = [
  {
    path: '',
    component: AccountIndexComponent,
  },
];

@NgModule({
  declarations: [AccountIndexComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    PageModule,
    ReactiveFormsModule,
    UsernameInputModule,
  ],
})
export class AccountModule {}
