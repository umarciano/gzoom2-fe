import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

import { RootMenu, FolderMenu, LeafMenu } from '../../api/dto';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  roots: Observable<FolderMenu[]>;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.roots = this.route.data
      .map((data: { menu: RootMenu }) => data.menu.children);
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  menuType(item: {children?: any[]}): string {
    return item.children !== undefined && item.children !== null ? 'folder' : 'leaf';
  }
}
