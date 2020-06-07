import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { RouterDirection } from '@ionic/core';
import { IonMenu } from '@ionic/angular';

@Component({
  selector: 'app-layout-menu-item',
  template: `
    <ion-item
      *ngIf="link"
      routerDirection="root"
      [routerLink]="link"
      routerLinkActive="selected"
      [routerDirection]="routerDirection ? routerDirection : 'root'"
      [detail]="false"
      (click)="onClick()"
    >
      <ng-container *ngTemplateOutlet="itemContent"></ng-container>
    </ion-item>
    <ion-item
      *ngIf="!link"
      [button]="true"
      (click)="onClick()"
      [detail]="false"
    >
      <ng-container *ngTemplateOutlet="itemContent"></ng-container>
    </ion-item>
    <ng-template #itemContent>
      <ion-icon
        slot="start"
        [ios]="itemIcon + '-outline'"
        [md]="itemIcon + '-sharp'"
      ></ion-icon>
      <ion-label>{{ itemLabel }}</ion-label>
    </ng-template>
  `,
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {
  @Input() itemIcon: string;
  @Input() itemLabel: string;
  @Input() link?: string;
  @Input() routerDirection?: RouterDirection;

  @Output() itemClick = new EventEmitter<void>();

  constructor(private menu: IonMenu) {}

  onClick() {
    this.itemClick.emit();
    this.menu.setOpen(false);
  }
}
