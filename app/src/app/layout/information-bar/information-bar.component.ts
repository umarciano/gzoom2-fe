import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-bar',
  templateUrl: './information-bar.component.html',
  styleUrls: ['./information-bar.component.css']
})
export class InformationBarComponent implements OnInit {

  
  @Input() bodyBarArray: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
