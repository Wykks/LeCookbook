import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { RegisterIndexComponent } from './register-index.component';

describe('RegisterIndexComponent', () => {
  let spectator: Spectator<RegisterIndexComponent>;
  const createComponent = createComponentFactory(RegisterIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
