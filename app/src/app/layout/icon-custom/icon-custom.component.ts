import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-custom',
  templateUrl: './icon-custom.component.html',
  styleUrls: ['./icon-custom.component.css']
})
export class IconCustomComponent implements OnInit {

  @Input() path: string;

  totPath: string;
  
  constructor() { }

  ngOnInit(): void {
    this.totPath = '../../../assets/images/inconFlag/'+ this.path +'.png'
    
  }

}
