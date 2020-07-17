import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Recipe } from 'models/recipe';

@Component({
  selector: 'app-md-recipe-view',
  template: `
    <div class="header ion-margin-top">
      <app-recipe-image
        [recipe]="recipe"
        [disableHoverAnimation]="true"
      ></app-recipe-image>
      <p class="caption ion-text-center">
        <small>Proposé par {{ recipe.createdBy.username }}</small>
      </p>
      <app-recipe-timing
        class="ion-margin-start"
        [recipe]="recipe"
      ></app-recipe-timing>
    </div>
    <div class="content ion-margin-start ion-margin-end ion-margin-top">
      <app-recipe-directives
        class="ion-margin-end"
        *ngIf="recipe.directives.length"
        [directives]="recipe.directives"
        [centerTitle]="false"
      ></app-recipe-directives>
      <app-recipe-ingredients-list
        *ngIf="recipe.ingredients.length"
        [ingredients]="recipe.ingredients"
        [centerTitle]="false"
        [servingCount]="recipe.servingCount"
      ></app-recipe-ingredients-list>
    </div>
  `,
  styleUrls: ['./md-recipe-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRecipeViewComponent {
  @Input() recipe: Recipe;
}
