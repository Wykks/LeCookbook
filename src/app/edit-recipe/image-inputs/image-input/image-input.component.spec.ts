import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { ImageInputComponent } from './image-input.component';

describe('ImageInputComponent', () => {
  let spectator: Spectator<ImageInputComponent>;
  const createComponent = createComponentFactory(ImageInputComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
