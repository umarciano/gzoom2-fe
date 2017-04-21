import { Directive, ElementRef, AfterContentInit } from '@angular/core';
import { ApplicationConfig } from './config';

import * as $ from "jquery";

@Directive({
  selector: '[app-version]'
})
export class VersionDirective implements AfterContentInit {
  private readonly version: string | number;

  constructor(private readonly el: ElementRef, private readonly conf: ApplicationConfig) {
    this.version = conf.version;
  }

  ngAfterContentInit() {
    if (this.el.nativeElement) {
      $(this.el.nativeElement).text(this.version);
    }
  }
}
