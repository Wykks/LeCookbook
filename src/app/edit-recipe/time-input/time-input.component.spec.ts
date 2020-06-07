import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { TimeInputComponent } from './time-input.component';

describe('TimeInputComponent', () => {
  let spectator: Spectator<TimeInputComponent>;
  const createComponent = createComponentFactory(TimeInputComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
