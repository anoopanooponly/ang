/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LibCliptimeComponent } from './lib-cliptime.component';

describe('LibCliptimeComponent', () => {
  let component: LibCliptimeComponent;
  let fixture: ComponentFixture<LibCliptimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibCliptimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCliptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
