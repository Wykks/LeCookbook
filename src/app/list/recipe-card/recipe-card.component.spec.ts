import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { RecipeCardComponent } from './recipe-card.component';

describe('RecipeCardComponent', () => {
  let spectator: Spectator<RecipeCardComponent>;
  const createComponent = createComponentFactory(RecipeCardComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
