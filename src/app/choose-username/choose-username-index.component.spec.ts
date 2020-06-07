import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { ChooseUsernameIndexComponent } from './choose-username-index.component';

describe('ChooseUsernameIndexComponent', () => {
  let spectator: Spectator<ChooseUsernameIndexComponent>;
  const createComponent = createComponentFactory(ChooseUsernameIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
