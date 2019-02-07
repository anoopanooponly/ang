/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LibCliptimeListComponent } from './lib-cliptime-list.component';

describe('LibCliptimeListComponent', () => {
  let component: LibCliptimeListComponent;
  let fixture: ComponentFixture<LibCliptimeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibCliptimeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCliptimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
