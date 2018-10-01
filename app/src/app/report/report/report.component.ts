import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { SelectItem } from '../../commons/selectitem';
import { I18NService } from '../../commons/i18n.service';
import { Message } from '../../commons/message';

import { Report } from '../../report/report';
import { OutputType } from '../../report/report';
import { ReportService } from '../../api/report.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {
  _reload: Subject<void>;

  /** Error message from be*/
  error = '';
  /** Selected report*/
  selectedReport: Report;

  reportContentId: string;

  outputFormat: OutputType;
  outputFormats: OutputType[];

  mimeTypeId: string;

  // form: FormGroup;

/*   doctors = [];
  pollingData: any;      
 */
  constructor(private readonly route: ActivatedRoute,
  private readonly router: Router,
  private readonly i18nService: I18NService,
  private readonly reportService: ReportService,
  private fb: FormBuilder, http: HttpClient, ) {
    this._reload = new Subject<void>();
    // concatMap if request longer more 5 sec
    /* this.pollingData = Observable.interval(5000).startWith(0)
     .switchMap(() => http.get('http://jsonplaceholder.typicode.com/users/'))
     .pipe(
      map(json => json)
    ).subscribe((data: any[]) => {
       this.doctors=data; 
       console.log(data);// see console you get output every 5 sec
    }); */
    /*  map((data) => data.json())
      ).subscribe((data) => {
           this.doctors=data; 
            console.log(data);// see console you get output every 5 sec
         });*/
         // this.selectedReport = new Report();
  }

  ngOnInit() {
    console.log('ngOnInit Report component ' + this.reportContentId);
    let reloadedReport = this._reload
    //  .switchMap(() => this.uomService.uomRatingScales(this.selectedUomId));;

    
     const reportObs = this.route.data.pipe(
       map((data: { report: Report }) => data.report)//,
       //.merge(reloadedReport)
    );

    // bisogna chiamarlo data e non altro nome
    // tolgo.pipe(first()) perche non solo la prima volta ma sempre
    reportObs
    .subscribe((data) => {
      console.log('ngOnInit subscribe report ' + data);
      // TODO this.reports = reports;
      this.onRowSelect(data);
    });

    /*reportObs.subscribe((report) => {
      this.onRowSelect(report));

    });*/
    // tolgo.pipe(first()) perche non solo la prima volta ma sempre
    /* .subscribe((data) => {
      if (data) {
        console.log('ngOnInit subscribe data data ' + data);
        this.selectedReport = data;
        this.outputFormats = data.outputFormats;
        this.selectedReport.outputFormat = this.outputFormats[0].mimeTypeId;
        let parentTypeId = this.selectedReport.parentTypeId;
        
        console.log('ngOnInit paramMap reportContentId ' + this.selectedReport.reportContentId);
        console.log('ngOnInit paramMap outputFormat ' + this.selectedReport.outputFormat);
        console.log('ngOnInit paramMap parentTypetId ' + parentTypeId);
      }
    });*/

  /*this.form = this.fb.group({
    'partyId': new FormControl('', Validators.required),
    'fromDate': new FormControl('', Validators.required),
    'thruDate': new FormControl('', Validators.required),
    'contractHours': new FormControl(''),
    'actualHours': new FormControl('')
  });*/
  }

  onRowSelect(data) {
    console.log('report ', data);

    this.selectedReport = data;
    this.outputFormats = data.outputFormats;
    console.log('ngOnInit paramMap outputFormat ' + this.selectedReport.outputFormat);
    this.outputFormat = this.outputFormats[0];
    this.selectedReport.outputFormat = this.outputFormats[0].mimeTypeId;
    console.log('ngOnInit paramMap outputFormat ' + this.selectedReport.outputFormat);
    let parentTypeId = this.selectedReport.parentTypeId;
    console.log('ngOnInit paramMap mimeTypeId ' + this.selectedReport.mimeTypeId);
    this.mimeTypeId = this.outputFormats[0].mimeTypeId;
    console.log('ngOnInit paramMap mimeTypeId ' + this.selectedReport.mimeTypeId);
    console.log('ngOnInit paramMap reportContentId ' + this.selectedReport.reportContentId);
    console.log('ngOnInit paramMap outputFormat ' + this.selectedReport.outputFormat);
    console.log('ngOnInit paramMap parentTypetId ' + parentTypeId);
  }

  print() {
  /*this.timesheet.partyId = this.selectedPartyId;
  if (this.newTimesheet) {
    this.timesheetService
      .createTimesheet(this.timesheet)
      .then(() => {
        this.timesheet = null;
        this.displayDialog = false;
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
        this._reload.next();
      })
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
      });
    }*/
    this.reportService
      .add(this.selectedReport)
      .then(contentId => {
        /*this.timesheet = null;
        this.displayDialog = false;
        this.msgs = [{severity:this.i18nService.translate('info'), summary:this.i18nService.translate('Created'), detail:this.i18nService.translate('Record created')}];
        this._reload.next();*/
        console.log(" contentId " + contentId);
        var newWindow = window.open('/c/report-example-1/report-download/' + contentId);
      })
      .catch((error) => {
        console.log('error' , error.message);
        this.error = this.i18nService.translate(error.message) || error;
      });
  }


/*   ngOnDestroy() {
    this.pollingData.unsubscribe();
  } */

}
