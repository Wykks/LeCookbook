import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Ingredient } from 'models/recipe';

@Component({
  selector: 'app-recipe-ingredients-list',
  template: `
    <h2 [ngClass]="{ 'ion-text-center': centerTitle }">
      Ingrédients
    </h2>
    <ion-list lines="none">
      <ion-list-header>Pour {{ servingCount }} personnes</ion-list-header>
      <ion-item *ngFor="let ingredient of ingredients">{{
        ingredient.text
      }}</ion-item>
    </ion-list>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsListComponent {
  @Input() ingredients: Ingredient[];
  @Input() servingCount: number;
  @Input() centerTitle = true;
}
