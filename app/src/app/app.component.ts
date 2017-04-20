import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // NOTE this is a sort of hack that will help us redirect to /dashboard
    // if / url is hitten; seems like there's no way to do this
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard']);
    }
  }
}
