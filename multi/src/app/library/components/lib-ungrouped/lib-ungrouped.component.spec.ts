/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LibUngroupedComponent } from './lib-ungrouped.component';

describe('LibUngroupedComponent', () => {
  let component: LibUngroupedComponent;
  let fixture: ComponentFixture<LibUngroupedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibUngroupedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibUngroupedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
