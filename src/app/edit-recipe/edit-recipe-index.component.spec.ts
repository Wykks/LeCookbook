import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { EditRecipeIndexComponent } from './edit-recipe-index.component';

describe('EditRecipeIndexComponent', () => {
  let spectator: Spectator<EditRecipeIndexComponent>;
  const createComponent = createComponentFactory(EditRecipeIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
