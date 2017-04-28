import { Directive, ElementRef, AfterContentInit } from '@angular/core';
import { ApplicationConfig } from './config';

import * as $ from 'jquery';

/**
 * Prints the application version as text element.
 */
@Directive({ selector: '[appVersion]' })
export class ApplicationVersionDirective implements AfterContentInit {
  private readonly version: string | number;

  constructor(private readonly el: ElementRef, private readonly conf: ApplicationConfig) {
    this.version = conf.version;
  }

  ngAfterContentInit() {
    if (this.el.nativeElement && this.version) {
      $(this.el.nativeElement).text(this.version);
    }
  }
}

/**
 * Prints the application name as text element.
 */
@Directive({ selector: '[appName]' })
export class ApplicationNameDirective implements AfterContentInit {
  private readonly name: string;

  constructor(private readonly el: ElementRef, private readonly conf: ApplicationConfig) {
    this.name = conf.name;
  }

  ngAfterContentInit() {
    if (this.el.nativeElement && this.name) {
      $(this.el.nativeElement).text(this.name);
    }
  }
}
