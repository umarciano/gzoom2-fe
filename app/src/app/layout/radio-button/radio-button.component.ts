import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements OnInit, OnChanges {

  @Input() selecItem: any;

  @Input() items: any[] = [];

  @Output() itemChanges = new EventEmitter<any>();

  selectedItem: any;


  ngOnInit(): void {
    
    this.selectedItem = this.items.filter(x => x.key === this.selecItem.key)[0];

  }

  itemChangesFun() {

    this.itemChanges.emit(this.selectedItem);
    
    
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes["selecItem"]) {
      this.selectedItem = this.selecItem;
    }
    
  }

}
