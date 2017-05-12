import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

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
  roots: Observable<FolderMenu[]>;

  constructor(private readonly route: ActivatedRoute) {
    this.menuConf = new MenuConfig();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { menu: RootMenu }) => {
        this.root = data.menu;
      });

    this.roots = this.route.data
      .map((data: { menu: RootMenu }) => data.menu.children);
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
