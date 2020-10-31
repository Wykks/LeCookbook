import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  Config,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  CategoriesLabel,
  Recipe,
  RecipeCategory,
} from '../../../models/recipe';
import { RecipeImage, RecipeService } from '../core/recipe/recipe.service';
import { FormUndoRedoService } from './form-undo-redo.service';
import { EMPTY_IMAGES } from './image-inputs/image-inputs.component';

@Component({
  selector: 'app-edit-recipe-index',
  templateUrl: './edit-recipe-index.component.html',
  providers: [FormUndoRedoService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRecipeIndexComponent {
  recipeForm = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    ],
    category: [RecipeCategory.MAIN],
    images: [[...EMPTY_IMAGES]],
    ingredients: [[]],
    directives: [[]],
    rating: [null],
    timeToPrepare: [0],
    cookTime: [0],
    preHeatTemp: [],
    servingCount: [2],
    tags: [''],
    source: [null],
    showInPublicList: [false],
  });

  ios = this.config.get('mode') === 'ios';
  mobile = this.platform.is('mobile');
  isWorking = false;
  pageTitle = 'Nouvelle recette';
  disableForm = false;

  CategoriesLabel = CategoriesLabel;

  originalRecipe$: Observable<Recipe | undefined>;
  canUndo$ = this.formUndoRedoService.canUndo$;
  canRedo$ = this.formUndoRedoService.canRedo$;

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private fb: FormBuilder,
    private config: Config,
    private platform: Platform,
    private cd: ChangeDetectorRef,
    private toastController: ToastController,
    private recipeService: RecipeService,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private formUndoRedoService: FormUndoRedoService
  ) {
    this.formUndoRedoService.registerForm(this.recipeForm);
  }

  async ionViewWillEnter() {
    this.originalRecipe$ = this.activatedRoute.paramMap.pipe(
      map((params) => params.get('recipeId')),
      switchMap((recipeId) => {
        if (recipeId !== null) {
          return of(recipeId);
        }
        this.formUndoRedoService.clear();
        return EMPTY;
      }),
      tap(() => {
        this.pageTitle = 'Edition';
        this.disableForm = true;
        this.cd.markForCheck();
      }),
      switchMap((recipeId) => this.recipeService.getRecipe(recipeId)),
      tap((recipe) => {
        if (recipe) {
          this.setRecipeToForm(recipe);
        } else {
          this.navController.navigateBack('/', { replaceUrl: true });
        }
      })
    );
    this.cd.markForCheck();
  }

  async ionViewDidEnter() {
    this.loadingElement = await this.loadingController.create({
      message: 'Sauvegarde de la recette',
    });
  }

  ionViewWillLeave() {
    if (this.loadingElement) {
      this.loadingElement.dismiss();
    }
  }

  undo() {
    this.formUndoRedoService.undo();
  }

  redo() {
    this.formUndoRedoService.redo();
  }

  async save(originalRecipe: Recipe | undefined | null) {
    if (!this.recipeForm.valid) {
      return;
    }
    const recipe = this.buildRecipeFromForm();
    if (
      this.noIngredients(recipe) &&
      !(await this.confirmDialog(
        'Attention',
        "Vous n'avez pas spécifié d'ingrédients dans votre recette. Sauvegarder malgré tout ?"
      ))
    ) {
      return;
    }
    this.removeEmptyIngredients(recipe);
    const images = this.recipeForm.value.images;
    await this.updateUILoadingState(true);
    let recipeImages: (RecipeImage | null)[];
    let recipeId: string;
    try {
      if (originalRecipe) {
        recipeImages = await this.recipeService.updateRecipe(
          originalRecipe.id,
          recipe,
          images
        );
        recipeId = originalRecipe.id;
      } else {
        const res = await this.recipeService
          .addRecipe(recipe, images)
          .toPromise();
        recipeImages = res.recipeImages;
        recipeId = res.createdRecipe.id;
      }
    } catch (e) {
      console.error(e);
      const toast = await this.toastController.create({
        message: 'Échec de sauvegarde',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      await this.updateUILoadingState(false);
      return;
    }
    const uploadStep$ = this.uploadImages(recipeId, recipeImages);
    uploadStep$.subscribe(() => {
      this.navController.navigateBack(`recipe/${recipeId}`);
    });
  }

  keepOriginalOrder = (a: any) => a.key;

  async deleteRecipe(recipe: Recipe) {
    if (!(await this.confirmDialog('Confirmer', 'Supprimer la recette ?'))) {
      return;
    }
    this.isWorking = true;
    this.cd.markForCheck();
    try {
      await this.recipeService.removeRecipe(recipe.id);
    } catch (e) {
      console.error(e);
      const toastE = await this.toastController.create({
        message: 'Échec de suppression',
        duration: 2000,
        color: 'danger',
      });
      toastE.present();
      this.isWorking = false;
      this.cd.markForCheck();
      return;
    }
    const toast = await this.toastController.create({
      message: 'Recette supprimée',
      duration: 2000,
      color: 'success',
    });
    toast.present();
    this.navController.navigateBack('/', { replaceUrl: true });
  }

  private noIngredients(recipe: Partial<Recipe>) {
    return recipe.ingredients!.length === 1 && !recipe.ingredients![0].text;
  }

  private uploadImages(recipeId: string, recipeImages: (RecipeImage | null)[]) {
    const uploadTasks = this.recipeService
      .uploadImages(recipeId, recipeImages)
      .map((task, idx) =>
        task.pipe(
          catchError(async (e) => {
            console.error(e);
            const toast = await this.toastController.create({
              message: `Échec lors de la sauvegarde de l\'image ${idx + 1}`,
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          })
        )
      );
    let uploads$: Observable<unknown> = of(undefined);
    if (uploadTasks.length) {
      this.loadingElement.message = 'Sauvegarde des images';
      uploads$ = forkJoin(uploadTasks);
    }
    return uploads$;
  }

  private async updateUILoadingState(isLoading: boolean) {
    if (isLoading) {
      this.isWorking = true;
      this.loadingElement.present();
    } else {
      this.isWorking = false;
      this.loadingElement.dismiss();
    }
    this.cd.markForCheck();
  }

  private buildRecipeFromForm(): Partial<Recipe> {
    const rawRecipe = this.recipeForm.value;
    const tags: string[] = rawRecipe.tags
      ? rawRecipe.tags.split(',').map((tag: string) => tag.trim())
      : [];
    return {
      title: rawRecipe.title,
      category: rawRecipe.category,
      ingredients: rawRecipe.ingredients,
      directives: rawRecipe.directives,
      timeToPrepare: rawRecipe.timeToPrepare,
      cookTime: rawRecipe.cookTime,
      servingCount: rawRecipe.servingCount,
      tags,
      showInPublicList: rawRecipe.showInPublicList,
      source: rawRecipe.source,
    };
  }

  private setRecipeToForm(recipe: Recipe) {
    this.recipeForm.reset(
      {
        title: recipe.title,
        category: recipe.category,
        images: [...recipe.imageNames],
        ingredients: [
          ...recipe.ingredients.filter((ingredient) => !!ingredient),
        ],
        directives: [...recipe.directives.filter((directive) => !!directive)],
        rating: recipe.rating,
        timeToPrepare: recipe.timeToPrepare,
        cookTime: recipe.cookTime,
        servingCount: recipe.servingCount,
        tags: recipe.tags.join(', '),
        source: recipe.source,
        showInPublicList: recipe.showInPublicList,
      },
      { emitEvent: false }
    );
    this.disableForm = false;
    this.cd.markForCheck();
    this.formUndoRedoService.clear();
  }

  private async confirmDialog(header: string, message: string) {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Non',
            handler: () => resolve(false),
          },
          {
            text: 'Oui',
            handler: () => resolve(true),
          },
        ],
      });
      await alert.present();
    });
  }

  private removeEmptyIngredients(recipe: Partial<Recipe>) {
    recipe.ingredients = recipe.ingredients!.filter(
      (ingredient) => ingredient.text
    );
  }
}
