import {Directive, ElementRef, Renderer, AfterViewInit } from '@angular/core';
@Directive({
    selector: '[focus]'     
})
export class DmFocusDirective implements AfterViewInit {
    constructor(private _el: ElementRef, private renderer: Renderer) {
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this._el.nativeElement, 'focus');
        document.getElementById("number3").focus();
    }
}