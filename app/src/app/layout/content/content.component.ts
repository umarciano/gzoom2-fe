import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  // TODO make these properties connected to sidebar
  activeMenuId: string;
  mobileMenuActive: boolean = false;

  toggleMenu(e) {
    this.mobileMenuActive = !this.mobileMenuActive;
    e.preventDefault();
  }

}
