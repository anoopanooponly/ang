/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LibraryService } from './library.service';

describe('Service: Library', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibraryService]
    });
  });

  it('should ...', inject([LibraryService], (service: LibraryService) => {
    expect(service).toBeTruthy();
  }));
});
