import { Directive, ElementRef, HostListener, Input, forwardRef, Provider, Renderer2 } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator } from '@angular/forms';

const CUSTOM_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberDecimalAccessor),
    multi: true
};

@Directive({
    selector: 'input[numberDecimal2]',
    host: { '(input)': 'doOnChange($event)' },
    providers: [CUSTOM_VALUE_ACCESSOR]
})
export class NumberDecimalAccessor  {
/*
    onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  handleInput(value: any): void {

    if (value === value) {

      this._elementRef.nativeElement.value = value
      return;
    }
    this.onChange(value);
  }*/

}
