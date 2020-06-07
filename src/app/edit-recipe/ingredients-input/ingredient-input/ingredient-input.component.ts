import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient, IngredientType } from 'models/recipe';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-edit-recipe-ingredient-input',
  template: `
    <ion-input [formControl]="control" [spellcheck]="true"></ion-input>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IngredientInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientInputComponent
  implements ControlValueAccessor, OnDestroy {
  @ViewChild(IonInput) input: IonInput;

  control = new FormControl('');

  private sub = new Subscription();
  private currentType: IngredientType;

  constructor() {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  writeValue(ingredient: Ingredient): void {
    this.control.reset(ingredient.text, { emitEvent: false });
    this.currentType = ingredient.type;
  }

  registerOnChange(fn: (Ingredient: Ingredient) => void): void {
    this.sub.add(
      this.control.valueChanges.subscribe((v) =>
        fn({ text: v, type: this.currentType })
      )
    );
  }

  registerOnTouched() {}

  setDisabledState(isDisabled: boolean) {
    isDisabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  getInputElement() {
    return this.input.getInputElement();
  }

  setFocus() {
    return this.input.setFocus();
  }
}
