import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoadingOrErrorComponent } from './loading-or-error.component';

@NgModule({
  declarations: [LoadingOrErrorComponent],
  imports: [CommonModule, IonicModule],
  exports: [LoadingOrErrorComponent],
})
export class LoadingOrErrorModule {}
