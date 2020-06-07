import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { XsRecipeViewComponent } from './xs-recipe-view.component';

describe('XsRecipeViewComponent', () => {
  let spectator: Spectator<XsRecipeViewComponent>;
  const createComponent = createComponentFactory(XsRecipeViewComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
