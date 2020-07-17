import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Ingredient, IngredientType } from 'models/recipe';

@Component({
  selector: 'app-recipe-ingredients-list',
  template: `
    <h2 [ngClass]="{ 'ion-text-center': centerTitle }">
      Ingrédients
    </h2>
    <ion-list lines="none">
      <ion-list-header *ngIf="servingCount"
        >Pour {{ servingCount }} personnes</ion-list-header
      >
      <ion-item *ngFor="let ingredient of ingredients">
        <ion-icon
          *ngIf="ingredient.type === IngredientType.PART"
          ios="book-outline"
          md="book-sharp"
        ></ion-icon>
        <ion-icon
          *ngIf="ingredient.type === IngredientType.INGREDIENT"
          ios="chevron-forward-outline"
          md="chevron-forward-sharp"
        ></ion-icon>
        {{ ingredient.text }}
      </ion-item>
    </ion-list>
  `,
  styles: [
    `
      h2 {
        margin-top: 0px;
      }
      ion-icon {
        margin-right: 4px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsListComponent {
  @Input() ingredients: Ingredient[];
  @Input() servingCount: number;
  @Input() centerTitle = true;
  IngredientType = IngredientType;
}
