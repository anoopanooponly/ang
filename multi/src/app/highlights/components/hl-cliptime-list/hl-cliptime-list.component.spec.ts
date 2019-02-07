/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HlCliptimeListComponent } from './hl-cliptime-list.component';

describe('HlCliptimeListComponent', () => {
  let component: HlCliptimeListComponent;
  let fixture: ComponentFixture<HlCliptimeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlCliptimeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlCliptimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
