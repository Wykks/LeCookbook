import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { LoginIndexComponent } from './login-index.component';

describe('LoginIndexComponent', () => {
  let spectator: Spectator<LoginIndexComponent>;
  const createComponent = createComponentFactory(LoginIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
