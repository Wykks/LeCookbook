import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { AccountIndexComponent } from './account-index.component';

describe('AccountIndexComponent', () => {
  let spectator: Spectator<AccountIndexComponent>;
  const createComponent = createComponentFactory(AccountIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
