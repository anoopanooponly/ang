import { Component, OnInit } from '@angular/core';
import {TagInputComponent} from 'angular2-tag-input/lib/components/tag-input/tag-input.component';

@Component({
	selector: 'tags',
	template: `
	<h1>Angular 2 Tag Input Example</h1>
	
	<h2>Basic Example</h2>
  <tag-input
    placeholder="Add an tag"
    [(ngModel)]="settings.tags"
    delimiterCode="188">
  </tag-input>
  
	`
})
export class InputNewComponent {

  public settings = {
    recipients: [],
    tags: ['one', 'two', 'three']
  };
}
