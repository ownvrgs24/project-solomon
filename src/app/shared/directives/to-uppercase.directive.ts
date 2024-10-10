import { DefaultValueAccessor } from '@angular/forms';
import {
    Directive,
    ElementRef,
    HostListener,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[toUppercase]',
    standalone: true,
})
export class UpperCaseInputDirective {
    @HostListener('input', ['$event']) onkeyup(event: KeyboardEvent) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.toUpperCase();
    }
}