/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HlReelListComponent } from './hl-reel-list.component';

describe('HlReelListComponent', () => {
  let component: HlReelListComponent;
  let fixture: ComponentFixture<HlReelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlReelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlReelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
