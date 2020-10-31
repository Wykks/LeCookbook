import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-cookbook-page',
  template: `
    <ion-header
      [translucent]="true"
      [ngClass]="{ 'ion-no-border': toolbarTransparent }"
    >
      <ion-toolbar
        #toolbar
        [ngClass]="{ transparent: isTransparent, absolute: toolbarTransparent }"
      >
        <ion-buttons *ngIf="!noMenuButton" slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title *ngIf="showTitleInHeader">{{ pageTitle }}</ion-title>
        <ng-content select="[pageToolbar]"></ng-content>
      </ion-toolbar>
    </ion-header>

    <ion-content
      [scrollEvents]="true"
      (ionScroll)="onScroll($event)"
      [fullscreen]="true"
    >
      <ion-header *ngIf="!toolbarTransparent" collapse="condense">
        <ion-toolbar>
          <ion-title size="large"> {{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ng-content select="[pageContent]"></ng-content>
    </ion-content>
  `,
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements AfterViewInit, OnChanges {
  @Input() pageTitle: string | null;
  @Input() toolbarTransparent: boolean | null = false;
  @Input() noMenuButton = false;
  @Input() showTitleInHeader = true;

  @ViewChild('toolbar', { read: ElementRef }) toolbar: ElementRef<HTMLElement>;

  isTransparent = false;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.isTransparent = !!this.toolbarTransparent;
  }

  onScroll(e: Event) {
    if (!this.toolbarTransparent) {
      return;
    }
    if ((<CustomEvent>e).detail.scrollTop > 100) {
      this.isTransparent = false;
    } else {
      this.isTransparent = true;
    }
  }

  ngAfterViewInit(): void {
    // Ionic hack to set transition to toolbar background
    if (this.toolbarTransparent) {
      setTimeout(() => {
        const toolbarBackground = this.toolbar.nativeElement.shadowRoot!.querySelector(
          '.toolbar-background'
        );
        this.renderer.setStyle(
          toolbarBackground,
          'transition',
          'all 0.2s ease-in-out'
        );
      });
    }
  }
}
