/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PeopleCountingService } from './people-counting.service';

describe('Service: PeopleCounting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeopleCountingService]
    });
  });

  it('should ...', inject([PeopleCountingService], (service: PeopleCountingService) => {
    expect(service).toBeTruthy();
  }));
});
