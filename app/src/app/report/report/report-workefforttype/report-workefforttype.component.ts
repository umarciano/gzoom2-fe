import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { first, map, merge, switchMap } from 'rxjs/operators';

import { SelectItem } from '../../../commons/selectitem';
import { I18NService } from '../../../commons/i18n.service';
import { Message } from '../../../commons/message';

import { Report } from '../../../report/report';
import { WorkEffort } from '../../../report/report';
import { ReportService } from '../../../api/report.service';


/** Convert from WorkEffort[] to SelectItem[] */
function workEfforts2SelectItems(types: WorkEffort[]): SelectItem[] {
  return types.map((wt: WorkEffort) => {
    return {label: wt.workEffortName, value: wt.workEffortId};
  });
}

@Component({
  selector: 'app-report-workefforttype',
  templateUrl: './report-workefforttype.component.html',
  styleUrls: ['./report-workefforttype.component.css']
})
export class ReportWorkefforttypeComponent implements OnInit {
  _reload: Subject<void>;
  error = '';
  msgs: Message[] = [];
  form: FormGroup;


  workEffortSelectItem: SelectItem[] = [];
  workEffort: WorkEffort;
  workEffortId: String;
  
  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly reportService: ReportService,
    private fb: FormBuilder, ) {      
     }

  ngOnInit() {

    this.form = this.fb.group({
        'workEffortId': new FormControl('')
    });

    const workEffortObs = this.route.data.pipe(
       map((data: { workEfforts: WorkEffort[] }) => data.workEfforts),     
       map(workEfforts2SelectItems)
    ).subscribe((data) => {
      this.workEffortSelectItem = data;
      this.workEffortSelectItem.push({label: this.i18nService.translate('Select WorkEffort'), value:null});
    });
 
  }

}
