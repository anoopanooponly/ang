/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HlUngroupedComponent } from './hl-ungrouped.component';

describe('HlUngroupedComponent', () => {
  let component: HlUngroupedComponent;
  let fixture: ComponentFixture<HlUngroupedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlUngroupedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlUngroupedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
