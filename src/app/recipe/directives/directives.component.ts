import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-directives',
  template: `
    <h2 [ngClass]="{ 'ion-text-center': centerTitle }">
      Instructions
    </h2>
    <ion-list lines="none">
      <ion-item *ngFor="let directive of directives">{{ directive }}</ion-item>
    </ion-list>
  `,
  styles: [
    `
      h2 {
        margin-top: 0px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivesComponent {
  @Input() directives: string[];
  @Input() centerTitle = true;
}
