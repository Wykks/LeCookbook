import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { MdRecipeViewComponent } from './md-recipe-view.component';

describe('MdRecipeViewComponent', () => {
  let spectator: Spectator<MdRecipeViewComponent>;
  const createComponent = createComponentFactory(MdRecipeViewComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
