import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageWithStatusModule } from '../image-with-status/image-with-status.module';
import { RecipeImageComponent } from './recipe-image.component';

@NgModule({
  declarations: [RecipeImageComponent],
  imports: [CommonModule, ImageWithStatusModule],
  exports: [RecipeImageComponent],
})
export class RecipeImageModule {}
