import { TestBed } from '@angular/core/testing';

import { RequestquoteService } from './requestquote.service';

describe('RequestquoteService', () => {
  let service: RequestquoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestquoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
