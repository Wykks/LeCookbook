import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  ControlValueAccessor,
  Validator,
  ValidationErrors,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-recipe-time-input',
  template: `
    <ion-grid [formGroup]="timeForm">
      <ion-row class="ion-align-items-baseline">
        <ion-col size="10">
          <ion-label> {{ label }}</ion-label>
        </ion-col>
        <ion-col size="4">
          <ion-item>
            <ion-input
              formControlName="hours"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
            ></ion-input>
          </ion-item>
        </ion-col>
        <ion-col size="1" class="ion-justify-content-center">
          :
        </ion-col>
        <ion-col size="4">
          <ion-item>
            <ion-input
              formControlName="min"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      ion-grid {
        padding-left: 0px;
        --ion-grid-columns: 19;
        --ion-grid-column-padding: 0px;
      }
      ion-col {
        display: flex;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimeInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TimeInputComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeInputComponent
  implements ControlValueAccessor, Validator, OnDestroy {
  @Input() label: string;

  timeForm = this.fb.group({
    hours: [0, Validators.min(0)],
    min: [0, [Validators.min(0), Validators.max(60)]],
  });

  private sub = new Subscription();

  constructor(private fb: FormBuilder) {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  validate(): ValidationErrors | null {
    return this.timeForm.valid ? null : { invalidTime: true };
  }

  writeValue(value: number): void {
    const { hours, min } = this.minToForm(value);
    this.timeForm.reset(
      {
        hours,
        min,
      },
      { emitEvent: false }
    );
  }

  registerOnChange(fn: (value: number) => void): void {
    this.sub.add(
      this.timeForm.valueChanges.subscribe(() => fn(this.formValueToMin()))
    );
  }

  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean) {
    isDisabled
      ? this.timeForm.disable({ emitEvent: false })
      : this.timeForm.enable({ emitEvent: false });
  }

  private formValueToMin() {
    const { hours, min } = this.timeForm.value;
    return hours * 60 + min;
  }

  private minToForm(value: number) {
    return {
      hours: Math.trunc(value / 60),
      min: value % 60,
    };
  }
}
