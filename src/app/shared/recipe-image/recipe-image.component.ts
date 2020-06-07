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
import { Recipe } from 'models/recipe';
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
    <app-image-with-status
      [imgSrc]="mainImageUrl"
      [imgAlt]="recipe.title"
      [ngClass]="{
        visible: currentImageUrl === mainImageUrl,
        animated: animating
      }"
      (load)="onLoaded()"
    ></app-image-with-status>
    <div *ngIf="hoveredAtLeastOnce">
      <img
        class="overlay"
        *ngFor="let imageUrl of otherImageUrls; let idx = index"
        [src]="imageUrl"
        [alt]="recipe.title + ' ' + (idx + 2)"
        [ngClass]="{
          visible: currentImageUrl === imageUrl,
          animated: animating
        }"
        (load)="onLoaded()"
      />
    </div>
  `,
  styleUrls: ['./recipe-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeImageComponent implements OnChanges, OnInit, OnDestroy {
  @Input() recipe: Recipe;
  @Input() container?: ElementRef;
  @Input() disableHoverAnimation = false;

  @HostBinding('class.hidden') hidden = false;

  mainImageUrl: string;
  otherImageUrls: string[];
  processingInProgress = false;
  hoveredAtLeastOnce = false;
  currentImageUrl: string;
  animating = false;
  loadedImgNumber = new BehaviorSubject(0);

  private sub = new Subscription();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.recipe) {
      const imageNames = this.recipe.imageNames.filter(
        (imageName): imageName is string => !!imageName
      );
      if (!imageNames.length) {
        this.hidden = true;
        return;
      }
      if (imageNames.length && !this.recipe.imageUrlByName) {
        this.processingInProgress = true;
        return;
      }
      const imageUrls = imageNames
        .map((imageName) => this.recipe.imageUrlByName![imageName])
        .filter((imageUrl): imageUrl is string => !!imageUrl);
      this.mainImageUrl = imageUrls[0];
      this.currentImageUrl = this.mainImageUrl;
      this.otherImageUrls = imageUrls.slice(1);
    }
  }

  ngOnInit() {
    if (!this.disableHoverAnimation || this.hidden || !this.container) {
      return;
    }
    const enter = fromEvent(this.container!.nativeElement, 'mouseenter').pipe(
      tap(() => {
        this.hoveredAtLeastOnce = true;
        this.animating = true;
        this.cd.markForCheck();
      })
    );
    const leave = fromEvent(this.container!.nativeElement, 'mouseleave').pipe(
      tap(() => {
        this.currentImageUrl = this.mainImageUrl;
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
          (loadedImgNumber) =>
            loadedImgNumber === this.otherImageUrls.length + 1
        ),
        switchMap(() => interval(1000).pipe(startWith(undefined))),
        auditTime(0, animationFrameScheduler),
        scan((acc) => {
          acc += 1;
          if (acc > this.otherImageUrls.length) {
            acc = 0;
          }
          return acc;
        }, 0),
        takeUntil(leave),
        repeat()
      )
      .subscribe((currentIdx) => {
        this.currentImageUrl =
          currentIdx === 0
            ? this.mainImageUrl
            : this.otherImageUrls[currentIdx - 1];
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
