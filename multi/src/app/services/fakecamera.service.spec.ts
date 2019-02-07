/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FakecameraService } from './fakecamera.service';

describe('Service: Fakecamera', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakecameraService]
    });
  });

  it('should ...', inject([FakecameraService], (service: FakecameraService) => {
    expect(service).toBeTruthy();
  }));
});
