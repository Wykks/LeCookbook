import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config, NavController, Platform } from '@ionic/angular';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Recipe } from '../../../models/recipe';
import { RecipeService } from '../core/recipe/recipe.service';
import { SIZE_TO_MEDIA } from '../media';

@Component({
  selector: 'app-recipe-index',
  templateUrl: './recipe-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeIndexComponent implements OnInit {
  ios = this.config.get('mode') === 'ios';
  mobile = this.platform.is('mobile');
  canEdit$: Observable<boolean>;
  recipe$: Observable<Recipe>;
  belowSMLayout$ = this.breakpointObserver
    .observe(SIZE_TO_MEDIA.sm)
    .pipe(map((value) => !value.matches));
  pageTitle$ = this.belowSMLayout$.pipe(
    switchMap((isXS) =>
      isXS ? of('') : this.recipe$.pipe(map((recipe) => recipe.title))
    )
  );
  toolbarTransparent$: Observable<boolean>;
  canShare = !!(<any>navigator).share;

  constructor(
    private config: Config,
    private platform: Platform,
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.recipe$ = this.activatedRoute.paramMap.pipe(
      switchMap((paramMap) =>
        this.recipeService.getRecipe(paramMap.get('recipeId')!)
      ),
      map((recipe) => {
        if (!recipe) {
          this.navController.navigateRoot('/');
        }
        return recipe;
      }),
      filter((recipe): recipe is Recipe => !!recipe),
      shareReplay(1)
    );
    this.canEdit$ = this.recipe$.pipe(
      switchMap((recipe) => this.recipeService.canEditRecipe(recipe))
    );
    this.toolbarTransparent$ = combineLatest([
      this.belowSMLayout$,
      this.recipe$,
    ]).pipe(
      map(
        ([belowSMLayout, recipe]) =>
          belowSMLayout &&
          !!recipe.imageNames.filter((imageName) => !!imageName).length
      )
    );
  }

  edit(recipe: Recipe) {
    this.navController.navigateForward(`/recipe/${recipe.id}/edit`);
  }

  share(_recipe: Recipe) {
    (<any>navigator).share({
      url: document.location.href,
    });
  }
}
