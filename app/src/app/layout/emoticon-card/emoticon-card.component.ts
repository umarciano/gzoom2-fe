import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { emoticonCard } from './emoticonCard';

@Component({
  selector: 'app-emoticon-card',
  templateUrl: './emoticon-card.component.html',
  styleUrls: ['./emoticon-card.component.css']
})
export class EmoticonCardComponent implements OnInit, OnChanges {

  @Input() emoticonCard: emoticonCard;
  @Input() amount: number;
  @Input() id: string;

  text: string;
  value: number;
  iconId: string

  green: string = "#7ad851";
  orange: string = "#ddb669";
  red: string = "#dd6969";

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes && changes["emoticonCard"]) {
      this.text = this.emoticonCard.text;
      this.value = this.emoticonCard.value;
      this.iconId = this.emoticonCard.iconContentId;
    }

    if (changes && changes["amount"]) this.value = this.amount;

    if (changes && changes["id"]) this.iconId = this.id;
    
  }

}
