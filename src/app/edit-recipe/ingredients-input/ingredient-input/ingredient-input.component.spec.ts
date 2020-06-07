import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { IngredientInputComponent } from './ingredient-input.component';

describe('IngredientInputComponent', () => {
  let spectator: Spectator<IngredientInputComponent>;
  const createComponent = createComponentFactory(IngredientInputComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
