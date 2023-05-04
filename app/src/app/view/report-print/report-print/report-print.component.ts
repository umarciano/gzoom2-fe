import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {  FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SelectItem } from '../../../commons/model/selectitem';
import { I18NService } from '../../../i18n/i18n.service';


import { Report } from '../report';


import { HttpClient } from '@angular/common/http';
import { ApiClientService } from 'app/commons/service/client.service';
import { ReportService } from 'app/api/service/report.service';

/** Convert from WorkEffortType[] to SelectItem[] */
function reportSelectItems(report: Report[]): SelectItem[] {
  if (report == null){
    return [];
  }
  return report.map((p:Report) => {
    return {label: p.reportName, value: {reportContentId: p.reportContentId, reportName:p.reportName, analysis: p.analysis}};
  });
}

@Component({
  selector: 'app-report-print',
  templateUrl: './report-print.component.html',
  styleUrls: ['./report-print.component.css']
})

export class ReportPrintComponent implements OnInit {
  /** Error message from be*/
  error = '';

  /** List of Report */
  reports: Report[];

  /** Selected report*/
  selectedReport: Report;
  contentIdContentName: String;

  languages: string[] = [];

  form: FormGroup;

  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly reportService: ReportService,
    private readonly client: ApiClientService,
    private fb: FormBuilder, http: HttpClient) {}

  ngOnInit() {

    const reportObs = this.route.data.pipe(
      map((data: { reports: Report[] }) => data.reports)
    );

    reportObs.pipe(
    //  map(reportSelectItems)
    )
    .subscribe((reports) => {
      console.log("reports:",reports);
      this.reports = reports;

      if (reports.length > 0) {
        this.onRowSelect(reports[0]);
      }

    });


    this.client.get("/profile/i18n/languages").pipe(map(
      json => json.results as string[]
     )).subscribe(data=>{
      this.languages = data;
        console.log("languages available report "+data);
     });

    // Form Validator
    this.form = this.fb.group({
      'reportContentId': new FormControl('')
  });

  }

  onRowSelect(data) {
    console.log('report ', data);
    this.selectedReport = data; // data.value;
    this.contentIdContentName = data.reportContentId+"_"+data.contentName+"_"+data.workEffortTypeId;
    if (this.selectedReport) {
        this.router.navigate([this.selectedReport.reportContentId, this.selectedReport.resourceName, this.selectedReport.workEffortTypeId, this.selectedReport.analysis], { relativeTo: this.route });
    }
  }

  secondaryLang(): boolean {
    if(this.languages.length > 1 && this.languages[1].indexOf(this.i18nService.getLang()) >= 0) {
      return true;
    }

    return false;
  }

}
