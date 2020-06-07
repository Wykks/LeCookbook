import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-register-index',
  templateUrl: './register-index.component.html',
  styleUrls: ['./register-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterIndexComponent {
  registerForm = this.fb.group({
    username: [''],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required, this.matchValues()]],
  });

  private sub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private angularFireAuth: AngularFireAuth,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    this.sub.add(
      this.registerForm.controls.password.valueChanges.subscribe(() => {
        this.registerForm.controls.confirm.updateValueAndValidity();
      })
    );
    this.sub.add(
      this.registerForm.statusChanges.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }

  ionViewWillLeave() {
    this.sub.unsubscribe();
  }

  matchValues(): (AbstractControl: FormControl) => ValidationErrors | null {
    return (control: FormControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent as FormGroup).controls.password.value
        ? null
        : { doesntMatch: true };
    };
  }

  async register() {
    if (!this.registerForm.valid) {
      return;
    }
    const { username, email, password } = this.registerForm.value;
    await this.angularFireAuth.createUserWithEmailAndPassword(email, password);
    try {
      await this.userService.setUsername(username);
    } catch (e) {
      console.error(e);
    }
  }
}
