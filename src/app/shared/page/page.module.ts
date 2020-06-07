import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, IonicModule],
  exports: [PageComponent],
})
export class PageModule {}
