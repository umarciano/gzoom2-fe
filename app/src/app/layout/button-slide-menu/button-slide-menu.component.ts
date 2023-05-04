import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'app/commons/model/dto';

@Component({
  selector: 'app-button-slide-menu',
  templateUrl: './button-slide-menu.component.html',
  styleUrls: ['./button-slide-menu.component.css']
})
export class ButtonSlideMenuComponent implements OnInit {

  @Input() items: MenuItem[];
  @Input() disabled: boolean;
  heightSlideMenu : number;

  constructor() { }

  ngOnInit(): void {
    if(this.items.length == 1){
      this.heightSlideMenu = 80 * this.items.length;
    }else if(this.items.length == 2 ){
      this.heightSlideMenu = 60 * this.items.length;
    }else if(this.items.length == 3){
      this.heightSlideMenu = 50 * this.items.length;
    }else if(this.items.length > 3 ){
      this.heightSlideMenu = 150;
    }    
  }

}
