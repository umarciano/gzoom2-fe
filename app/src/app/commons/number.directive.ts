import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
    selector: '[numberDecimal]'
})
export class NumberDecimalDirective {
  
    private regex: RegExp = new RegExp(/^[0-9]+(.[0-9]{0,0})?$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'Delete'];
    private oldValue; String;

   // @Input('numberDecimal') patternRegExp: string;
    @Input('numberDecimal') pippo: number;

    constructor(private el: ElementRef) {            
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        console.log("... Down=" + this.el.nativeElement.value);
        //console.log("... Down patternRegExp =" + this.patternRegExp);
        console.log("... Down pippo=" + this.pippo);
    }
/*
    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent) {        
        console.log("... keypress=" + this.el.nativeElement.value);
    }*/

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {  
        console.log("... keyup=" + this.el.nativeElement.value);      
       /* let current: string = this.el.nativeElement.value;
        if (current && !String(current).match(this.getRegExp())) {
            this.el.nativeElement.value = this.oldValue;
        }    */    
    }

    private getRegExp(): RegExp {
        return null; //this.patternRegExp != "" ? new RegExp(this.patternRegExp) : this.regex;
    }    
}