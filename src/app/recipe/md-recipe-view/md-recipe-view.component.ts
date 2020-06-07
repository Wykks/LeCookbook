import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Recipe } from 'models/recipe';

@Component({
  selector: 'app-md-recipe-view',
  template: `
    <ion-grid class="ion-margin ion-justify-content-center" pageContent>
      <ion-row class="ion-justify-content-center">
        <ion-col class="content ion-align-self-center" size-xl="9" size-md="12">
          <div class="left">
            <app-recipe-image
              [recipe]="recipe"
              [disableHoverAnimation]="true"
            ></app-recipe-image>
            <p class="caption ion-text-center">
              <small>Proposé par {{ recipe.createdBy.username }}</small>
            </p>
            <app-recipe-ingredients-list
              *ngIf="recipe.ingredients.length"
              [ingredients]="recipe.ingredients"
              [centerTitle]="false"
              [servingCount]="recipe.servingCount"
            ></app-recipe-ingredients-list>
          </div>
          <div class="right ion-margin-start">
            <app-recipe-timing [recipe]="recipe"></app-recipe-timing>
            <app-recipe-directives
              *ngIf="recipe.directives.length"
              [directives]="recipe.directives"
              [centerTitle]="false"
            ></app-recipe-directives>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styleUrls: ['./md-recipe-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRecipeViewComponent {
  @Input() recipe: Recipe;
}
