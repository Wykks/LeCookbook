import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Recipe } from 'models/recipe';

@Component({
  selector: 'cookbook-list-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  @Input() recipe: Recipe;

  @HostListener('click') onClick() {
    this.navController.navigateForward(`/recipe/${this.recipe.id}`);
  }

  constructor(private navController: NavController) {}
}
