import {Pipe} from '@angular/core';

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'enabled',
  pure: false
})
export class EnabledPipe {

  // Transform is the new "return function(value, args)" in Angular 1.x
  transform(items, args?) {
    return items.filter(item => {
      return item.enabled;
    });
  }

}