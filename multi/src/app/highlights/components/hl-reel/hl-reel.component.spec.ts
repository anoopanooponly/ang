/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HlReelComponent } from './hl-reel.component';

describe('HlReelComponent', () => {
  let component: HlReelComponent;
  let fixture: ComponentFixture<HlReelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlReelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlReelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
