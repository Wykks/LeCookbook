import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCategoryPipe } from './recipe-category.pipe';

@NgModule({
  declarations: [RecipeCategoryPipe],
  imports: [CommonModule],
  exports: [RecipeCategoryPipe],
})
export class RecipeCategoryModule {}
