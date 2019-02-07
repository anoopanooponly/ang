/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeatmapService } from './heatmap.service';

describe('Service: Heatmap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeatmapService]
    });
  });

  it('should ...', inject([HeatmapService], (service: HeatmapService) => {
    expect(service).toBeTruthy();
  }));
});
