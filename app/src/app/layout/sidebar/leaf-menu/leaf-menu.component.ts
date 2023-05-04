import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { FolderMenu, LeafMenu } from '../../../commons/model/dto';
import { MenuService } from '../../../shared/menu.service';

const DEF_ICON = 'fa-angle-right';

@Component({
  selector: 'app-leaf-menu',
  templateUrl: './leaf-menu.component.html',
  styleUrls: ['./leaf-menu.component.scss']
})
export class LeafMenuComponent implements OnInit, OnChanges {
  @Input() menu: FolderMenu;
  @Input() leaf: LeafMenu;
  @Input() context: FolderMenu;
  @Input('tabId') tabId: string;

  classes: string[];
  link: string[];

  constructor(private readonly menuService: MenuService ) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  toggleSidebar() {
    window.sessionStorage.setItem('tabId', this.tabId); //I save tabId for use it when the page is reloded

    const dom: any = document.querySelector('body');
    const menu: any = document.querySelector('#sidebar');
    if (menu.classList.contains('collapse')) {
      dom.classList.remove('push-right');
    } else {
      dom.classList.add('push-right');
    }
    menu.classList.toggle('collapse');
  }

  private init() {
    this.classes = this.classesOf(this.leaf);
    this.link = this.menuService.stateFor(this.context,this.menu,this.leaf);
  }

  private classesOf(m) {
    return m.classes && m.classes.length ? m.classes : DEF_ICON;
  }
}
