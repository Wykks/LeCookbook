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
  ControlValueAccessor,
  FormArray,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IonTextarea } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { delay, filter, first } from 'rxjs/operators';
import { parseDirectivesFromClipboard } from './parse-directives-from-clipboard';

@Component({
  selector: 'app-edit-recipe-directives-input',
  templateUrl: './directives-input.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      ion-button.add {
        align-self: flex-end;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DirectivesInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivesInputComponent
  implements ControlValueAccessor, OnDestroy {
  @ViewChildren('input') inputs: QueryList<IonTextarea>;

  directivesForm = new FormArray([]);

  private sub = new Subscription();
  private programInsertInProgress = false;

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  writeValue(directives: string[]): void {
    this.directivesForm.controls = [];
    if (!directives.length) {
      this.programInsertInProgress = true;
      this.addDirectiveAtEnd();
      this.programInsertInProgress = false;
    } else {
      this.insertMultipleDirectives(directives);
    }
    this.cd.markForCheck();
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.sub.add(
      this.directivesForm.valueChanges
        .pipe(filter(() => !this.programInsertInProgress))
        .subscribe((directives: string[]) =>
          fn(directives.filter((directive) => !!directive))
        )
    );
  }

  registerOnTouched() {}

  addDirectiveAtEnd() {
    this.addDirectiveAt(this.directivesForm.controls.length);
  }

  deleteDirectiveIfEmpty(index: number, event?: Event) {
    if (index === 0) {
      return;
    }
    if (!this.directivesForm.controls[index].value) {
      if (event) {
        event.preventDefault();
      }
      this.deleteDirective(index);
      this.focusInput(index - 1);
    }
  }

  async deleteDirectiveBelowIfCursorLastPos(formIndex: number, event: Event) {
    if (formIndex < 0 || formIndex >= this.directivesForm.controls.length) {
      return;
    }
    const input = await this.inputs.toArray()[formIndex].getInputElement();
    if (input.value.length === input.selectionStart) {
      event.preventDefault();
      this.deleteDirective(formIndex + 1);
      this.cd.markForCheck(); // Because getInputElement is async
    }
  }

  addDirectiveAt(index: number, directive: string = '') {
    this.directivesForm.insert(index, new FormControl(directive));
    if (this.programInsertInProgress) {
      return;
    }
    this.focusInput(index);
  }

  deleteDirective(index: number) {
    this.directivesForm.removeAt(index);
  }

  focusInput(formIndex: number) {
    if (formIndex < 0 || formIndex >= this.directivesForm.controls.length) {
      return;
    }
    // Wait angular render
    this.zone.onStable.pipe(first(), delay(0)).subscribe(() => {
      this.inputs.toArray()[formIndex].setFocus();
    });
  }

  onPasteDirectives(index: number, event: ClipboardEvent) {
    event.preventDefault();
    const directives = parseDirectivesFromClipboard(event);
    this.insertMultipleDirectives(directives, index);
  }

  private insertMultipleDirectives(directives: string[], startIndex = 0) {
    this.programInsertInProgress = true;
    const firstDirective = directives.shift()!;
    const currentInput = this.directivesForm.controls[startIndex];
    currentInput.setValue(
      currentInput.value
        ? `${currentInput.value} ${firstDirective}`
        : firstDirective
    );
    directives.forEach((directive, idx) => {
      this.addDirectiveAt(startIndex + idx + 1, directive);
    });
    this.programInsertInProgress = false;
    this.directivesForm.updateValueAndValidity();
  }
}
