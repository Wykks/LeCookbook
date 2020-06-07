import { ElementRef, Directive } from '@angular/core';

@Directive({
  selector: '[appElementRef]',
  exportAs: 'appElementRef',
})
export class ElementRefDirective<T> extends ElementRef<T> {
  constructor(elementRef: ElementRef<T>) {
    super(elementRef.nativeElement);
  }
}
