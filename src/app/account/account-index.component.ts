import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Config,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { UserService } from '../core/user.service';
import { take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-account-index',
  templateUrl: './account-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountIndexComponent {
  accountForm = this.fb.group({
    username: [''],
    email: ['', Validators.email],
    password: ['', Validators.minLength(6)],
  });
  ios = this.config.get('mode') === 'ios';
  mobile = this.platform.is('mobile');
  isWorking = false;

  private loadingElement: HTMLIonLoadingElement;
  private currentUsername: string | null;

  constructor(
    private fb: FormBuilder,
    private angularFireAuth: AngularFireAuth,
    private config: Config,
    private platform: Platform,
    private cd: ChangeDetectorRef,
    private toastController: ToastController,
    private userService: UserService,
    private loadingController: LoadingController
  ) {}

  async ionViewWillEnter() {
    combineLatest([
      this.userService.getCurrentUsername(),
      this.userService.getCurrentUser(),
    ])
      .pipe(take(1))
      .subscribe(([currentUsername, currentUser]) => {
        this.currentUsername = currentUsername;
        this.accountForm.reset({
          username: currentUsername,
          email: currentUser!.email,
          password: '',
        });
      });
  }

  async update() {
    const user = (await this.angularFireAuth.currentUser)!;
    const { username, email, password } = this.accountForm.value;
    const promises = [];
    if (email && user.email !== email) {
      promises.push(user.updateEmail(email));
    }
    if (username && this.currentUsername !== username) {
      promises.push(this.userService.setUsername(username));
    }
    if (password) {
      promises.push(user.updatePassword(password));
    }
    if (promises.length) {
      this.isWorking = true;
      this.loadingElement = await this.loadingController.create({
        message: 'Sauvegarde',
      });
      this.loadingElement.present();
      this.cd.markForCheck();
      try {
        await Promise.all(promises);
        const toast = await this.toastController.create({
          message: 'Compte mis à jour',
          duration: 2000,
          color: 'success',
        });
        toast.present();
      } catch (e) {
        const toast = await this.toastController.create({
          message: 'Echec de mise à jour',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      } finally {
        this.isWorking = false;
        this.loadingElement.dismiss();
        this.cd.markForCheck();
      }
    }
  }
}
