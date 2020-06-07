import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Recipe } from '../../../models/recipe';
import { RecipeService } from '../core/recipe/recipe.service';

@Component({
  template: `
    <app-cookbook-page pageTitle="Recettes">
      <div
        class="grid"
        pageContent
        *ngIf="recipes$ | async as recipes; else loadingOrError"
      >
        <cookbook-list-recipe-card
          *ngFor="let recipe of recipes; trackBy: trackByRecipe"
          [recipe]="recipe"
        ></cookbook-list-recipe-card>
      </div>
      <ng-template #loadingOrError>
        <app-loading-or-error></app-loading-or-error>
      </ng-template>
    </app-cookbook-page>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 15px;
        margin: 15px;
      }
      cookbook-list-recipe-card {
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookbookListIndexComponent implements OnInit {
  recipes$: Observable<Recipe[]>;

  constructor(
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.recipes$ = this.activatedRoute.url.pipe(
      take(1),
      switchMap((urlSegments) => {
        const recipeType = urlSegments[urlSegments.length - 1].path;
        if (recipeType === 'personal') {
          return this.recipeService.getUserRecipes();
        } else if (recipeType === 'public') {
          return this.recipeService.getPublicRecipes();
        }
        // Should never go here
        return of([]);
      })
    );
  }

  trackByRecipe(_idx: number, recipe: Recipe) {
    return recipe.id;
  }
}
