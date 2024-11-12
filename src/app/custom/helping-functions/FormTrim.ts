import {FormArray, FormControl, FormGroup} from "@angular/forms";

/**
 * Description: trims the forms data.
 * @param formGroup
 */
export function trimFormValues(formGroup: FormGroup | FormArray): void {
  Object.keys(formGroup.controls).forEach((key) => {
    const control = formGroup.get(key);

    if (control instanceof FormControl && typeof control.value === 'string') {
      control.setValue(control.value.trim());
    } else if (control instanceof FormGroup || control instanceof FormArray) {
      trimFormValues(control);
    }
  })
}
