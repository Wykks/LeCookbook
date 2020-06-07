import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VERSION } from 'src/version';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-index',
  template: `<app-cookbook-page pageTitle="A propos">
    <div class="ion-margin" pageContent>
      <p>
        Version: ${VERSION}<strong *ngIf="suffix">{{ suffix }}</strong>
      </p>
      <p>
        Made with <ion-icon name="heart"></ion-icon> by <strong>Wykks</strong>
      </p>
      <ion-chip
        color="dark"
        button
        (click)="open('https://github.com/Wykks/LeCookbook')"
      >
        <ion-icon name="logo-github"></ion-icon>
        <ion-label>GitHub</ion-label>
      </ion-chip>
    </div>
  </app-cookbook-page>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutIndexComponent {
  suffix = environment.production ? '' : '-staging';

  open(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  }
}
