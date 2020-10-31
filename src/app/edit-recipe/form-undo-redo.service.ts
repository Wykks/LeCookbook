import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  repeat,
  switchMapTo,
  take,
  tap,
} from 'rxjs/operators';

const MAX_HISTORY_LENGTH = 10;

@Injectable()
export class FormUndoRedoService implements OnDestroy {
  private canUndo = new BehaviorSubject<boolean>(false);
  private canRedo = new BehaviorSubject<boolean>(false);
  private sub = new Subscription();

  canUndo$ = this.canUndo.pipe(distinctUntilChanged());
  canRedo$ = this.canRedo.pipe(distinctUntilChanged());

  private history: object[];
  private currentIndex: number;
  private form: FormGroup;

  constructor(private zone: NgZone) {
    this.sub.add(
      this.zone.runOutsideAngular(() =>
        fromEvent<KeyboardEvent>(document, 'keydown')
          .pipe(
            filter(
              (evt) => (evt.key === 'z' || evt.key === 'y') && evt.ctrlKey
            ),
            take(1),
            tap((evt) => {
              if (evt.key === 'z' && this.canUndo.value) {
                this.zone.run(() => this.undo());
              } else if (evt.key === 'y' && this.canRedo.value) {
                this.zone.run(() => this.redo());
              }
            }),
            switchMapTo(
              fromEvent<KeyboardEvent>(document, 'keyup').pipe(take(1))
            ),
            repeat()
          )
          .subscribe()
      )
    );
  }

  registerForm(form: FormGroup) {
    this.form = form;
    this.clear();
    this.sub.add(
      form.valueChanges
        .pipe(debounceTime(250), distinctUntilChanged())
        .subscribe((c) =>
          this.processNewFormValue(JSON.parse(JSON.stringify(c)))
        )
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  undo() {
    this.currentIndex--;
    this.form.setValue(
      JSON.parse(JSON.stringify(this.history[this.currentIndex])),
      { emitEvent: false }
    );
    if (this.currentIndex === 0) {
      this.canUndo.next(false);
    }
    this.canRedo.next(true);
  }

  redo() {
    this.currentIndex++;
    this.form.setValue(
      JSON.parse(JSON.stringify(this.history[this.currentIndex])),
      { emitEvent: false }
    );
    if (this.currentIndex === this.history.length - 1) {
      this.canRedo.next(false);
    }
    this.canUndo.next(true);
  }

  clear() {
    this.history = [JSON.parse(JSON.stringify(this.form.value))];
    this.currentIndex = 0;
  }

  private processNewFormValue(c: object) {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex] = c;
      this.history.length = this.currentIndex + 1;
    } else {
      this.history.push(c);
      this.currentIndex = this.history.length - 1;
    }
    if (this.history.length > MAX_HISTORY_LENGTH) {
      this.history.shift();
    }
    this.canRedo.next(false);
    this.canUndo.next(true);
  }
}
