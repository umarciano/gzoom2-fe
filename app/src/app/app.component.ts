import {Component, OnDestroy, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { I18NService } from './i18n/i18n.service';
import { filter, tap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private mySubscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private i18n: I18NService) {
/*
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;

      }
    }); */
  }
  ngOnInit() {
    // NOTE improve title change according to route data as described here
    // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.title.setTitle(this.i18n.translate('Gzoom2'));
    // NOTE this is a sort of hack that will help us redirect to /dashboard
    // if / url is hitten; seems like there's no other way to do this
    this.router.onSameUrlNavigation = 'reload';
    this.router
      .events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // console.log('NavigationEnd', event);
        if (event.url === '/') {
          this.router.navigate(['/c/dashboard']);
        }
      });
  }
/*
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }*/

}
