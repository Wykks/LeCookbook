import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UsernameInputComponent } from './username-input.component';

@NgModule({
  declarations: [UsernameInputComponent],
  imports: [CommonModule, IonicModule],
  exports: [UsernameInputComponent],
})
export class UsernameInputModule {}
