import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { IngredientsInputComponent } from './ingredients-input.component';

describe('IngredientsInputComponent', () => {
  let spectator: Spectator<IngredientsInputComponent>;
  const createComponent = createComponentFactory(IngredientsInputComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
