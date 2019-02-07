/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LibImageComponent } from './lib-image.component';

describe('LibImageComponent', () => {
  let component: LibImageComponent;
  let fixture: ComponentFixture<LibImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
