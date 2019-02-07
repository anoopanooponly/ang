/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LibActionComponent } from './lib-action.component';

describe('LibActionComponent', () => {
  let component: LibActionComponent;
  let fixture: ComponentFixture<LibActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
