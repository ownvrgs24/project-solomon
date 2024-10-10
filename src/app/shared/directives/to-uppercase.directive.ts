import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    Directive,
    ElementRef,
    HostListener,
    Renderer2,
    forwardRef,
} from '@angular/core';

@Directive({
    standalone: true,
    selector: 'input[toUppercase], textarea[toUppercase]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => UpperCaseInputDirective),
        },
    ],
})
export class UpperCaseInputDirective extends DefaultValueAccessor {
    @HostListener('input', ['$event']) input($event: InputEvent) {
        const target = $event.target as HTMLInputElement | HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        target.value = target.value.toUpperCase();

        // Preserve cursor position
        target.setSelectionRange(start, end);

        this.onChange(target.value);
    }

    constructor(renderer: Renderer2, elementRef: ElementRef) {
        super(renderer, elementRef, false);
    }
}