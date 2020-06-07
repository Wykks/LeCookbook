import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { NavController, ToastController } from '@ionic/angular';
import { UserService } from '../core/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: './login-index.component.html',
  styleUrls: ['./login-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginIndexComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isWorking = true;

  @ViewChildren('input') inputs: QueryList<any>;

  constructor(
    private fb: FormBuilder,
    private authService: UserService,
    private cd: ChangeDetectorRef,
    private navController: NavController,
    private angularFireAuth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  async ionViewWillEnter() {
    if (await this.alreadyLogged()) {
      this.goToHomePage();
      return;
    }
    this.isWorking = false;
    this.cd.markForCheck();
  }

  async login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAsTouched();
      // Stupid ionic workaround to force error to show
      this.inputs.forEach(async (i) => {
        const input = await i.getInputElement();
        input.focus();
        input.blur();
      });
      return;
    }
    const { email, password } = this.loginForm.value;
    this.isWorking = true;
    this.loginForm.disable({ emitEvent: false });
    try {
      await this.authService.signInWithEmailAndPassword(email, password);
      this.goToHomePage();
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Email / Mot de passe incorrect',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      this.isWorking = false;
      this.loginForm.enable({ emitEvent: false });
      this.cd.markForCheck();
    }
  }

  async loginWithGoogle() {
    this.isWorking = true;
    const googleAuthProvider = new firebase.auth!.GoogleAuthProvider();
    this.loginForm.disable({ emitEvent: false });
    try {
      const userCreds = await this.authService.signInWithPopup(
        googleAuthProvider
      );
      if (userCreds.additionalUserInfo?.isNewUser) {
        await userCreds.user?.updateProfile({ displayName: '' });
      }
      this.goToHomePage();
    } catch (e) {
      if (e.code === 'auth/popup-blocked') {
        await this.authService.signInWithRedirect(googleAuthProvider);
        return;
      }
      console.error(e);
      const message =
        e.code === 'auth/web-storage-unsupported'
          ? 'Connexion bloquée par le navigateur'
          : 'Echec de connexion';
      const toast = await this.toastController.create({
        message,
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      this.isWorking = false;
      this.loginForm.enable({ emitEvent: false });
      this.cd.markForCheck();
    }
  }

  private async alreadyLogged() {
    await this.angularFireAuth.getRedirectResult();
    // Check if we are logged with something else. Must be after getRedirectResult
    const user = await this.angularFireAuth.currentUser;
    return !!user;
  }

  private async goToHomePage() {
    this.navController.navigateForward('/', { replaceUrl: true });
  }
}
