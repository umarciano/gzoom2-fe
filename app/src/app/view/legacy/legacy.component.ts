import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';

import * as $ from 'jquery';

import { ResourceService } from '../../api/resource.service';

@Component({
  selector: 'app-legacy',
  templateUrl: './legacy.component.html',
  styleUrls: ['./legacy.component.scss']
})
export class LegacyComponent implements OnInit {
  url: string;

  constructor(
    private readonly cont: ElementRef,
    private readonly resService: ResourceService,
    private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => Observable.of(params['id']))
      .subscribe((id: string) => this.url = this.resService.iframeUrl(id));

    // TODO what if component is reused and iframe url is simply changed? is this event going
    // to be sent again?
    const iframe: any = $(this.cont.nativeElement).find('iframe')[0];

    // whenever the iframe is loaded or the window is resized, update the iframe height
    Observable.merge(
      Observable.fromEvent(window, 'resize'),
      Observable.fromEvent(iframe, 'load')
    ).subscribe(() => this.resizeIframe(iframe));
  }

  resizeIframe(iframe) {
    // TODO do IE browsers require a different way to address the document?
    const height = iframe.contentWindow.document.body.scrollHeight;
    $(iframe).height(height + 'px');
  }
}
