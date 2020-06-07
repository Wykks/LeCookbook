import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-loading-or-error',
  template: `
    <ion-spinner
      *ngIf="!errorType && (showLoading$ | async)"
      color="primary"
    ></ion-spinner>
    <div *ngIf="errorType">
      <p>{{ errorMessage }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      ion-spinner {
        width: 10%;
        height: 10%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOrErrorComponent {
  @Input() errorType?: 'NOTFOUND' | 'GENERIC';
  @Input() errorMessage? = "Une erreur s'est produite";

  showLoading$ = timer(250).pipe(mapTo(true));
}
