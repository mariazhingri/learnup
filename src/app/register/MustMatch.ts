import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

// Validador personalizado para verificar si hay caracteres especiales
export function noSpecialCharactersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = /[^a-zA-Z0-9]/.test(control.value);
        return forbidden ? { 'specialCharacters': { value: control.value } } : null;
    };
}