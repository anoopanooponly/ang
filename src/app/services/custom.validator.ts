import { FormArray, FormGroup } from '@angular/forms';

export class CustomValidators {
  static multipleCheckboxRequireOne(fa: FormGroup) {
    let valid = false;
    let keys = Object.keys(fa.controls);
    for(let key of keys) {
      if (fa.get(key).value) {
        valid = true;
        break;
      }
    }
    return valid ? null : {
      multipleCheckboxRequireOne: true
    };
  }
}