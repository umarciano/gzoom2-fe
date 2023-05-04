import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import {  map, mergeWith, mergeMap } from 'rxjs/operators';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { SelectItem } from '../../../commons/model/selectitem';
import { Message } from '../../../commons/model/message';
import { I18NService } from '../../../i18n/i18n.service';
import { QueryConfig } from './query-config';
import { QueryConfigService } from '../../../api/service/query-config.service';
import { HeadArray, HeadFilter, ActionInput, ActionOutput} from 'app/layout/table/table-configuration';

/** Convert from queryConfig[] to SelectItem[] */
function queryConfig2SelectItems(types: QueryConfig[]): SelectItem[] {
  return types.map((qc: QueryConfig) => {
    return {label: qc.queryName, value: qc.queryId};
  });
}

@Component({
  selector: 'app-query-config',
  templateUrl: './query-config.component.html',
  styleUrls: ['./query-config.component.css']
})
export class QueryConfigComponent implements OnInit {

  _reload: Subject<void>;
  displayDialog: boolean;
  error = '';
  msgs: Message[] = [];
  newQueryConfig: boolean = false;
  selectedIndex = -1;
  selectedQueryConfig: QueryConfig;
  queryConfig: QueryConfig = new QueryConfig();
  queryConfigs: QueryConfig[];
  queryConfigSelectItem: SelectItem[] = [];
  queryPreview: string;
  parentTypeId: string;
  queryType: string;
  classSelected: string;
  itemsButtonSlideMenu: MenuItem[];
  gridArray: any[] = [];
  form: { [name: string]: FormGroup | FormControl | FormArray };

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none", filter: HeadFilter.null },
    { head: '', fieldName: 'id', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none", filter: HeadFilter.null },
    { head: this.i18nService.translate('Code'), fieldName: 'queryCode', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, sortIcon:true },
    { head: this.i18nService.translate('Name'), fieldName: 'queryName', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, sortIcon:true },
    { head: this.i18nService.translate('Description'), fieldName: 'queryComm', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, sortIcon:true },
    { head: this.i18nService.translate('Tipologia'), fieldName: 'queryType', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.dropdownFilter, sortIcon:true },
    { head: this.i18nService.translate('Contesto'), fieldName: 'queryCtx', actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, display: "table-cell", filter: HeadFilter.textFilter, sortIcon:true }];

  filterArray = ['queryCode', 'queryName', 'queryComm', 'queryType', 'queryCtx'];

  constructor(private readonly confirmationService: ConfirmationService,
    private readonly queryConfigService: QueryConfigService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private fb: FormBuilder) {
      this._reload = new Subject<void>();
     }

  ngOnInit() {

    this.form = {};
    
    this.route.paramMap.subscribe(paramMap => {
      this.parentTypeId = paramMap.get('context');
      this.queryType = paramMap.get('id');
    });

    if(!!this.parentTypeId){
      this.headArray[5].display="none";
      this.headArray[6].display="none";
    }else{
      this.headArray[5].display="table-cell";
      this.headArray[6].display="table-cell";
    }

    console.log("Query parameter: "+  this.parentTypeId + this.queryType);
    
    const reloadedQuerys = this._reload.pipe(mergeMap(() => this.queryConfigService.queryConfigs(this.parentTypeId, this.queryType)));

    const queryConfigObs = this.route.data.pipe(
      map((data: { queryConfigs: QueryConfig[] }) => data.queryConfigs),
      mergeWith(reloadedQuerys)
    );

    queryConfigObs.subscribe((data) => {
      this.queryConfigs = data;
      console.log("@QUERY CONFIG", data);

      this.gridArray = [];
      data.forEach((element, index) => {
        this.gridArray.push({
          id: element.queryCode,
          idNumber: index,
          queryId: element.queryId,
          queryCode: element.queryCode,
          queryName: element.queryName,
          queryComm: element.queryComm,
          queryType: element.queryType,
          queryCtx: element.queryCtx,
          buttonDetails: true
        })
      })

      // var tempArray = String[20] = [];
      // data.forEach(element => {
      //   if(!(tempArray.includes(element.queryType))){
      //     tempArray.push(element.queryType);
      //     this.queryConfigType = [{ label: element.queryType, value: element.queryType }, ...this.queryConfigType];
      //   }
      // })
      // tempArray = [];
    });

     
  }

  onRowSelect(data) {    
    // const query = querys && querys.length ? querys[0] : null;
    if (data.data.queryCode) {      
      this.selectedIndex = data.data.idNumber;
      this.classSelected = 'rowSelected';
      this.router.navigate([data.data.queryId], { relativeTo: this.route });
    } else {
      this.selectedIndex = -1;
      this.classSelected = '';
    }
  }

  closeRow() {
    console.log("@ CLOSE");

    this.selectedIndex = -1;
    this.classSelected = '';
    if (this.parentTypeId && this.queryType) {
    this.router.navigate([`../${this.queryType}`], { relativeTo: this.route.parent });
    } else {
    this.router.navigate(['../queryconfig'], { relativeTo: this.route.parent });
    }
  }

  showDialog(ri: number) {
        this.error = '';
        this.displayDialog = true;
        this.queryConfig = this.queryConfigs[ri];
      }
}



