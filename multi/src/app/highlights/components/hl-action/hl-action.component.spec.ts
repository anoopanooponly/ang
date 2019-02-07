/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HlActionComponent } from './hl-action.component';

describe('HlActionComponent', () => {
  let component: HlActionComponent;
  let fixture: ComponentFixture<HlActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
