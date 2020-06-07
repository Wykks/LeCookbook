import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Recipe } from 'models/recipe';

@Component({
  selector: 'app-xs-recipe-view',
  template: `
    <app-recipe-image
      *ngIf="!noImages"
      class="header"
      [recipe]="recipe"
      [disableHoverAnimation]="true"
    ></app-recipe-image>
    <div [ngClass]="{ 'with-image': !noImages }">
      <p class="category ion-text-center">
        {{ recipe.category | recipeCategory | uppercase }}
      </p>
      <h1 class="ion-text-center">{{ recipe.title }}</h1>
      <p class="caption ion-text-center">
        <small>Proposé par {{ recipe.createdBy.username }}</small>
      </p>
      <app-recipe-ingredients-list
        *ngIf="recipe.ingredients.length"
        [ingredients]="recipe.ingredients"
        [servingCount]="recipe.servingCount"
      ></app-recipe-ingredients-list>
      <app-recipe-directives
        *ngIf="recipe.directives.length"
        [directives]="recipe.directives"
      ></app-recipe-directives>
    </div>
  `,
  styleUrls: ['./xs-recipe-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XsRecipeViewComponent implements OnChanges {
  @Input() recipe: Recipe;

  noImages = false;

  ngOnChanges() {
    this.noImages = !this.recipe.imageNames.filter((imageName) => !!imageName)
      .length;
  }
}
