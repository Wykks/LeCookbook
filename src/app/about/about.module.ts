import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageModule } from '../shared/page/page.module';
import { AboutIndexComponent } from './about-index.component';

const routes: Routes = [
  {
    path: '',
    component: AboutIndexComponent,
  },
];

@NgModule({
  declarations: [AboutIndexComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    PageModule,
  ],
})
export class AboutModule {}
