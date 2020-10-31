import { Component, Input } from '@angular/core';

// tslint:disable-next-line: prefer-on-push-component-change-detection
@Component({
  selector: '[disableForm]',
  styles: [
    `
      fieldset {
        display: block;
        margin: unset;
        padding: unset;
        border: unset;
      }
    `,
  ],
  template: `
    <fieldset [disabled]="disableForm">
      <ng-content></ng-content>
    </fieldset>
  `,
})
export class DisableFormComponent {
  @Input() disableForm: boolean;
}
