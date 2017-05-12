import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';

import { RootMenu, FolderMenu, LeafMenu } from '../../api/dto';
import { MenuConfig } from '../../shared/menu-config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private readonly menuConf: MenuConfig;
  isActive = false;
  showMenu = '';
  //menu: ;
  root: RootMenu;

  constructor(private readonly route: ActivatedRoute) {
    this.menuConf = new MenuConfig();
  }

  ngOnInit() {
    this.route.data
      .filter(d => d instanceof RootMenu)
      .subscribe((root: RootMenu) => {
        this.root = root;
      });
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

}
