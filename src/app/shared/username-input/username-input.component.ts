import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  Validators,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { of, Subscription, timer } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'app-username-input',
  template: `
    <ion-item>
      <ion-label position="floating">Nom d'utilisateur</ion-label>
      <ion-input
        #input
        [disabled]="isDisabled"
        autocapitalize="on"
        type="text"
        [value]="value"
        (ionInput)="onInput($event)"
      ></ion-input>
      <ion-spinner
        *ngIf="ngControl.pending"
        class="ion-align-self-end"
        slot="end"
      ></ion-spinner>
      <ion-icon
        *ngIf="ngControl.valid"
        name="checkmark"
        class="ion-align-self-end"
        color="success"
        slot="end"
      ></ion-icon>
      <ion-icon
        *ngIf="ngControl.hasError('usernameTaken')"
        name="alert"
        class="ion-align-self-end"
        color="danger"
        slot="end"
      ></ion-icon>
    </ion-item>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsernameInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @ViewChild('input') input: IonInput;

  isDisabled = false;
  value?: string;
  private onChange: (val: string) => void;
  private sub = new Subscription();

  constructor(
    @Self() public ngControl: NgControl,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit() {
    const control = this.ngControl.control!;
    control.setValidators([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(/^[a-z0-9]+$/i),
    ]);
    control.setAsyncValidators((c: AbstractControl) =>
      this.userService.getCurrentUsername().pipe(
        switchMap((currentUsername) => {
          if (currentUsername === c.value) {
            return of(null);
          }
          return timer(250).pipe(
            switchMap(() => this.userService.isUsernameFree(c.value)),
            map((isUsernameFree) =>
              isUsernameFree ? null : { usernameTaken: true }
            )
          );
        })
      )
    );
    control.updateValueAndValidity();
    this.sub.add(
      this.ngControl
        .statusChanges!.pipe(distinctUntilChanged())
        .subscribe(() => this.cd.markForCheck())
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn: (val: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.cd.markForCheck();
  }

  onInput(event: Event) {
    this.onChange((<any>event.target!).value);
  }
}
