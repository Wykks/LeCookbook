import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { LoadingOrErrorComponent } from './loading-or-error.component';

describe('LoadingOrErrorComponent', () => {
  let spectator: Spectator<LoadingOrErrorComponent>;
  const createComponent = createComponentFactory(LoadingOrErrorComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
