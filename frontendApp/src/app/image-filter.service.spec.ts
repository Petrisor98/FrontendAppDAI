import { TestBed } from '@angular/core/testing';

import { ImageFilterService } from './image-filter.service';

describe('ImageFilterService', () => {
  let service: ImageFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
