import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { UsernameInputComponent } from './username-input.component';

describe('UsernameInputComponent', () => {
  let spectator: Spectator<UsernameInputComponent>;
  const createComponent = createComponentFactory(UsernameInputComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
