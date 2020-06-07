import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementRefDirective } from './element-ref.directive';

@NgModule({
  declarations: [ElementRefDirective],
  imports: [CommonModule],
  exports: [ElementRefDirective],
})
export class ElementRefModule {}
