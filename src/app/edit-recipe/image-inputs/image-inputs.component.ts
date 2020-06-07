import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

export const EMPTY_IMAGES = [null, null, null, null, null];

@Component({
  selector: 'app-edit-recipe-image-inputs',
  template: `
    <app-edit-recipe-image-input
      *ngFor="
        let imageNameOrAsBase64 of imagesNameOrAsBase64;
        let idx = index;
        trackBy: trackByIndex
      "
      [recipeId]="recipeId"
      [imageNameOrAsBase64]="imageNameOrAsBase64"
      (imageChange)="onImageChange(idx, $event)"
    ></app-edit-recipe-image-input>
  `,
  styleUrls: ['./image-inputs.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageInputsComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputsComponent implements ControlValueAccessor, OnDestroy {
  @Input() recipeId?: string;

  imagesNameOrAsBase64: (string | null)[] = EMPTY_IMAGES;

  private sub = new Subscription();
  private onChange: (imagesNameOrAsBase64: (string | null)[]) => void;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  writeValue(imagesNameOrAsBase64: (string | null)[]): void {
    this.imagesNameOrAsBase64 = imagesNameOrAsBase64;
    this.cd.markForCheck();
  }

  registerOnChange(
    fn: (imagesNameOrAsBase64: (string | null)[]) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  onImageChange(idx: number, imageNameOrAsBase64: string | null) {
    this.imagesNameOrAsBase64[idx] = imageNameOrAsBase64;
    this.onChange(this.imagesNameOrAsBase64);
  }

  trackByIndex(index: number) {
    return index;
  }
}
