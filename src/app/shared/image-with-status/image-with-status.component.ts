import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, of, timer } from 'rxjs';
import { mapTo, switchMap, shareReplay, take } from 'rxjs/operators';

@Component({
  selector: 'app-image-with-status',
  template: `
    <ion-img
      [@.disabled]="disableAnimation"
      [@fadeIn]="loaded"
      [alt]="imgAlt"
      [src]="imgSrc"
      (ionError)="onError($event)"
      (ionImgWillLoad)="isLoading$.next(true)"
      (ionImgDidLoad)="onLoaded()"
    ></ion-img>
    <div class="loading" *ngIf="showLoading$ | async">
      <ion-spinner></ion-spinner>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      ion-img {
        object-fit: cover;
        height: 100%;
        color: transparent;
        opacity: var(--image-with-status-opacity) !important;
        transition: var(--image-with-status-transition);
        will-change: var(--image-with-status-will-change);
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
  animations: [
    trigger('fadeIn', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false => true', animate(100)),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageWithStatusComponent {
  @Input() imgSrc: string;
  @Input() imgAlt: string;

  @Output() load = new EventEmitter();

  disableAnimation = false;
  isLoading$ = new BehaviorSubject(false);
  showLoading$ = this.isLoading$.asObservable().pipe(
    switchMap((isLoading) =>
      isLoading ? timer(250).pipe(mapTo(true)) : of(false)
    ),
    shareReplay(1)
  );
  loaded = false;

  onError(e: any) {
    console.error('img error', e);
    this.isLoading$.next(false);
  }

  onLoaded() {
    this.showLoading$.pipe(take(1)).subscribe((shouldShowLoading) => {
      if (!shouldShowLoading) {
        // Do not animate if we didn't show the loader
        this.disableAnimation = true;
      }
      this.loaded = true;
      this.isLoading$.next(false);
      this.load.emit();
    });
  }
}
