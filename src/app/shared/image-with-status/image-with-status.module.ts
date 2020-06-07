import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageWithStatusComponent } from './image-with-status.component';

@NgModule({
  declarations: [ImageWithStatusComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImageWithStatusComponent],
})
export class ImageWithStatusModule {}
