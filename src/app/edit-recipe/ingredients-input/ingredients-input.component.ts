import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Ingredient, IngredientType } from 'models/recipe';
import { Subscription } from 'rxjs';
import { delay, filter, first } from 'rxjs/operators';
import { IngredientInputComponent } from './ingredient-input/ingredient-input.component';
import { parseIngredientFromClipboard } from './parse-ingredient-from-clipboard';

export const EMPTY_INGREDIENT: Ingredient = {
  type: IngredientType.INGREDIENT,
  text: '',
};

@Component({
  selector: 'app-edit-recipe-ingredients-input',
  templateUrl: './ingredients-input.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      ion-button.add {
        align-self: flex-end;
      }
      .space-left {
        margin-left: 16px;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IngredientsInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsInputComponent
  implements ControlValueAccessor, OnDestroy {
  @ViewChildren('input') inputs: QueryList<IngredientInputComponent>;

  ingredientsForm = new FormArray([]);

  parentByIngredient = new WeakMap<AbstractControl, AbstractControl | null>();

  IngredientType = IngredientType;

  private sub = new Subscription();
  private programInsertInProgress = false;

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  writeValue(ingredients: Ingredient[]): void {
    if (
      JSON.stringify(ingredients) === JSON.stringify(this.ingredientsForm.value)
    ) {
      return;
    }
    this.programInsertInProgress = true;
    this.ingredientsForm.clear();
    if (!ingredients.length) {
      this.addIngredientAtEnd();
      this.updateParentByIngredient();
      this.programInsertInProgress = false;
    } else {
      this.insertMultipleIngredients(ingredients, { emitEvent: false });
    }
    this.cd.markForCheck();
  }

  registerOnChange(fn: (value: Ingredient[]) => void): void {
    this.sub.add(
      this.ingredientsForm.valueChanges
        .pipe(filter(() => !this.programInsertInProgress))
        .subscribe((ingredients: Ingredient[]) => fn(ingredients))
    );
  }

  registerOnTouched() {}

  addIngredientAtEnd() {
    this.addIngredientAt(this.ingredientsForm.controls.length);
  }

  deleteIngredientIfEmpty(index: number, event?: Event) {
    if (index === 0) {
      if (
        this.ingredientsForm.controls[index].value.type === IngredientType.PART
      ) {
        this.changeIngredientType(index, IngredientType.INGREDIENT);
      }
      return;
    }
    if (!this.ingredientsForm.controls[index].value.text) {
      if (event) {
        event.preventDefault();
      }
      this.deleteIngredient(index);
      this.focusInput(index - 1);
    }
  }

  async deleteIngredientBelowIfCursorLastPos(formIndex: number, event: Event) {
    if (formIndex < 0 || formIndex >= this.ingredientsForm.controls.length) {
      return;
    }
    const input = await this.inputs.toArray()[formIndex].getInputElement();
    if (input.value.length === input.selectionStart) {
      event.preventDefault();
      this.deleteIngredient(formIndex + 1);
      this.cd.markForCheck(); // Because getInputElement is async
    }
  }

  async promoteIngredientIfCursorLastPos(
    inputComp: IngredientInputComponent,
    index: number,
    event: Event
  ) {
    const input = await inputComp.getInputElement();
    if (input.value.length === input.selectionStart) {
      if (event) {
        event.preventDefault();
      }
      if (
        this.ingredientsForm.controls[index].value.type !== IngredientType.PART
      ) {
        this.changeIngredientType(index, IngredientType.PART);
        this.cd.markForCheck(); // Because getInputElement is async
      }
    }
  }

  async downgradeIngredientIfCursorFirstPos(
    inputComp: IngredientInputComponent,
    index: number,
    event: Event
  ) {
    const input = await inputComp.getInputElement();
    if (input.selectionStart === 0) {
      if (event) {
        event.preventDefault();
      }
      if (
        this.ingredientsForm.controls[index].value.type !==
        IngredientType.INGREDIENT
      ) {
        this.changeIngredientType(index, IngredientType.INGREDIENT);
        this.cd.markForCheck(); // Because getInputElement is async
      }
    }
  }

  addIngredientAt(
    index: number,
    event?: Event,
    ingredient: Ingredient = {
      type: IngredientType.INGREDIENT,
      text: '',
    }
  ) {
    if (event) {
      event.preventDefault();
    }
    this.ingredientsForm.insert(index, new FormControl(ingredient));
    if (this.programInsertInProgress) {
      return;
    }
    this.focusInput(index);
    this.updateParentByIngredient();
  }

  deleteIngredient(index: number) {
    this.ingredientsForm.removeAt(index);
    this.updateParentByIngredient();
  }

  changeIngredientType(index: number, type: IngredientType) {
    const ingredient: Ingredient = {
      ...this.ingredientsForm.controls[index].value,
      type,
    };
    this.ingredientsForm.controls[index].setValue(ingredient);
    const nextIngredient = this.ingredientsForm.controls[index + 1];
    if (
      type === IngredientType.PART &&
      (!nextIngredient ||
        (nextIngredient && nextIngredient.value.type === IngredientType.PART))
    ) {
      this.addIngredientAt(index + 1);
    }
    this.updateParentByIngredient();
  }

  focusInput(formIndex: number) {
    if (formIndex < 0 || formIndex >= this.ingredientsForm.controls.length) {
      return;
    }
    // Wait angular render
    this.zone.onStable.pipe(first(), delay(0)).subscribe(() => {
      this.inputs.toArray()[formIndex].setFocus();
    });
  }

  onPasteIngredients(index: number, event: ClipboardEvent) {
    event.preventDefault();
    const ingredients = parseIngredientFromClipboard(event);
    this.insertMultipleIngredients(ingredients, { startIndex: index });
  }

  private insertMultipleIngredients(
    ingredients: Ingredient[],
    options: { startIndex?: number; emitEvent?: boolean }
  ) {
    this.programInsertInProgress = true;
    let startIndex = options.startIndex ? options.startIndex : 0;
    if (this.ingredientsForm.controls.length) {
      const firstIngredient = ingredients.shift()!;
      const currentInput = this.ingredientsForm.controls[startIndex];
      const currentInputText = currentInput.value.text
        ? `${currentInput.value.text} ${firstIngredient.text}`
        : firstIngredient.text;
      currentInput.setValue({
        type: firstIngredient.type,
        text: currentInputText,
      });
      startIndex++;
    }
    ingredients.forEach((ingredient, idx) => {
      this.addIngredientAt(startIndex + idx, undefined, ingredient);
    });
    this.updateParentByIngredient();
    this.programInsertInProgress = false;
    this.ingredientsForm.updateValueAndValidity({
      emitEvent: options.emitEvent,
    });
  }

  private updateParentByIngredient() {
    let currentParent: AbstractControl | null = null;
    this.parentByIngredient = new WeakMap<
      AbstractControl,
      AbstractControl | null
    >();
    this.ingredientsForm.controls.map((control) => {
      const ingredient: Ingredient = control.value;
      if (ingredient.type === IngredientType.PART) {
        currentParent = control;
      }
      this.parentByIngredient.set(
        control,
        currentParent === control ? null : currentParent
      );
    });
  }
}
