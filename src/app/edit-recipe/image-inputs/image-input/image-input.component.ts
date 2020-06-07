import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Config } from '@ionic/angular';
import { matchBreakpoint } from 'src/app/media';
import { Observable, of } from 'rxjs';
import { RecipeService } from 'src/app/core/recipe/recipe.service';

@Component({
  selector: 'app-edit-recipe-image-input',
  template: `
    <label class="ion-activatable ripple-parent">
      <input (change)="onImageChange($event)" type="file" accept="image/*" />
      <ion-icon
        [size]="smallScreen ? 'default' : 'large'"
        ios="camera-outline"
        md="camera-sharp"
      ></ion-icon>
      <ion-ripple-effect *ngIf="md"></ion-ripple-effect>
    </label>

    <ng-container *ngIf="{ imgSrc: imgSrc$ | async } as context">
      <div *ngIf="isWorking || context.imgSrc" class="overlay">
        <p *ngIf="isWorking">Optimisation...</p>
        <ng-container *ngIf="context.imgSrc">
          <app-image-with-status
            [imgSrc]="context.imgSrc"
          ></app-image-with-status>
          <ion-button
            (click)="removeImage()"
            size="small"
            color="danger"
            class="remove"
          >
            <ion-icon
              slot="icon-only"
              ios="remove-outline"
              md="remove-sharp"
            ></ion-icon>
          </ion-button>
        </ng-container>
      </div>
    </ng-container>
  `,
  styleUrls: ['./image-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent implements OnInit {
  @Input() recipeId?: string;
  @Input()
  set imageNameOrAsBase64(img: string | null) {
    if (!img) {
      this.imgSrc$ = null;
      return;
    }
    if (img.startsWith('data:')) {
      this.imgSrc$ = of(img);
    } else {
      this.imgSrc$ = this.recipeService.getImageFullUrl(this.recipeId!, img);
    }
  }

  @Output() imageChange = new EventEmitter<string | null>();

  md = this.config.get('mode') === 'md';
  smallScreen: boolean;
  imgSrc$: Observable<string> | null = null;
  isWorking = false;

  constructor(
    private recipeService: RecipeService,
    private config: Config,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.smallScreen = !matchBreakpoint('sm');
  }

  onImageChange(event: Event) {
    const input = <HTMLInputElement>event.target!;
    if (input.files && input.files[0]) {
      this.isWorking = true;
      this.cd.markForCheck();
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = await this.compressImage(<string>e.target!.result!);
        this.imageChange.emit(imageBase64);
        this.isWorking = false;
        this.cd.markForCheck();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage() {
    this.imageChange.emit(null);
  }

  private compressImage(imageBase64: string) {
    return new Promise<string>((resolve) => {
      const elem = document.createElement('canvas');
      const ctx = elem.getContext('2d');
      if (!ctx) {
        return imageBase64;
      }
      const img = new Image();
      img.src = imageBase64;
      img.onload = () => {
        elem.width = img.width;
        elem.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(ctx.canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  }
}
