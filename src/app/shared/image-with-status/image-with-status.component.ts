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
  EventEmitter,
  Input,
  Output,
  HostBinding,
} from '@angular/core';
import { Subject, timer } from 'rxjs';
import { mapTo, takeUntil, tap } from 'rxjs/operators';

export interface ImageUrl {
  webp: string;
  jpeg: string;
}

@Component({
  selector: 'app-image-with-status',
  template: `
    <picture *ngIf="imgUrl">
      <source type="image/webp" [srcset]="imgUrl.webp" />
      <img
        [alt]="imgAlt"
        [src]="imgUrl.jpeg"
        (error)="onError($event)"
        (load)="onLoaded()"
        loading="lazy"
        [width]="imgWidth"
        [height]="imgHeight"
      />
    </picture>
    <img
      *ngIf="imgSrc"
      [alt]="imgAlt"
      [src]="imgSrc"
      (error)="onError($event)"
      (load)="onLoaded()"
      loading="lazy"
      [width]="imgWidth"
      [height]="imgHeight"
    />
    <div class="loading" *ngIf="(showLoading$ | async) && !loaded">
      <ion-spinner></ion-spinner>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        color: transparent;
        opacity: var(--image-with-status-opacity);
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
      transition('false => true', animate(150)),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageWithStatusComponent {
  @Input() imgSrc: string;
  @Input() imgUrl: ImageUrl;
  @Input() imgAlt: string;
  @Input() imgWidth: number;
  @Input() imgHeight: number;

  @Output() load = new EventEmitter();

  @HostBinding('@.disabled') disableAnimation = true;
  @HostBinding('@fadeIn') loaded = false;
  done$ = new Subject();
  showLoading$ = timer(150).pipe(
    tap(() => {
      this.disableAnimation = false;
    }),
    mapTo(true),
    takeUntil(this.done$)
  );

  onError(e: any) {
    console.error('img error', e);
    this.done$.next(true);
  }

  onLoaded() {
    this.loaded = true;
    this.done$.next(true);
    this.load.emit();
  }
}
