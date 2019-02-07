/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HlCliptimeComponent } from './hl-cliptime.component';

describe('HlCliptimeComponent', () => {
  let component: HlCliptimeComponent;
  let fixture: ComponentFixture<HlCliptimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlCliptimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlCliptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
