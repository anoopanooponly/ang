/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HighlightsService } from './highlights.service';

describe('Service: Highlights', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightsService]
    });
  });

  it('should ...', inject([HighlightsService], (service: HighlightsService) => {
    expect(service).toBeTruthy();
  }));
});
