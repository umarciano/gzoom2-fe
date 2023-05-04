import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'app/commons/service/menu.service';
import { UserPreferenceService } from 'app/api/service/user-preference.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor(private router: Router,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly menuService: MenuService) { }

  ngOnInit() {

    //If the security group of user has default portal page rediterct to it

    const userPreferenceService$ = this.userPreferenceService.getDefaultPortalPage();
    lastValueFrom(userPreferenceService$).then(
      p => {
        if(p) {
          const menuService$ = this.menuService.getMenuPath(p);
          this.menuService.getMenuPath(p);
          lastValueFrom(menuService$).then(
            result => {
              this.router.navigate([`/c/legacy/${result}`]);
            });
        }
      });


    // this.userPreferenceService.getDefaultPortalPage().toPromise().then(
    //   p => {
    //     if(p) {
    //       this.menuService.getMenuPath(p).toPromise().then(
    //         result => {
    //           this.router.navigate([`/c/legacy/${result}`]);
    //         });
    //     }
    //   });
    }
}

