import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { ImageInputsComponent } from './image-inputs.component';

describe('ImageInputsComponent', () => {
  let spectator: Spectator<ImageInputsComponent>;
  const createComponent = createComponentFactory(ImageInputsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
