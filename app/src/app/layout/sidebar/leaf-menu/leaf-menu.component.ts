import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';

import { LeafMenu } from '../../../api/dto';
import { MenuRefurbishService } from '../../../shared/menu-refurbish.service';

const DEF_ICON = 'fa-angle-right';

@Component({
  selector: 'app-leaf-menu',
  templateUrl: './leaf-menu.component.html',
  styleUrls: ['./leaf-menu.component.scss']
})
export class LeafMenuComponent implements OnInit, OnChanges {
  @Input() menu: LeafMenu;
  classes: string[];

  constructor(private readonly menuRefurbish: MenuRefurbishService) { }

  ngOnInit() {
    this.classes = this.classesOf(this.menu);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.classes = this.classesOf(this.menu);
  }

  private classesOf(m) {
    return m.classes && m.classes.length ? m.classes : DEF_ICON;
  }
}
