import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { CookbookListIndexComponent } from './cookbook-list-index.component';

describe('CookbookListIndexComponent', () => {
  let spectator: Spectator<CookbookListIndexComponent>;
  const createComponent = createComponentFactory(CookbookListIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
