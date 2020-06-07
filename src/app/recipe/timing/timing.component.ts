import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Recipe } from 'models/recipe';

@Component({
  selector: 'app-recipe-timing',
  template: `
    <div class="timing">
      Temps total : {{ recipe.timeToPrepare + recipe.cookTime }}
    </div>
    <div class="sub-timing ion-padding ion-margin-top">
      <div>Préparation : {{ recipe.timeToPrepare }}</div>
      <div>Cuisson : {{ recipe.cookTime }}</div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }

      .timing {
        align-self: center;
      }

      .sub-timing {
        display: flex;
        justify-content: space-around;
        border-top: ridge 1px;
        border-bottom: ridge 1px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimingComponent {
  @Input() recipe: Recipe;
}
