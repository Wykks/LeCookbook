import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { RecipeIndexComponent } from './recipe-index.component';

describe('RecipeIndexComponent', () => {
  let spectator: Spectator<RecipeIndexComponent>;
  const createComponent = createComponentFactory(RecipeIndexComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
