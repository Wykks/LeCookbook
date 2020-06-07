import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Config,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-choose-username-index',
  template: `
    <app-cookbook-page pageTitle="Finalization">
      <ion-buttons pageToolbar slot="end">
        <ion-button
          *ngIf="mobile"
          [disabled]="!form.valid || isWorking"
          (click)="onSubmit()"
        >
          <span *ngIf="ios">Sauvegarder</span>
          <span *ngIf="!ios">
            <ion-icon slot="icon-only" name="save"></ion-icon>
          </span>
        </ion-button>
      </ion-buttons>
      <ion-buttons pageToolbar slot="start">
        <ion-back-button defaultHref="/"></ion-back-button>
      </ion-buttons>
      <form [formGroup]="form" pageContent (ngSubmit)="onSubmit()">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col
              class="ion-align-self-center"
              size-lg="3"
              size-md="6"
              size-xs="12"
            >
              <h1>Choisissez un nom d'utilisateur</h1>
              <app-username-input
                formControlName="username"
              ></app-username-input>
              <div class="ion-padding">
                <ion-button
                  size="large"
                  type="submit"
                  [disabled]="!form.valid || isWorking"
                  expand="block"
                >
                  Sauvegarder
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </app-cookbook-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseUsernameIndexComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    username: [''],
  });
  ios = this.config.get('mode') === 'ios';
  mobile = this.platform.is('mobile');
  isWorking = false;
  targetPath: string;

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private fb: FormBuilder,
    private config: Config,
    private platform: Platform,
    private userService: UserService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private cd: ChangeDetectorRef,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const targetPath = this.activatedRoute.snapshot.queryParamMap.get('p');
    if (!targetPath) {
      this.navController.navigateRoot('/', { replaceUrl: true });
      return;
    }
    this.targetPath = targetPath;
  }

  ngOnDestroy() {
    if (this.loadingElement) {
      this.loadingElement.dismiss();
    }
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.isWorking = true;
    this.loadingElement = await this.loadingController.create({
      message: 'Sauvegarde',
    });
    this.loadingElement.present();
    this.cd.markForCheck();
    try {
      await this.userService.setUsername(this.form.value.username);
    } catch (e) {
      console.error(e);
      const toast = await this.toastController.create({
        message: 'Échec de sauvegarde',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      this.isWorking = false;
      this.loadingElement.dismiss();
      this.cd.markForCheck();
    }
    this.navigateToTarget();
  }

  private navigateToTarget() {
    this.navController.navigateBack(this.targetPath, { replaceUrl: true });
  }
}
