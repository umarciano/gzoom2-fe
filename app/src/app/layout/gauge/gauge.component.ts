import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { gaugeConfig } from './gaugeConfig';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, OnChanges {
  @Input() gaugeConfig: gaugeConfig;
  @Input() value: number;

  gaugeSize = 115;        //Specifies the size of the canvas in which Gauge will be drawn. It is used as width and height both.
  gaugeType = "arch";     //Specifies the gauge's type.
  gaugeThick = 10;        //Specified the thickness of the gauge's bar.
  gaugeValue = 10;        //Specifies the current value of the Gauge in the range specified by min and max. It is a required attribute.
  gaugeMin = 0;           //Specifies the minimum numeric value for gauge's scale.
  gaugeMax = 100;         //Specified the maximum numeric value for gauge's scale.
  gaugeDuration = 500;    //Specifies the duration (in milliseconds) of the Gauge's animation.
  gaugeCap = "butt";      //The style of line ending at the gauge's end.
  gaugeLabel = "";        //Specifies the text to display below the Gauge's reading.
  gaugeAppendText = "";   //Specifies a string appended to the Gauge's reading. For example "%" most commonly used.
  gaugeMargin = 20;       //Specifies an optional margin for the gauge.
  sizeMarkerLine = 2;     //Marker line size
  sizeMarkerLineNum = 4;  //Marker line size with label
  foregroundColor="green" //Specifies the foreground color of the Gauge's scale.

  markerConfig = {
    /* "0": { color: '#555', size: this.sizeMarkerLineNum, label: '0', type: 'line' },
    "10": { color: '#555', size: this.sizeMarkerLine, type: 'line' },
    "20": { color: '#555', size: this.sizeMarkerLineNum, label: '20', type: 'line' },
    "30": { color: '#555', size: this.sizeMarkerLine, type: 'line' },
    "40": { color: '#555', size: this.sizeMarkerLineNum, label: '40', type: 'line' },
    "50": { color: '#555', size: this.sizeMarkerLine, type: 'line' },
    "60": { color: '#555', size: this.sizeMarkerLineNum, label: '60', type: 'line' },
    "70": { color: '#555', size: this.sizeMarkerLine, type: 'line' },
    "80": { color: '#555', size: this.sizeMarkerLineNum, label: '80', type: 'line' },
    "90": { color: '#555', size: this.sizeMarkerLine, type: 'line' },
    "100": { color: '#555', size: this.sizeMarkerLineNum, label: '100', type: 'line' }, */


  };
  //tmpMarkerConfig: { [x: string]: { color: string, size: number, label: string, type: string }; }[]= [];
  tmpMarkerConfig = {"0": { color: '#555', size: this.sizeMarkerLineNum, label: '0', type: 'line' },};
  
  thresholdConfig;

  //Static configures
  /*thresholdConfig : {
        '0': { color: 'red', bgOpacity: 0.3 },
        '45': { color: 'orange', bgOpacity: 0.3 },
        '60': { color: 'green', bgOpacity: 0.3 }
      }*/
 

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes["gaugeConfig"]) {
      
      this.thresholdConfig = {
        [this.gaugeConfig.fromValueRed]: { color: 'red', bgOpacity: 0.3 },
        [this.gaugeConfig.fromValueYellow]: { color: 'orange', bgOpacity: 0.3 },
        [this.gaugeConfig.fromValueGreen]: { color: 'green', bgOpacity: 0.3 }
      }

      this.gaugeValue = this.gaugeConfig.gaugeValue;
      

      if(this.gaugeValue > this.gaugeConfig.fromValueGreen) this.foregroundColor = "green";
      if(this.gaugeValue > this.gaugeConfig.fromValueYellow) this.foregroundColor = "orange";
      if(this.gaugeValue > this.gaugeConfig.fromValueRed) this.foregroundColor = "red";

      this.gaugeLabel = this.gaugeConfig.gaugeLabel;
      this.gaugeMax = this.gaugeConfig.gaugeMax;
      this.gaugeMin = this.gaugeConfig.gaugeMin;     

      
      let i = 0;
      while (i <= this.gaugeConfig.gaugeMax) {
        let str = i.toString();
        this.tmpMarkerConfig[i.toString()]={color: '#555', size: this.sizeMarkerLineNum, label: str, type: 'line'};
        i+=10;

        if (!(i >= this.gaugeConfig.gaugeMax)) {
          this.tmpMarkerConfig[i.toString()]={color: '#555', size: this.sizeMarkerLine, type: 'line'};
          i+=10;
        }
        
      }

      this.markerConfig = this.tmpMarkerConfig;
      
    }

    if (changes && changes["value"]) {
 

      this.gaugeValue = this.value;
      

     
    }

  }




}
