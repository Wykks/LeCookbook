import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CookbookListIndexComponent } from './cookbook-list-index.component';

const routes: Routes = [
  {
    path: '',
    component: CookbookListIndexComponent,
  },
];

@NgModule({
  declarations: [CookbookListIndexComponent],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class CookbookListModule {}
