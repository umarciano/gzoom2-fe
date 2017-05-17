import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';

import { LeafMenu } from '../../../api/dto';
import { MenuService } from '../../../shared/menu.service';

const DEF_ICON = 'fa-angle-right';

@Component({
  selector: 'app-leaf-menu',
  templateUrl: './leaf-menu.component.html',
  styleUrls: ['./leaf-menu.component.scss']
})
export class LeafMenuComponent implements OnInit, OnChanges {
  @Input() menu: LeafMenu;
  classes: string[];
  link: string[];

  constructor(private readonly menuService: MenuService) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  private init() {
    this.classes = this.classesOf(this.menu);
    this.link = this.menuService.stateFor(this.menu);
  }

  private classesOf(m) {
    return m.classes && m.classes.length ? m.classes : DEF_ICON;
  }
}
