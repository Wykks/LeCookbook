import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Recipe } from 'models/recipe';

@Component({
  selector: 'app-recipe-timing',
  template: `
    <div *ngIf="recipe.timeToPrepare" class="time-row">
      <ion-icon ios="time-outline" md="time-sharp"></ion-icon> Préparation :
      {{ recipe.timeToPrepare | time }}
    </div>
    <div *ngIf="recipe.cookTime" class="time-row">
      <ion-icon ios="time-outline" md="time-sharp"></ion-icon> Cuisson :
      {{ recipe.cookTime | time }}
    </div>
    <div *ngIf="recipe.preHeatTemp" class="time-row">
      <ion-icon ios="timer-outline" md="timer-sharp"></ion-icon> Préchauffage :
      {{ recipe.preHeatTemp }}
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      .time-row {
        display: flex;
        align-items: center;
      }
      ion-icon {
        padding-right: 2px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimingComponent {
  @Input() recipe: Recipe;
}
