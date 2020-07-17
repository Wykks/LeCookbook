import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Image, Recipe, IMAGE_HEIGHT, IMAGE_WIDTH } from 'models/recipe';
import {
  animationFrameScheduler,
  BehaviorSubject,
  fromEvent,
  interval,
  Subscription,
} from 'rxjs';
import {
  auditTime,
  filter,
  repeat,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-recipe-image',
  template: `
    <div class="processing overlay" *ngIf="processingInProgress">
      Traitement de l'image en cours...
    </div>
    <app-image-with-status
      *ngIf="mainImage"
      [imgUrl]="{
        webp: isThumbnail ? mainImage.thumbnail_webp : mainImage.webp,
        jpeg: isThumbnail ? mainImage.thumbnail_jpeg : mainImage.jpeg
      }"
      [imgAlt]="recipe.title"
      [imgWidth]="IMAGE_WIDTH"
      [imgHeight]="IMAGE_HEIGHT"
      [ngClass]="{
        visible: currentImage === mainImage,
        animated: animating
      }"
      (load)="onLoaded()"
    ></app-image-with-status>
    <div *ngIf="hoveredAtLeastOnce">
      <picture *ngFor="let image of otherImages; let idx = index">
        <source
          type="image/webp"
          [srcset]="isThumbnail ? image.thumbnail_webp : image.webp"
        />
        <img
          class="overlay"
          [src]="isThumbnail ? image.thumbnail_jpeg : image.jpeg"
          [alt]="recipe.title + ' ' + (idx + 2)"
          [ngClass]="{
            visible: currentImage === image,
            animated: animating
          }"
          (load)="onLoaded()"
          [width]="IMAGE_WIDTH"
          [height]="IMAGE_HEIGHT"
        />
      </picture>
    </div>
  `,
  styleUrls: ['./recipe-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeImageComponent implements OnChanges, OnInit, OnDestroy {
  @Input() recipe: Recipe;
  @Input() container?: ElementRef;
  @Input() disableHoverAnimation = false;
  @Input() isThumbnail = false;

  @HostBinding('class.hidden') hidden = false;
  @HostBinding('class.animated') animated = false;

  mainImage: Image | undefined;
  otherImages: Image[] | undefined;
  processingInProgress = false;
  hoveredAtLeastOnce = false;
  currentImage: Image | undefined;
  animating = false;
  loadedImgNumber = new BehaviorSubject(0);

  IMAGE_WIDTH = IMAGE_WIDTH;
  IMAGE_HEIGHT = IMAGE_HEIGHT;

  private sub = new Subscription();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this.animated = !this.disableHoverAnimation;
    if (changes.recipe) {
      this.mainImage = undefined;
      this.currentImage = undefined;
      this.otherImages = undefined;
      this.processingInProgress = false;
      const imageNames = this.recipe.imageNames.filter(
        (imageName): imageName is string => !!imageName
      );
      if (!imageNames.length) {
        this.hidden = true;
        return;
      }
      if (
        imageNames.length &&
        (!this.recipe.imageByName ||
          !Object.keys(this.recipe.imageByName).length)
      ) {
        this.processingInProgress = true;
        return;
      }

      const images = imageNames
        .map((imageName) => this.recipe.imageByName![imageName])
        .filter((image) => !!image);
      this.mainImage = images[0];
      this.currentImage = this.mainImage;
      this.otherImages = images.slice(1);
    }
  }

  ngOnInit() {
    if (this.disableHoverAnimation || this.hidden || !this.container) {
      return;
    }
    const enter = fromEvent(this.container!.nativeElement, 'mouseenter').pipe(
      filter(() => !!this.otherImages && !!this.otherImages.length),
      tap(() => {
        this.hoveredAtLeastOnce = true;
        this.animating = true;
        this.cd.markForCheck();
      })
    );
    const leave = fromEvent(this.container!.nativeElement, 'mouseleave').pipe(
      tap(() => {
        this.currentImage = this.mainImage;
        this.animating = false;
        // Ionic detach this component from cd when navigating forward
        // so we need to manually run cd to reset to current image
        this.cd.detectChanges();
      })
    );
    const sub = enter
      .pipe(
        switchMap(() => this.loadedImgNumber),
        filter(
          (loadedImgNumber) => loadedImgNumber === this.otherImages!.length + 1
        ),
        switchMap(() => interval(1000).pipe(startWith(undefined))),
        auditTime(0, animationFrameScheduler),
        scan((acc) => {
          acc += 1;
          if (acc > this.otherImages!.length) {
            acc = 0;
          }
          return acc;
        }, 0),
        takeUntil(leave),
        repeat()
      )
      .subscribe((currentIdx) => {
        this.currentImage =
          currentIdx === 0 ? this.mainImage : this.otherImages![currentIdx - 1];
        this.cd.markForCheck();
      });
    this.sub.add(sub);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onLoaded() {
    this.loadedImgNumber.next(this.loadedImgNumber.value + 1);
  }
}
