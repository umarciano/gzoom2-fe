import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { ResourceService } from '../../api/resource.service';

@Component({
  selector: 'app-legacy',
  templateUrl: './legacy.component.html',
  styleUrls: ['./legacy.component.scss']
})
export class LegacyComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  url: string;

  constructor(
    private readonly resService: ResourceService,
    private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => Observable.of(params['id']))
      .subscribe((id: string) => this.url = this.resService.iframeUrl(id));
  }

/* example from http://stackoverflow.com/questions/38457662/iframe-inside-angular2-component-property-contentwindow-does-not-exist-on-typ
  ngAfterViewInit() {
    let content = '<button id="button" class="button" >My button </button>';
    let doc =  this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    doc.open();
    doc.write(content);
    doc.close();
  }
*/
}
