import { DefaultValueAccessor } from '@angular/forms';
import {
    Directive,
    ElementRef,
    HostListener,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: 'input[toUppercase], textarea[toUppercase]',
    standalone: true,
})
export class UpperCaseInputDirective extends DefaultValueAccessor {
    @HostListener('input', ['$event']) input($event: InputEvent) {
        setTimeout(() => {
            const target = $event.target as HTMLInputElement | HTMLTextAreaElement;
            const start = target.selectionStart;

            target.value = target.value.toUpperCase();
            target.setSelectionRange(start, start);

            this.onChange(target.value);
        }, 70);
    }

    constructor(renderer: Renderer2, elementRef: ElementRef) {
        super(renderer, elementRef, false);
    }
}
