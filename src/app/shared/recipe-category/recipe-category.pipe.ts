import { Pipe, PipeTransform } from '@angular/core';
import { RecipeCategory, CategoriesLabel } from 'models/recipe';

@Pipe({
  name: 'recipeCategory',
})
export class RecipeCategoryPipe implements PipeTransform {
  transform(value: RecipeCategory): string {
    return CategoriesLabel[value];
  }
}
