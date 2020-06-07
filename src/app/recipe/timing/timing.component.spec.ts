import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { TimingComponent } from './timing.component';

describe('TimingComponent', () => {
  let spectator: Spectator<TimingComponent>;
  const createComponent = createComponentFactory(TimingComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
