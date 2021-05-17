import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { fromEvent, of, merge } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

import * as $ from 'jquery';

import { ResourceService } from '../../api/resource.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LockoutService } from '../../commons/lockout.service';

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
    private readonly loaderService: LoaderService,
    private readonly lockout: LockoutService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log(" ngOnInit this.route.params ", this.activatedRoute.params);
    this.activatedRoute.params
      .pipe(mergeMap((params: Params) => of(params['id'])))  //       switchMap
      .subscribe((id: string) => {
        console.log("subscribe id " + id);
        this.url = this.resService.iframeUrl(id);
        this.showLoader();
      });

    // Beware that component might be reused and iframe url is simply changed
    // in that case, iframe 'load' event is not sent.
    // Please refer to:
    // - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    // - https://stackoverflow.com/questions/9153445/how-to-communicate-between-iframe-and-the-parent-site
    const iframe: any = $(this.cont.nativeElement).find('iframe')[0];

    window.onmessage = s => {
        console.log("INTERNAL IFRAME EVENT: s.data ", s.data);
        if(s.data.event == 'resize') {
          this.resizeIframe(iframe);
        } else if(s.data.event == 'login') {
          this.lockout.lockout();
        } else {
          // TODO
          console.log("TODO ", s.data);
          this.lockout.lockout();
        }
    };

    // whenever the iframe is loaded or the window is resized, update the iframe height
    //TODO
    merge(
      fromEvent(window, 'resize'),
      fromEvent(iframe.contentWindow, 'resize'),
      fromEvent(iframe, 'load')
    ).subscribe(() => {
      this.resizeIframe(iframe)
    });
  }

  resizeIframe(iframe) {
    // TODO do IE browsers require a different way to address the document?
    if(iframe.contentWindow != null) {
      const height = iframe.contentWindow.document.body.clientHeight;

      console.log("resizeIframe height " + height);
      $(iframe).height(height + 'px');
    }

  }

  uploadDone(): void {
    this.loaderService.hide();
  }
  
  showLoader(): void {
    this.loaderService.show();
  }

  hideLoader(): void {
    this.loaderService.hide();
  }

}
