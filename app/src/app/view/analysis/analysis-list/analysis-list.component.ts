import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkEffortAnalysisService } from 'app/api/service/work-effort-analysis.service';
import { WorkEffortAnalysis } from 'app/api/model/workEffortAnalysis';
import { I18NService } from 'app/i18n/i18n.service';
import { Subject } from 'rxjs';
import { map, mergeMap, mergeWith } from 'rxjs/operators';

@Component({
  selector: 'app-list-analysis',
  templateUrl: './analysis-list.component.html',
  styleUrls: ['./analysis-list.component.css']
})
export class AnalysisListComponent implements OnInit {
  analyses: WorkEffortAnalysis[];

  _reload: Subject<void>;
  
  gridArray: any[] = [];

  context: string;

  /** Row index selected for uomRatingScale*/
  selectedIndex = -1;

  form: { [name: string]: FormGroup | FormControl | FormArray };

  currentAnalysis: WorkEffortAnalysis;
  analysisItem: any;

  /* ####### config for table component ########## */

  headArray = [
    { head: '', fieldName: 'idNumber', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null" },
    { head: this.i18nService.translate('Date'),  fieldName: 'referenceDate', actionInput: 'null', actionOutput: 'outputClickLabelData', display: "table-cell", filter: "textFilter", width: "20em"},
    { head: this.i18nService.translate('Code'), fieldName: 'workEffortAnalysisId', actionInput: 'null', actionOutput: 'outputClickLabelData', display: "table-cell", filter: "textFilter", width: "20em", sortIcon: true},
    { head: this.i18nService.translate('Description'), fieldName: 'description', actionInput: 'null', actionOutput: 'outputClickLabelData', display: "table-cell", filter: "textFilter", sortIcon:true },
  ];

  
  constructor(
    private readonly workEffortAnalysisService: WorkEffortAnalysisService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
   ) {
    
      this._reload = new Subject<void>();
   }

  ngOnInit() {

    this.form = {
      /*'context': new FormControl(''),
      'description': new FormControl(''),*/
    };
    
    this.route.paramMap.subscribe(paramMap => {
      this.context = paramMap.get('context');
      this.gridArray =[];
      this.analyses = [];
    })

    const reloadedAnalyses = this._reload.pipe(mergeMap(() => this.workEffortAnalysisService.getWorkEffortAnalysisWithContext(this.context)));
    
    const analysesObs = this.route.data.pipe(
      map((data: { analyses: WorkEffortAnalysis[]}) => data.analyses),
      mergeWith(reloadedAnalyses)
    );


    //analysesObs.pipe(first()).subscribe(analyses => this.onRowSelect(analyses, 0));

    analysesObs.subscribe((data) => {
      this.analyses = data;

      data.forEach((element, index) => {
        let date = new Date(element.referenceDate);

        this.gridArray.push({
          id: index,
          idNumber: index,
          referenceDate: date.toLocaleDateString(),
          workEffortAnalysisId: element.workEffortAnalysisId,
          description: element.description,
          buttonDetails: false,
        })
      })

      console.log(data);
    });   

  }


  onRowSelect(analyses: WorkEffortAnalysis[], ri: number) {
    const analysis = analyses && analyses.length ? analyses[0] : null;
    if (analysis) {
      this.selectedIndex = ri;
      // this.router.navigate([uom.uomId], { relativeTo: this.route });
    } else {
      this.selectedIndex = -1;
    }
  }

  clickSelectEvent(item: WorkEffortAnalysis) {
    this.currentAnalysis = item;

  }

  routingDetail(data){
    this.router.navigate([`${data.workEffortAnalysisId}`], {relativeTo: this.route} )
    console.log(data.workEffortAnalysisId);
  }

}
