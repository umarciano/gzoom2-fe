import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { fromEvent, of, mergeWith } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

import * as $ from 'jquery';

import { ResourceService } from '../../commons/service/resource.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LockoutService } from '../../commons/service/lockout.service';
import { ReportPopupService } from '../../shared/report-popup/report-popup.service';

@Component({
  selector: 'app-legacy',
  templateUrl: './legacy.component.html',
  styleUrls: ['./legacy.component.scss']
})
export class LegacyComponent implements OnInit {
  url: string;
  displayDialog: boolean;
  error = '';

  constructor(
    private readonly cont: ElementRef,
    private readonly resService: ResourceService,
    private readonly loaderService: LoaderService,
    private readonly lockout: LockoutService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly reportPopupService: ReportPopupService,
    private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log(' ngOnInit this.route.params ', this.activatedRoute.params);
    this.activatedRoute.params
      .pipe(mergeMap((params: Params) => of(params['id'])))  //       switchMap
      .subscribe((id: string) => {
        this.url = this.resService.iframeUrl(id);
        this.showLoader();
        this.collapseSidebar();
      });

    // Beware that component might be reused and iframe url is simply changed
    // in that case, iframe 'load' event is not sent.
    // Please refer to:
    // - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    // - https://stackoverflow.com/questions/9153445/how-to-communicate-between-iframe-and-the-parent-site
    const iframe: any = $(this.cont.nativeElement).find('iframe')[0];

    window.onmessage = s => {
      console.log('INTERNAL IFRAME EVENT: s.data ', s.data);
      if (s.data.event === 'login') {
        this.lockout.lockout();
      } else if (s.data.event === 'print') {
        console.log('print ', s.data.printParams);
        this.reportPopupService.openPopup(s.data.printParams);
        // this.displayDialog = true;
      } else if (s.data.event === 'resize') {
        this.resizeIframe(iframe);
      } else {
        this.resizeIframe(iframe);
      }
    };

    // whenever the iframe is loaded or the window is resized, update the iframe height
    //TODO
    const legacyObs = this.route.data.pipe(
      mergeWith(
        fromEvent(window, 'resize'),
        fromEvent(iframe.contentWindow, 'resize'),
        fromEvent(iframe, 'load')
      )).subscribe(() => {
        this.resizeIframe(iframe)
      });
  }

  resizeIframe(iframe) {
    // TODO do IE browsers require a different way to address the document?
    if (iframe.contentWindow != null) {
      let height = iframe.contentWindow.document.body.clientHeight;
      if (height < 300) {
        height = 300;
      }
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

  collapseSidebar() {
    const dom: any = document.querySelector('body');
    const menu: any = document.querySelector('#sidebar');
    dom.classList.add('push-right');
    menu.classList.add('collapse');
  }

}
