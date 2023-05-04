import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';

import { LeafMenu } from '../../../commons/model/dto';
import { FolderMenu } from '../../../commons/model/dto';

const OPEN_ICON = 'fa-folder-open';
const CLOSE_ICON = 'fa-folder';

@Component({
  selector: 'app-folder-menu',
  templateUrl: './folder-menu.component.html',
  styleUrls: ['./folder-menu.component.scss']
})
export class FolderMenuComponent implements OnInit, OnChanges {
  @Input() menu: FolderMenu;
  @Input() context: FolderMenu;
  @Input('tabId') tabId: string;
  classes: string[];
  expanded = true;

  constructor() { }

  ngOnInit() {
    this.classes = this.classesOf(this.menu);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.classes = this.classesOf(this.menu);
  }

  private classesOf(m) {
    return m.classes && m.classes.length ? m.classes : CLOSE_ICON;
  }

  menuType(item: {children?: any[]}): string {
    return item.children !== undefined && item.children !== null ? 'folder' : 'leaf';
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
