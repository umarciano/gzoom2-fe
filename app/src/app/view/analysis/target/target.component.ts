import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkEffortAnalysisService } from 'app/api/service/work-effort-analysis.service';
import { I18NService } from 'app/i18n/i18n.service';
import { MenuItem } from 'primeng/api';
import { WorkEffortAnalysis } from 'app/api/model/workEffortAnalysis';
import { WorkEffortAnalysisTarget } from 'app/api/model/workEffortAnalysisTarget'
import { map, mergeMap, mergeWith, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UomRangeValues } from 'app/view/ctx-ba/uom/range-values/uom-range-values';
import { UomRangeValuesService } from 'app/api/service/uom-range-values.service';
import { gaugeConfig } from 'app/layout/gauge/gaugeConfig';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { chartConfig } from 'app/layout/chart/chartConfig';
import { GlAccountService } from 'app/api/service/gl-account.service';
import { emoticonCard } from 'app/layout/emoticon-card/emoticonCard';
import { LanguageService } from 'app/api/service/language.service';
import { radioButton } from 'app/layout/radio-button/radioButton';

interface Chart {
  name: string,
  code: string
}

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TargetComponent implements OnInit {
  secondaryLang: boolean;

  precision: number;

  items: MenuItem[];
  tmpItems: MenuItem[];
  home: MenuItem;
  header: boolean;

  analyses: WorkEffortAnalysis[];
  analysis: WorkEffortAnalysis;
  context: string;
  analysisId: string;
  analysisDesc: string;
  workEffortObs: Observable<WorkEffortAnalysisTarget[]>;

  comments: Map<string, string>;
  detailScore: string;
  mainScore: string;
  nameDetail: string;
  nameKPI: string;
  noKPI: string;

  _reload: Subject<void>;
  targets: WorkEffortAnalysisTarget;
  uomRangeValues: Observable<UomRangeValues[]>;
  maxValuePromise: Promise<number>;
  minValueObs: Observable<number>;
  maxValue: number;

  /* gaugeConfig1..4 header gauge configuration variables */
  gaugeConfig1: gaugeConfig = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };
  gaugeConfig2: gaugeConfig = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };
  gaugeConfig3: gaugeConfig = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };
  gaugeConfig4: gaugeConfig = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };


  tmpGaugeConfig: gaugeConfig[] = [
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch1 header
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch2 header
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch3 header
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch4 header
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch1 table
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch2 table
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch3 table
    { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch4 table
  ];


  srcImg1: string;
  srcImg2: string;
  srcImg3: string;
  srcImg4: string;
  srcImgSC: string;
  srcImgST: string;
  srcImgSC2: string;
  srcImgST2: string;

  scoreEtch1: string;
  scoreEtch2: string;
  scoreEtch3: string;
  scoreEtch4: string;
  etchScore1: string;
  etchScore2: string;
  etchScore3: string;
  etchScore4: string;

  otherAnalysisEtch1: string;
  otherAnalysisEtch2: string;
  otherAnalysisEtch3: string;
  otherAnalysisEtch4: string;

  showEtchDescr: string;

  value1: number;
  value2: number;
  value3: number;
  value4: number;

  form: { [name: string]: FormGroup | FormControl | FormArray };
  formKPI: { [name: string]: FormGroup | FormControl | FormArray };

  gridArray: any[] = [];
  tmpGridArray: any[] = [];
  gridArrayKPI: any[] = [];
  tmpGridArrayKPI: any[] = [];

  chartItems: Chart[];
  selectedChart: Chart;

  radioButtonChart: radioButton = { selectedItem: null, items: null};

  disButtSliMenu: boolean = true;

  emoticonCardConftmp1: emoticonCard = { text: null, value: null, iconContentId: null };
  emoticonCardConftmp2: emoticonCard = { text: null, value: null, iconContentId: null };
  emoticonCardConftmp3: emoticonCard = { text: null, value: null, iconContentId: null };
  emoticonCardConftmp4: emoticonCard = { text: null, value: null, iconContentId: null };

  emoticonCardConf1: emoticonCard = { text: null, value: null, iconContentId: null };
  emoticonCardConf2: emoticonCard = { text: null, value: null, iconContentId: null };
  emoticonCardConf3: emoticonCard = { text: null, value: null, iconContentId: null };
  emoticonCardConf4: emoticonCard = { text: null, value: null, iconContentId: null };


  /* ####### config for table component ########## */

  headArray = [
    { head: '', fieldName: '', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", sortIcon: true },
    { head: '', fieldName: '', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", linkImg: null, value: null, sortIcon: true },
    { head: '', fieldName: 'idNumber', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", gaugeConfig: null, sortIcon: false },
    { head: this.i18nService.translate('Type and description'), fieldName: 'workEffortName', actionInput: 'null', actionOutput: 'outputClickLabelData', display: "table-cell", filter: "textFilter", sortIcon: true },
  ];
  headArrayKPI = [
    { head: '', fieldName: '', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", linkImg: null, value: null, sortIcon: false },
    { head: '', fieldName: 'idNumber', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", gaugeConfig: null },
    { head: this.i18nService.translate('Indicator'), fieldName: 'indicator', actionInput: 'null', actionOutput: 'outputLabelData', display: "table-cell", filter: "textFilter", sortIcon: true },

  ];

  itemsButtonSlideMenu: MenuItem[] = [];

  tmpChartConfig: chartConfig = { type: null, etch: [], labels: [], rangeMaxName: null, dataMax: [], dataCon: [], dataSC: [], dataST: [], dataSC2: [], dataST2: [], scoreEtch1: null, scoreEtch2: null, scoreEtch3: null, scoreEtch4: null, showEtchDescr: null};
  chartConfig: chartConfig = { type: null, etch: [], labels: [], rangeMaxName: null, dataMax: [], dataCon: [], dataSC: [], dataST: [], dataSC2: [], dataST2: [], scoreEtch1: null, scoreEtch2: null, scoreEtch3: null, scoreEtch4: null, showEtchDescr: null };




  constructor(
    private readonly workEffortAnalysisService: WorkEffortAnalysisService,
    private readonly uomRangeValuesService: UomRangeValuesService,
    private readonly glAccountService: GlAccountService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly i18nService: I18NService,
    private readonly languageService: LanguageService
  ) {

    this._reload = new Subject<void>();
    this.chartItems = [
      { name: 'RADAR', code: 'radar' },
      { name: this.i18nService.translate('BAR'), code: 'bar' },
      { name: this.i18nService.translate('LINE'), code: 'line' },
      { name: this.i18nService.translate('PIE'), code: 'pie' },

    ];
    this.selectedChart = { name: 'RADAR', code: 'radar' };

    this.radioButtonChart.items = [
      { name: this.i18nService.translate('Label'), key: 'E' },
      { name: this.i18nService.translate('Description'), key: 'D' },
      { name: this.i18nService.translate('All'), key: 'A' },
      
      
    ];
    this.radioButtonChart.selectedItem = {name: this.i18nService.translate('Label'), key: 'E'};

    this.noKPI = this.i18nService.translate("There are no indicators to display");

  }


  ngOnInit() {

    this.form = {};
    this.formKPI = {};

    this.header = false;

    this.route.paramMap.subscribe(paramMap => {
      this.context = paramMap.get('context');
      this.analysisId = paramMap.get('analysisId');

      this.tmpItems = [{ label: `${this.analysisId}`, url: this.router.url }];

      this.items = [{ label: `${this.analysisId}`, url: this.router.url }];
      this.analyses = [];
    });



    const reloadedAnalyses = this._reload.pipe(mergeMap(() => this.workEffortAnalysisService.getWorkEffortAnalysisTargetSummary(this.context, this.analysisId)));

    const analysesObs = this.route.data.pipe(
      map((data: { analyses: any[] }) => data.analyses),
      mergeWith(reloadedAnalyses)
    );

    analysesObs.subscribe((data) => {
      this.analyses = data;

      //if the request return 0 element
      if (data.length == 0) {
        this.header = true;
        this.analysisDesc = this.i18nService.translate("There is no data to display");
      }

      this.glAccountService.getPrecisionDecimal().then(async pcs => {
        this.precision = pcs;

        //if the request return 1 element
        if (data.length == 1) {
          this.header = true;
          this.analysis = (<any>this.analyses[0]).workEffort;

          if (!!this.analyses[0].comments) {
            this.secondaryLang = await this.languageService.secondaryLang();
            
            this.comments = this.getComments(this.analyses[0].comments);
            this.nameDetail = (!this.secondaryLang) ? this.comments.get('nameDetail') : this.comments.get('nameDetailLang'); //first folder name
            this.nameKPI = (!this.secondaryLang) ? this.comments.get('nameKPI') : this.comments.get('nameKPILang');       //second folder name
            await this.setScoreEtch(); //translate and set the scoreEtch1..4


            this.setButtonSlideMenu(this.analysisId);

            const headerObs = this.workEffortAnalysisService.getWorkEffortAnalysisTargetHeaderOne(this.analysisId, this.analysis.workEffortId);

            headerObs.subscribe((element) => {
              this.targets = <WorkEffortAnalysisTarget>element[0];

              this.analysisDesc = this.targets.workEffortName;

              let dataId = { id: this.targets.workEffortId }

              this.setValueHeader(this.targets);

              if (this.comments.get('mainScore') == 'EMOTICON') {

                this.mainScore = "EMOTICON";
                this.setSrcImgHeader(this.targets);
                this.routingDetail(dataId);
              }

              if (this.comments.get('mainScore') == 'GAUGE') {

                this.mainScore = "GAUGE";
                this.uomRangeValuesService.uomRangeValues(this.comments.get('rangeDefault')).subscribe(data => {
                  data.forEach(e => {

                    if (e.colorEnumId == "GREEN") this.tmpGaugeConfig.forEach(conf => conf.fromValueGreen = e.fromValue);
                    if (e.colorEnumId == "YELLOW") this.tmpGaugeConfig.forEach(conf => conf.fromValueYellow = e.fromValue);
                    if (e.colorEnumId == "RED") this.tmpGaugeConfig.forEach(conf => conf.fromValueRed = e.fromValue);

                  });

                  this.maxValuePromise = this.uomRangeValuesService.uomRangeValuesMax(this.comments.get('rangeDefault'));

                  this.maxValuePromise.then(
                    response => {
                      this.maxValue = response
                      this.tmpGaugeConfig.forEach(conf => conf.gaugeMax = response);

                      this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));

                      this.minValueObs.subscribe(min => {

                        this.tmpGaugeConfig.forEach(conf => conf.gaugeMin = min);

                        this.tmpGaugeConfig[0].gaugeValue = this.value1;
                        this.gaugeConfig1 = this.tmpGaugeConfig[0];

                        this.tmpGaugeConfig[1].gaugeValue = this.value2;
                        this.gaugeConfig2 = this.tmpGaugeConfig[1];

                        this.tmpGaugeConfig[2].gaugeValue = this.value3;
                        this.gaugeConfig3 = this.tmpGaugeConfig[2];

                        this.tmpGaugeConfig[3].gaugeValue = this.value4;
                        this.gaugeConfig4 = this.tmpGaugeConfig[3];

                        this.routingDetail(dataId);

                      })

                    })
                })
              }

              if (!!this.comments.get('detailKPI')) this.setDetailKPI(dataId.id);
            })

          }
          else this.analysisDesc = this.i18nService.translate("Parameterization missing");


        }
        if (data.length > 1) {

          this.header = true;
          this.analysis = (<any>this.analyses[0]).workEffort;

          if (!!this.analyses[0].comments) {
            this.secondaryLang = await this.languageService.secondaryLang();
            this.comments = this.getComments(this.analyses[0].comments);
            this.nameDetail = (!this.secondaryLang ) ? this.comments.get('nameDetail') : this.comments.get('nameDetailLang'); //first folder name
            this.nameKPI = (!this.secondaryLang ) ? this.comments.get('nameKPI') : this.comments.get('nameKPILang');       //second folder name
            await this.setScoreEtch(); //set the scoreEtch1..4 and scoreEtchLang1..4

            this.setButtonSlideMenu(this.analysisId);

            const headerObs = this.workEffortAnalysisService.getWorkEffortAnalysisTargetHeaderMore(this.context, this.analysisId);
            headerObs.subscribe(element => {

              this.targets = <WorkEffortAnalysisTarget>element[0];

              this.analysisDesc = this.analysisId;

              this.setValueHeader(this.targets);


              if (this.comments.get('mainScore') == 'EMOTICON') {
                this.mainScore = "EMOTICON";
                let index;

                if (!!this.value1) {
                  this.uomRangeValuesService.uomRangeValuesPathEmoticon(this.comments.get('rangeDefault'), this.value1).subscribe(v => {
                    if (!!v[0].dataResource.objectInfo) {
                      index = v[0].dataResource.objectInfo.indexOf("resources")
                      this.srcImg1 = v[0].dataResource.objectInfo.substring(index - 1);

                      this.emoticonCardConftmp1.iconContentId = v[0].iconContentId;
                      this.emoticonCardConftmp1.text = this.scoreEtch1;
                      this.emoticonCardConf1 = this.emoticonCardConftmp1;

                    }

                  })
                }
                if (!!this.value2) {
                  this.uomRangeValuesService.uomRangeValuesPathEmoticon(this.comments.get('rangeDefault'), this.value2).subscribe(v => {

                    if (!!v[0].dataResource.objectInfo) {
                      index = v[0].dataResource.objectInfo.indexOf("resources")
                      this.srcImg2 = v[0].dataResource.objectInfo.substring(index - 1);

                      this.emoticonCardConftmp2.iconContentId = v[0].iconContentId;
                      this.emoticonCardConftmp2.text = this.scoreEtch2;
                      this.emoticonCardConf2 = this.emoticonCardConftmp2;
                    }

                  })
                }
                if (!!this.value3) {
                  this.uomRangeValuesService.uomRangeValuesPathEmoticon(this.comments.get('rangeDefault'), this.value3).subscribe(v => {

                    if (!!v[0].dataResource.objectInfo) {
                      index = v[0].dataResource.objectInfo.indexOf("resources")
                      this.srcImg3 = v[0].dataResource.objectInfo.substring(index - 1);

                      this.emoticonCardConftmp3.iconContentId = v[0].iconContentId;
                      this.emoticonCardConftmp3.text = this.scoreEtch3;
                      this.emoticonCardConf3 = this.emoticonCardConftmp3;
                    }

                  })
                }
                if (!!this.value4) {
                  this.uomRangeValuesService.uomRangeValuesPathEmoticon(this.comments.get('rangeDefault'), this.value4).subscribe(v => {

                    if (!!v[0].dataResource.objectInfo) {
                      index = v[0].dataResource.objectInfo.indexOf("resources")
                      this.srcImg4 = v[0].dataResource.objectInfo.substring(index - 1);

                      this.emoticonCardConftmp4.iconContentId = v[0].iconContentId;
                      this.emoticonCardConftmp4.text = this.scoreEtch4;
                      this.emoticonCardConf4 = this.emoticonCardConftmp4;
                    }

                  })
                }
                this.configDetailScore();

              }


              if (this.comments.get('mainScore') == 'GAUGE') {

                this.mainScore = "GAUGE";
                this.uomRangeValuesService.uomRangeValues(this.comments.get('rangeDefault')).subscribe(data => {
                  data.forEach(e => {

                    if (e.colorEnumId == "GREEN") this.tmpGaugeConfig.forEach(conf => conf.fromValueGreen = e.fromValue);
                    if (e.colorEnumId == "YELLOW") this.tmpGaugeConfig.forEach(conf => conf.fromValueYellow = e.fromValue);
                    if (e.colorEnumId == "RED") this.tmpGaugeConfig.forEach(conf => conf.fromValueRed = e.fromValue);

                  });

                  this.maxValuePromise = this.uomRangeValuesService.uomRangeValuesMax(this.comments.get('rangeDefault'));

                  this.maxValuePromise.then(
                    response => {
                      this.maxValue = response
                      this.tmpGaugeConfig.forEach(conf => conf.gaugeMax = response);

                      this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));

                      this.minValueObs.subscribe(min => {

                        this.tmpGaugeConfig.forEach(conf => conf.gaugeMin = min);

                        this.tmpGaugeConfig[0].gaugeValue = this.value1;
                        this.gaugeConfig1 = this.tmpGaugeConfig[0];

                        this.tmpGaugeConfig[1].gaugeValue = this.value2;
                        this.gaugeConfig2 = this.tmpGaugeConfig[1];

                        this.tmpGaugeConfig[2].gaugeValue = this.value3;
                        this.gaugeConfig3 = this.tmpGaugeConfig[2];

                        this.tmpGaugeConfig[3].gaugeValue = this.value4;
                        this.gaugeConfig4 = this.tmpGaugeConfig[3];

                        this.configDetailScore();

                      })

                    })
                })
              }

            })

            //if(!!this.comments.get('detailKPI')) this.setDetailKPI();
          } else this.analysisDesc = this.i18nService.translate("Parameterization missing");
        }

      });
    })

  }

  /**
   * This function sets the detail score and calls the configData() function.
   */
  configDetailScore() {

    if (this.comments.get('detailScore') == "EMOTICON_LIST") {
      this.detailScore = "EMOTICON_LIST";
      this.headArrayEmoticonList();
      this.configData();
    }

    if (this.comments.get('detailScore') == "GAUGE_LIST") {
      this.detailScore = "GAUGE_LIST";


      if (this.comments.get('mainScore') != "GAUGE") {

        this.uomRangeValuesService.uomRangeValues(this.comments.get('rangeDefault')).subscribe(data => {
          data.forEach(e => {

            if (e.colorEnumId == "GREEN") this.tmpGaugeConfig.forEach(conf => conf.fromValueGreen = e.fromValue);
            if (e.colorEnumId == "YELLOW") this.tmpGaugeConfig.forEach(conf => conf.fromValueYellow = e.fromValue);
            if (e.colorEnumId == "RED") this.tmpGaugeConfig.forEach(conf => conf.fromValueRed = e.fromValue);

          });

          this.maxValuePromise = this.uomRangeValuesService.uomRangeValuesMax(this.comments.get('rangeDefault'));

          this.maxValuePromise.then(
            response => {
              this.maxValue = response;
              this.tmpGaugeConfig.forEach(conf => conf.gaugeMax = response);

              this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));

              this.minValueObs.subscribe(min => {

                this.tmpGaugeConfig.forEach(conf => conf.gaugeMin = min);
                this.headArrayGaugeList();
                this.configData();
              })


            })


        })
      } else {
        this.headArrayGaugeList();
        this.configData();
      }

    }

    if (this.comments.get('detailScore') == "RADAR") {
      this.detailScore = "CHART";
      this.selectedChart = { name: 'RADAR', code: 'radar' };
      this.tmpChartConfig.type = 'radar';
      this.headArrayConfChart();
      this.configData();
    }

    if (this.comments.get('detailScore') == "LINE") {
      this.detailScore = "CHART";
      this.selectedChart = { name: this.i18nService.translate('LINE'), code: 'line' };
      this.tmpChartConfig.type = 'line';
      this.headArrayConfChart();
      this.configData();
    }

    if (this.comments.get('detailScore') == "BAR") {
      this.detailScore = "CHART";
      this.selectedChart = { name: this.i18nService.translate('BAR'), code: 'bar' };
      this.tmpChartConfig.type = 'bar';
      this.headArrayConfChart();
      this.configData();
    }

    if (this.comments.get('detailScore') == "PIE") {
      this.detailScore = "CHART";
      this.selectedChart = { name: this.i18nService.translate('PIE'), code: 'pie' };
      this.tmpChartConfig.type = 'pie';
      this.headArrayConfChart();
      this.configData();
    }

    if (this.comments.get('detailScore') == "POLAR") {
      this.detailScore = "CHART";
      this.selectedChart = { name: this.i18nService.translate('POLAR'), code: 'polarArea' };
      this.tmpChartConfig.type = 'polarArea';
      this.headArrayConfChart();
      this.configData();
    }

    if (this.comments.get('detailScore') == "DOUGHNUT") {
      this.detailScore = "CHART";
      this.selectedChart = { name: this.i18nService.translate('DOUGHNUT'), code: 'doughnut' };
      this.tmpChartConfig.type = 'doughnut';
      this.headArrayConfChart();
      this.configData();
    }


  }



  /**
   * This function sets the gridArray for the table 
   * and defines the information for the detail score. 
   */
  configData() {

    this.workEffortObs = this.workEffortAnalysisService.getWorkEffortAnalysisTargetList(this.context, this.analysisId, (!!this.comments.get('dateControl')) ? this.comments.get('dateControl') : "NONE");

    if (this.detailScore == "CHART") {
      this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));
      this.minValueObs.subscribe(min => {

        this.tmpChartConfig.dataMin = min;
      });

      
      if (!!this.comments.get("showEtchDescr")) {
        this.tmpChartConfig.showEtchDescr = this.comments.get("showEtchDescr") ;
        this.radioButtonChart.selectedItem = this.radioButtonChart.items.filter(x => x.key === this.comments.get("showEtchDescr"))[0];

      } else {
        this.tmpChartConfig.showEtchDescr = 'E';
        this.radioButtonChart.selectedItem = this.radioButtonChart.items.filter(x => x.key === 'E')[0];

      }
    }

    this.workEffortObs.subscribe((data) => {

      if (this.detailScore == "CHART" && data.length < 3) {
        this.selectedChart = { name: this.i18nService.translate('BAR'), code: 'bar' };
        this.tmpChartConfig.type = 'bar';
      }


      data.forEach(async (element, index) => {

        if (this.comments.get('detailScore') == "EMOTICON_LIST") this.setSrcImgGridArray(element);

        let valSC, valST, valSC2, valST2;

        if (!!element.scAmount) {
          valSC = + element.scAmount;
          valSC = + valSC.toFixed(this.precision);
        }
        else valSC = null;
        if (!!element.stAmount) {
          valST = + element.stAmount;
          valST = + valST.toFixed(this.precision);
        }
        else valST = null;

        if (!!element.sc2Amount) {
          valSC2 = + element.sc2Amount;
          valSC2 = + valSC2.toFixed(this.precision);
        }
        else valSC2 = null;

        if (!!element.st2Amount) {
          valST2 = + element.st2Amount;
          valST2 = + valST2.toFixed(this.precision);
        }
        else valST2 = null

        let workEffortName = (!this.secondaryLang)? element.workEffortName : element.workEffortNameLang;

        this.tmpGridArray.push({
          // id: index,
          id: element.workEffortId,
          workEffortName: (!!element.workEffortEtch)? element.workEffortEtch + " - " + workEffortName : workEffortName,
          scoreEtch1: { amount: valSC, linkImg: this.srcImgSC },
          scoreEtch2: { amount: valST, linkImg: this.srcImgST },
          scoreEtch3: { amount: valSC2, linkImg: this.srcImgSC2 },
          scoreEtch4: { amount: valST2, linkImg: this.srcImgST2 },
          buttonDetails: true,
        })

        if (this.detailScore == "CHART") { await this.configChart(element); }


      });

      console.log(this.tmpGridArray);

      this.gridArray = this.tmpGridArray;

    })

  }

  /**
   * This function get comments from a string.
   * 
   * @param str - String
   * @returns Map<string, string>
   */
  getComments(str): Map<string, string> {

    const map = new Map();

    str.replaceAll(/\n\s/g, "").replaceAll("\"", "").split(";").map(item => { map.set(item.trim().split("=")[0], item.trim().split("=")[1]) });

    return map;
  }

  /**
   * This function set the scoreEtch1..4 with scoreEtch1..4 or scoreEtchLang1..4 in comments.
   * Finally set the available graphs.
   */
  async setScoreEtch() {

    if (!this.secondaryLang) {

      if (!!this.comments.get('scoreEtch1')) this.scoreEtch1 = this.comments.get('scoreEtch1');
      if (!!this.comments.get('scoreEtch2')) this.scoreEtch2 = this.comments.get('scoreEtch2');
      if (!!this.comments.get('scoreEtch3')) this.scoreEtch3 = this.comments.get('scoreEtch3');
      if (!!this.comments.get('scoreEtch4')) this.scoreEtch4 = this.comments.get('scoreEtch4');

    }
    else {

      if (!!this.comments.get('scoreEtchLang1')) this.scoreEtch1 = this.comments.get('scoreEtchLang1');
      if (!!this.comments.get('scoreEtchLang2')) this.scoreEtch2 = this.comments.get('scoreEtchLang2');
      if (!!this.comments.get('scoreEtchLang3')) this.scoreEtch3 = this.comments.get('scoreEtchLang3');
      if (!!this.comments.get('scoreEtchLang4')) this.scoreEtch4 = this.comments.get('scoreEtchLang4');

    }

    if (this.myXOR(!!this.scoreEtch1, !!this.scoreEtch2, !!this.scoreEtch3, !!this.scoreEtch4)) {

      this.chartItems.push(
        { name: this.i18nService.translate('POLAR'), code: 'polarArea' },
        { name: this.i18nService.translate('DOUGHNUT'), code: 'doughnut' },
      );

    }

  }

  async setEtchScore() {
    if (!this.secondaryLang ) {
      if (!!this.comments.get('etchScore1')) this.etchScore1 = this.comments.get('etchScore1');
      if (!!this.comments.get('etchScore2')) this.etchScore2 = this.comments.get('etchScore2');
      if (!!this.comments.get('etchScore3')) this.etchScore3 = this.comments.get('etchScore3');
      if (!!this.comments.get('etchScore4')) this.etchScore4 = this.comments.get('etchScore4');

    }
    else {
      if (!!this.comments.get('etchScoreLang1')) this.etchScore1 = this.comments.get('etchScoreLang1');
      if (!!this.comments.get('etchScoreLang2')) this.etchScore2 = this.comments.get('etchScoreLang2');
      if (!!this.comments.get('etchScoreLang3')) this.etchScore3 = this.comments.get('etchScoreLang3');
      if (!!this.comments.get('etchScoreLang4')) this.etchScore4 = this.comments.get('etchScoreLang4');

    }

  }

  /**
   * This function perform the logical xor operation.
   * 
   * @param value - values
   * @returns - The result of the operation.
   */
  myXOR(...value) {
    let result = false;
    value.map((e) => { result = (e || result) && !(e && result) });
    return result;
  }

  /**
   * Sets the button slide menu in the header.
   * 
   * @param id
   */
  setButtonSlideMenu(id) {

    /*Collegamento all'interrogazione di una scheda*/
    /*this.itemsButtonSlideMenu.push({
      label: 'Scheda',
      icon: 'pi pi-angle-right',
      command: () => this.openRecordCard(id)
    });*/

    if (!!this.comments.get('otherAnalysisEtch1')) {

      this.itemsButtonSlideMenu.push({
        label: this.i18nService.translate(this.comments.get('otherAnalysisEtch1')),
        icon: 'pi pi-angle-right',
        command: () => this.toWorkEffort(this.comments.get('otherAnalysisId1'))

      })
      this.otherAnalysisEtch1 = this.i18nService.translate(this.comments.get('otherAnalysisEtch1'));
    }

    if (!!this.comments.get('otherAnalysisEtch2')) {

      this.itemsButtonSlideMenu.push({
        label: this.i18nService.translate(this.comments.get('otherAnalysisEtch2')),
        icon: 'pi pi-angle-right',
        command: () => this.toWorkEffort(this.comments.get('otherAnalysisId2'))

      })
      this.otherAnalysisEtch2 = this.i18nService.translate(this.comments.get('otherAnalysisEtch2'));
    }
    if (!!this.comments.get('otherAnalysisEtch3')) {
      this.itemsButtonSlideMenu.push({
        label: this.i18nService.translate(this.comments.get('otherAnalysisEtch3')),
        icon: 'pi pi-angle-right',
        command: () => this.toWorkEffort(this.comments.get('otherAnalysisId3'))

      })
      this.otherAnalysisEtch3 = this.i18nService.translate(this.comments.get('otherAnalysisEtch3'));
    }
    if (!!this.comments.get('otherAnalysisEtch4')) {
      this.itemsButtonSlideMenu.push({
        label: this.i18nService.translate(this.comments.get('otherAnalysisEtch4')),
        icon: 'pi pi-angle-right',
        command: () => this.toWorkEffort(this.comments.get('otherAnalysisId4'))

      })
      this.otherAnalysisEtch4 = this.i18nService.translate(this.comments.get('otherAnalysisEtch4'));
    }

    if (!!this.otherAnalysisEtch1 || !!this.otherAnalysisEtch2 || !!this.otherAnalysisEtch3 || !!this.otherAnalysisEtch4) this.disButtSliMenu = false;

  }

  /**
   * 
   * @param id 
   */
  openRecordCard(id) {
    console.log(id);

  }

  /**
   * Given an analysis id, this function opens the corresponding analysis page.
   * 
   * @param analysisId - Analysis id.
   */
  toWorkEffort(analysisId) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(`/c/${this.context}/analysis/${analysisId}`);
  }


  /**
   * This function set the values to be displayed in the header.
   * 
   * @param target - Target.
   */
  setValueHeader(target: WorkEffortAnalysisTarget) {
    if (!!target.scAmount) {
      this.value1 = + target.scAmount;
      this.value1 = + this.value1.toFixed(this.precision);
      this.emoticonCardConftmp1.value = this.value1;
    }
    else this.value1 = null;

    if (!!target.stAmount) {
      this.value2 = + target.stAmount;
      this.value2 = + this.value2.toFixed(this.precision);
      this.emoticonCardConftmp2.value = this.value2;
    }
    else this.value2 = null;

    if (!!target.sc2Amount) {
      this.value3 = + target.sc2Amount;
      this.value3 = + this.value3.toFixed(this.precision);
      this.emoticonCardConftmp3.value = this.value3;
    }
    else this.value3 = null;

    if (!!target.st2Amount) {
      this.value4 = + target.st2Amount;
      this.value4 = + this.value4.toFixed(this.precision);
      this.emoticonCardConftmp4.value = this.value4;
    }
    else this.value4 = null
  }


  /**
   * This function configures the variable chartConfig to set the chart.
   * 
   * @param element - The target to add.
   */
  async configChart(element: WorkEffortAnalysisTarget) {
    (!!element.workEffortEtch) ? this.tmpChartConfig.etch.push(element.workEffortEtch) : this.tmpChartConfig.etch.push('');
    let workEffortName = (!this.secondaryLang)? element.workEffortName : element.workEffortNameLang;
    (!!workEffortName) ? this.tmpChartConfig.labels.push(workEffortName) : this.tmpChartConfig.labels.push('');

    if (!!this.comments.get('rangeMaxName')) {
      this.tmpChartConfig.rangeMaxName = this.comments.get('rangeMaxName');

      await this.uomRangeValuesService.uomRangeValuesMax(this.comments.get('rangeDefault')).then(response => {
        this.tmpChartConfig.dataMax.push(response);
        this.setChartConfig(element)
      });

    }
    else this.setChartConfig(element);

  }


  /**
   * This function sets the quantities in the dataset for the chart.
   * 
   * @param element - Target.
   */
  setChartConfig(element: WorkEffortAnalysisTarget) {
    if (!!this.scoreEtch1) {
      this.tmpChartConfig.scoreEtch1 = this.scoreEtch1;
      (!!element.scAmount) ? this.tmpChartConfig.dataSC.push(+element.scAmount) : this.tmpChartConfig.dataSC.push(null);
    }
    if (!!this.scoreEtch2) {
      this.tmpChartConfig.scoreEtch2 = this.scoreEtch2;
      (!!element.stAmount) ? this.tmpChartConfig.dataTar.push(+element.stAmount) : this.tmpChartConfig.dataST.push(null);
    }

    if (!!this.scoreEtch3) {
      this.tmpChartConfig.scoreEtch3 = this.scoreEtch3;
      (!!element.sc2Amount) ? this.tmpChartConfig.dataSC2.push(element.sc2Amount) : this.tmpChartConfig.dataSC2.push(null);
    }

    if (!!this.scoreEtch4) {
      this.tmpChartConfig.scoreEtch4 = this.scoreEtch4;
      (!!element.st2Amount) ? this.tmpChartConfig.dataST2.push(element.st2Amount) : this.tmpChartConfig.dataST2.push(null);
    }


    this.chartConfig = { ...this.tmpChartConfig };


  }

  /**
   * Set the type of chart selected from the dropdown.
   */
  setChartType() {

    this.tmpChartConfig.type = this.selectedChart.code;
    this.tmpChartConfig = { ...this.tmpChartConfig };
    this.chartConfig = this.tmpChartConfig;
  }

  /**
   * Set the headArray for the emoticon list.
   */
  headArrayEmoticonList() {

    if (!!this.scoreEtch1) this.headArray.push({ head: `${this.scoreEtch1}`, fieldName: 'scoreEtch1', actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
    if (!!this.scoreEtch2) this.headArray.push({ head: `${this.scoreEtch2}`, fieldName: 'scoreEtch2', actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
    if (!!this.scoreEtch3) this.headArray.push({ head: `${this.scoreEtch3}`, fieldName: 'scoreEtch3', actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
    if (!!this.scoreEtch4) this.headArray.push({ head: `${this.scoreEtch4}`, fieldName: 'scoreEtch4', actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });

  }

  /**
   * Set the headArray for the gauge list.
   */
  headArrayGaugeList() {
    if (!!this.scoreEtch1) this.headArray.push({ head: `${this.scoreEtch1}`, fieldName: 'scoreEtch1', actionInput: 'null', actionOutput: 'actionGauge', display: "table-cell", filter: "null", gaugeConfig: this.tmpGaugeConfig[4], sortIcon: false });
    if (!!this.scoreEtch2) this.headArray.push({ head: `${this.scoreEtch2}`, fieldName: 'scoreEtch2', actionInput: 'null', actionOutput: 'actionGauge', display: "table-cell", filter: "null", gaugeConfig: this.tmpGaugeConfig[5], sortIcon: false });
    if (!!this.scoreEtch3) this.headArray.push({ head: `${this.scoreEtch3}`, fieldName: 'scoreEtch3', actionInput: 'null', actionOutput: 'actionGauge', display: "table-cell", filter: "null", gaugeConfig: this.tmpGaugeConfig[6], sortIcon: false });
    if (!!this.scoreEtch4) this.headArray.push({ head: `${this.scoreEtch4}`, fieldName: 'scoreEtch4', actionInput: 'null', actionOutput: 'actionGauge', display: "table-cell", filter: "null", gaugeConfig: this.tmpGaugeConfig[7], sortIcon: false });

  }

  /**
   * Set the headArray for the chart configuration.
   */
  headArrayConfChart() {
    if (!!this.scoreEtch1) this.headArray.push({ head: `${this.scoreEtch1}`, fieldName: 'scoreEtch1', actionInput: 'null', actionOutput: 'actionAmount', display: "table-cell", filter: "null", sortIcon: false });
    if (!!this.scoreEtch2) this.headArray.push({ head: `${this.scoreEtch2}`, fieldName: 'scoreEtch2', actionInput: 'null', actionOutput: 'actionAmount', display: "table-cell", filter: "null", sortIcon: false });
    if (!!this.scoreEtch3) this.headArray.push({ head: `${this.scoreEtch3}`, fieldName: 'scoreEtch3', actionInput: 'null', actionOutput: 'actionAmount', display: "table-cell", filter: "null", sortIcon: false });
    if (!!this.scoreEtch4) this.headArray.push({ head: `${this.scoreEtch4}`, fieldName: 'scoreEtch4', actionInput: 'null', actionOutput: 'actionAmount', display: "table-cell", filter: "null", sortIcon: false });

  }

  /**
   * Set the src of the images to be displayed in the header.
   * 
   * @param element - Target element.
   */
  setSrcImgHeader(element: WorkEffortAnalysisTarget) {

    if (!!this.comments.get("scoreEtch1")) {
      this.emoticonCardConf1.text = this.comments.get("scoreEtch1");
      this.emoticonCardConf1.iconContentId = element.rvcIconContentId;
      this.emoticonCardConf1.value = element.scAmount;
    }

    if (!!this.comments.get("scoreEtch2")) {
      this.emoticonCardConf2.text = this.comments.get("scoreEtch2");
      this.emoticonCardConf2.iconContentId = element.rvtIconContentId;
      this.emoticonCardConf2.value = element.stAmount;
    }

    if (!!this.comments.get("scoreEtch3")) {
      this.emoticonCardConf3.text = this.comments.get("scoreEtch3");
      this.emoticonCardConf3.iconContentId = element.rvc2IconContentId;
      this.emoticonCardConf3.value = element.sc2Amount;
    }

    if (!!this.comments.get("scoreEtch4")) {
      this.emoticonCardConf4.text = this.comments.get("scoreEtch4");
      this.emoticonCardConf4.iconContentId = element.rvt2IconContentId;
      this.emoticonCardConf4.value = element.st2Amount;
    }

  }

  /**
   * Set the src of the images to be displayed in each row of the table.
   * 
   * @param element - Target element.
   */
  setSrcImgGridArray(element: WorkEffortAnalysisTarget) {

    let i;

    if (!!element.drcObjectInfo) {
      i = element.drcObjectInfo.indexOf("resources");
      this.srcImgSC = element.drcObjectInfo.substring(i - 1);
      this.srcImgSC = element.rvcIconContentId;
    }
    else this.srcImgSC = null;

    if (!!element.drtObjectInfo) {
      i = element.drtObjectInfo.indexOf("resources");
      this.srcImgST = element.drtObjectInfo.substring(i - 1);
      this.srcImgST = element.rvtIconContentId;
    }
    else this.srcImgST = null;

    if (!!element.drc2ObjectInfo) {
      i = element.drc2ObjectInfo.indexOf("resources");
      this.srcImgSC2 = element.drc2ObjectInfo.substring(i - 1);
      this.srcImgSC2 = element.rvc2IconContentId;
    }
    else this.srcImgSC2 = null;

    if (!!element.drt2ObjectInfo) {
      i = element.drt2ObjectInfo.indexOf("resources");
      this.srcImgST2 = element.drt2ObjectInfo.substring(i - 1);
      this.srcImgST2 = element.rvt2IconContentId;
    }
    else this.srcImgST2 = null;
  }

  /**
   * This function receives the clicked element in the breadcrumb 
   * and calls the routingDetail function to recalculate the data to display.
   * 
   * @param data 
   */
  onItemClick(data) {

    this.tmpItems = this.tmpItems.filter(item => this.tmpItems.indexOf(item) < this.tmpItems.indexOf(data.item));

    if (!!data.item.id) this.routingDetail(data.item.id);

  }

  /**
   * This function processes the data to be displayed given a workEffortId.
   * 
   * @param data - Element of gridArray.
   */
  async routingDetail(data) {
    this.secondaryLang =  await this.languageService.secondaryLang();

    let workEffortId = data.id;

    this.disButtSliMenu = true;
    this.mainScore = null;
    this.detailScore = null;
    this.nameDetail = null;
    this.nameKPI = null;


    this.headArray = [
      { head: '', fieldName: '', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", sortIcon: true },
      { head: '', fieldName: '', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", linkImg: null, value: null, sortIcon: false },
      { head: '', fieldName: 'idNumber', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", gaugeConfig: null, sortIcon: false },
      { head: this.i18nService.translate('Type and '), fieldName: 'workEffortName', actionInput: 'null', actionOutput: 'outputClickLabelData', display: "table-cell", filter: "textFilter", sortIcon: true },
    ];
    this.headArrayKPI = [
      { head: '', fieldName: '', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", linkImg: null, value: null, sortIcon: false },
      { head: '', fieldName: 'idNumber', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null", gaugeConfig: null },
      { head: this.i18nService.translate('Indicator'), fieldName: 'indicator', actionInput: 'null', actionOutput: 'outputLabelData', display: "table-cell", filter: "textFilter", sortIcon: true },

    ];
    this.gridArray = [];
    this.tmpGridArray = [];
    this.gridArrayKPI = [];
    this.tmpGridArrayKPI = [];
    this.scoreEtch1 = null;
    this.scoreEtch2 = null;
    this.scoreEtch3 = null;
    this.scoreEtch4 = null;
    this.etchScore1 = null;
    this.etchScore2 = null;
    this.etchScore3 = null;
    this.etchScore4 = null;

    this.srcImg1 = null;
    this.srcImg2 = null;
    this.srcImg3 = null;
    this.srcImg4 = null;
    this.srcImgSC = null;
    this.srcImgST = null;
    this.srcImgSC2 = null;
    this.srcImgST2 = null;

    this.emoticonCardConf1 = { text: null, value: null, iconContentId: null };
    this.emoticonCardConf2 = { text: null, value: null, iconContentId: null };
    this.emoticonCardConf3 = { text: null, value: null, iconContentId: null };
    this.emoticonCardConf4 = { text: null, value: null, iconContentId: null };

    /* gaugeConfig1..4 header gauge configuration variables */
    this.gaugeConfig1 = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };
    this.gaugeConfig2 = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };
    this.gaugeConfig3 = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };
    this.gaugeConfig4 = { gaugeLabel: "", gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null };


    this.tmpGaugeConfig = [
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch1 header
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch2 header
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch3 header
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch4 header
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch1 table
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch2 table
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch3 table
      { gaugeLabel: null, gaugeValue: null, gaugeMin: null, gaugeMax: null, fromValueGreen: null, fromValueRed: null, fromValueYellow: null }, //gaugeConfig scoreEtch4 table
    ];


    this.tmpChartConfig = { type: null, labels: [], etch: [], rangeMaxName: null, dataMax: [], dataCon: [], dataSC: [], dataST: [], dataSC2: [], dataST2: [], scoreEtch1: null, scoreEtch2: null, scoreEtch3: null, scoreEtch4: null };
    this.items = [];
    this.comments.clear();



    this.chartItems = [
      { name: 'RADAR', code: 'radar' },
      { name: this.i18nService.translate('BAR'), code: 'bar' },
      { name: this.i18nService.translate('LINE'), code: 'line' },
      { name: this.i18nService.translate('PIE'), code: 'pie' },

    ];
    this.selectedChart = { name: 'RADAR', code: 'radar' };
    this.itemsButtonSlideMenu = [];



    this.workEffortObs = this.workEffortAnalysisService.getWorkEffortAnalysisHeader(this.analysisId, workEffortId);

    this.workEffortObs.subscribe(async element => {

      if (element.length == 0) this.analysisDesc = this.i18nService.translate("There is no data to display");
      else {

        if (!!(<any>element[0]).comments) {
          this.secondaryLang = await this.languageService.secondaryLang()

          this.comments = this.getComments((<any>element[0]).comments);
          this.nameKPI = (!this.secondaryLang ) ? this.comments.get('nameKPI') : this.comments.get('nameKPILang');       //second folder name
          await this.setScoreEtch();

          this.setButtonSlideMenu(workEffortId);
          let workEffortName = (!this.secondaryLang)? (<any>element[0]).workEffort.workEffortName : (<any>element[0]).workEffort.workEffortNameLang;
          this.analysisDesc = workEffortName;


          this.tmpItems.push({ label: this.analysisDesc, url: null, id: data });
          this.items = this.tmpItems;

          const headerObs = this.workEffortAnalysisService.getWorkEffortAnalysisTargetHeaderOne(this.analysisId, workEffortId);
          headerObs.subscribe((element) => {

            this.targets = <WorkEffortAnalysisTarget>element[0];

            this.setValueHeader(this.targets);

            if (this.comments.get('mainScore') == 'EMOTICON') {

              this.mainScore = "EMOTICON";
              this.setSrcImgHeader(this.targets);
            }

            if (this.comments.get('mainScore') == 'GAUGE') {

              this.mainScore = "GAUGE";
              this.uomRangeValuesService.uomRangeValues(this.comments.get('rangeDefault')).subscribe(data => {
                data.forEach(e => {

                  if (e.colorEnumId == "GREEN") this.tmpGaugeConfig.forEach(conf => conf.fromValueGreen = e.fromValue);
                  if (e.colorEnumId == "YELLOW") this.tmpGaugeConfig.forEach(conf => conf.fromValueYellow = e.fromValue);
                  if (e.colorEnumId == "RED") this.tmpGaugeConfig.forEach(conf => conf.fromValueRed = e.fromValue);

                });

                this.maxValuePromise = this.uomRangeValuesService.uomRangeValuesMax(this.comments.get('rangeDefault'));


                this.maxValuePromise.then(
                  response => {
                    this.maxValue = response
                    this.tmpGaugeConfig.forEach(conf => conf.gaugeMax = response);

                    this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));

                    this.minValueObs.subscribe(min => {

                      this.tmpGaugeConfig.forEach(conf => conf.gaugeMin = min);

                      this.tmpGaugeConfig[0].gaugeValue = this.value1;
                      this.gaugeConfig1 = this.tmpGaugeConfig[0];

                      this.tmpGaugeConfig[1].gaugeValue = this.value2;
                      this.gaugeConfig2 = this.tmpGaugeConfig[1];

                      this.tmpGaugeConfig[2].gaugeValue = this.value3;
                      this.gaugeConfig3 = this.tmpGaugeConfig[2];

                      this.tmpGaugeConfig[3].gaugeValue = this.value4;
                      this.gaugeConfig4 = this.tmpGaugeConfig[3];

                    })

                  })
              })

            }


          })

          if (this.comments.get('detailScore') == "EMOTICON_LIST") {
            this.detailScore = "EMOTICON_LIST";
            this.headArrayEmoticonList();
            this.configDataRouting(workEffortId);
          }

          if (this.comments.get('detailScore') == "GAUGE_LIST") {
            this.detailScore = "GAUGE_LIST";

            this.uomRangeValuesService.uomRangeValues(this.comments.get('rangeDefault')).subscribe(data => {
              data.forEach(e => {

                if (e.colorEnumId == "GREEN") this.tmpGaugeConfig.forEach(conf => conf.fromValueGreen = e.fromValue);
                if (e.colorEnumId == "YELLOW") this.tmpGaugeConfig.forEach(conf => conf.fromValueYellow = e.fromValue);
                if (e.colorEnumId == "RED") this.tmpGaugeConfig.forEach(conf => conf.fromValueRed = e.fromValue);

              });

              this.maxValuePromise = this.uomRangeValuesService.uomRangeValuesMax(this.comments.get('rangeDefault'));

              this.maxValuePromise.then(
                response => {
                  this.maxValue = response;
                  this.tmpGaugeConfig.forEach(conf => conf.gaugeMax = response);

                  this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));

                  this.minValueObs.subscribe(min => {
                    this.tmpGaugeConfig.forEach(conf => conf.gaugeMin = min);

                    this.headArrayGaugeList();
                    this.configDataRouting(workEffortId);
                  })

                })


            })
          }

          if (this.comments.get('detailScore') == "RADAR") {

            this.detailScore = "CHART";
            this.selectedChart = { name: 'RADAR', code: 'radar' };
            this.tmpChartConfig.type = 'radar';
            this.headArrayConfChart();
            this.configDataRouting(workEffortId);
          }

          if (this.comments.get('detailScore') == "LINE") {
            this.detailScore = "CHART";
            this.selectedChart = { name: this.i18nService.translate('LINE'), code: 'line' };
            this.tmpChartConfig.type = 'line';
            this.headArrayConfChart();
            this.configDataRouting(workEffortId);
          }

          if (this.comments.get('detailScore') == "BAR") {

            this.detailScore = "CHART";
            this.selectedChart = { name: this.i18nService.translate('BAR'), code: 'bar' };
            this.tmpChartConfig.type = 'bar';
            this.headArrayConfChart();
            this.configDataRouting(workEffortId);
          }

          if (this.comments.get('detailScore') == "PIE") {

            this.detailScore = "CHART";
            this.selectedChart = { name: this.i18nService.translate('PIE'), code: 'pie' };
            this.tmpChartConfig.type = 'pie';
            this.headArrayConfChart();
            this.configDataRouting(workEffortId);
          }

          if (this.comments.get('detailScore') == "POLAR") {

            this.detailScore = "CHART";
            this.selectedChart = { name: this.i18nService.translate('POLAR'), code: 'polarArea' };
            this.tmpChartConfig.type = 'polarArea';
            this.headArrayConfChart();
            this.configDataRouting(workEffortId);
          }

          if (this.comments.get('detailScore') == "DOUGHNUT") {

            this.detailScore = "CHART";
            this.selectedChart = { name: this.i18nService.translate('DOUGHNUT'), code: 'doughnut' };
            this.tmpChartConfig.type = 'doughnut';
            this.headArrayConfChart();
            this.configDataRouting(workEffortId);
          }


          if (!!this.comments.get('detailKPI') && !!this.nameKPI) {
            this.setEtchScore();
            this.setDetailKPI(workEffortId);
          }

        }
        else this.analysisDesc = this.i18nService.translate("Parameterization missing");
      }

    })


  }


  /**
   * This function sets the gridArray for the table 
   * and defines the information for the detail score.
   * 
   * @param workEffortId - Work effort id.
   */
  configDataRouting(workEffortId) {

    const workEffortListObs = this.workEffortAnalysisService.getWorkEffortAnalysisTargetListWithWE(this.analysisId, workEffortId, (!!this.comments.get('dateControl')) ? this.comments.get('dateControl') : "");

    if (this.detailScore == "CHART") {
      this.minValueObs = this.uomRangeValuesService.uomRangeValuesMin(this.comments.get('rangeDefault'));
      this.minValueObs.subscribe(min => {

        this.tmpChartConfig.dataMin = min;
      });


      if (!!this.comments.get("showEtchDescr")) {
        this.tmpChartConfig.showEtchDescr = this.comments.get("showEtchDescr") ;
        this.radioButtonChart.selectedItem = this.radioButtonChart.items.filter(x => x.key === this.comments.get("showEtchDescr"))[0];

      } else {
        this.tmpChartConfig.showEtchDescr = 'E';
        this.radioButtonChart.selectedItem = this.radioButtonChart.items.filter(x => x.key === 'E')[0];

      }
      
    }
    workEffortListObs.subscribe(async we => {

      (we.length == 0) ? this.nameDetail = null : this.nameDetail = (!this.secondaryLang) ? this.comments.get('nameDetail') : this.comments.get('nameDetailLang'); //first folder name


      if (this.detailScore == "CHART" && we.length < 3) {
        this.selectedChart = { name: this.i18nService.translate('BAR'), code: 'bar' };
        this.tmpChartConfig.type = 'bar';
      }

      we.forEach((e, index) => {

        if (this.comments.get('detailScore') == "EMOTICON_LIST") this.setSrcImgGridArray(e);

        let valSC, valST, valSC2, valST2;

        if (!!e.scAmount) {
          valSC = + e.scAmount;
          valSC = + valSC.toFixed(this.precision);
        }
        else valSC = null;
        if (!!e.stAmount) {
          valST = + e.stAmount;
          valST = + valST.toFixed(this.precision);
        }
        else valST = null;

        if (!!e.sc2Amount) {
          valSC2 = + e.sc2Amount;
          valSC2 = + valSC2.toFixed(this.precision);
        }
        else valSC2 = null;

        if (!!e.st2Amount) {
          valST2 = + e.st2Amount;
          valST2 = + valST2.toFixed(this.precision);
        }
        else valST2 = null

        let workEffortName = (!this.secondaryLang)? e.workEffortName : e.workEffortNameLang;

        this.tmpGridArray.push({
          id: e.workEffortId,
          workEffortName: (!!e.workEffortEtch)?   e.workEffortEtch + " - " + workEffortName : workEffortName,
          scoreEtch1: { amount: valSC, linkImg: this.srcImgSC },
          scoreEtch2: { amount: valST, linkImg: this.srcImgST },
          scoreEtch3: { amount: valSC2, linkImg: this.srcImgSC2 },
          scoreEtch4: { amount: valST2, linkImg: this.srcImgST2 },
          buttonDetails: true,
        })

        if (this.detailScore == "CHART") this.configChart(e);

      })

      console.log(this.tmpGridArray);
      this.gridArray = this.tmpGridArray;


    })

  }

  /**
   * Sets the headArrayKPI and the gridArrayKPI.
   * 
   * @param workEffortId - Work effort id.
   */
  setDetailKPI(workEffortId) {

    if (this.comments.get('detailKPI') == 'SCORE') {

      if (this.comments.get('showKpiType') == 'Y') this.headArrayKPI.push({ head: this.i18nService.translate('Type'), fieldName: `typology`, actionInput: 'null', actionOutput: 'outputLabelData', display: "table-cell", filter: "null", sortIcon: false });
      if (this.comments.get('showKpiUdm') == 'Y') this.headArrayKPI.push({ head: this.i18nService.translate('Measures'), fieldName: `measures`, actionInput: 'null', actionOutput: 'outputLabelData', display: "table-cell", filter: "null", sortIcon: false });

      if (!!this.comments.get('etchKPI1')) this.headArrayKPI.push({ head: this.i18nService.translate(`${this.comments.get('etchKPI1')}`), fieldName: `etchKPI1`, actionInput: 'null', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.comments.get('etchKPI2')) this.headArrayKPI.push({ head: this.i18nService.translate(`${this.comments.get('etchKPI2')}`), fieldName: `etchKPI2`, actionInput: 'null', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.comments.get('etchKPI3')) this.headArrayKPI.push({ head: this.i18nService.translate(`${this.comments.get('etchKPI3')}`), fieldName: `etchKPI3`, actionInput: 'null', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.comments.get('etchKPI4')) this.headArrayKPI.push({ head: this.i18nService.translate(`${this.comments.get('etchKPI4')}`), fieldName: `etchKPI4`, actionInput: 'null', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.etchScore1) this.headArrayKPI.push({ head: this.etchScore1, fieldName: `etchScore1`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.etchScore2) this.headArrayKPI.push({ head: this.etchScore2, fieldName: `etchScore2`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.etchScore3) this.headArrayKPI.push({ head: this.etchScore3, fieldName: `etchScore3`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
      if (!!this.etchScore4) this.headArrayKPI.push({ head: this.etchScore4, fieldName: `etchScore4`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });


      const detailKPI = this.workEffortAnalysisService.getDetailKPIScore(this.analysisId, workEffortId, (!!this.comments.get('dateControl')) ? this.comments.get('dateControl') : "NONE");

      detailKPI.subscribe(detail => {

        detail.forEach((e, index) => {
          //let img = (!!e.drcObjectInfo) ? e.drcObjectInfo.substring(e.drcObjectInfo.indexOf("resources") - 1) : "";

          let labelIndicator;
          let accountName = (!this.secondaryLang)? e.accountName : e.accountNameLang;
          (this.comments.get('showKpiCode') == 'Y') ? labelIndicator = e.accountCode + ' - ' + accountName : labelIndicator = accountName;

          let description = (!this.secondaryLang)? e.description : e.descriptionLang;
          let abbreviation = (!this.secondaryLang)? e.abbreviation : e.abbreviationLang;

          this.tmpGridArrayKPI.push({
            id: index,
            indicator: labelIndicator,
            typology: description,
            measures: abbreviation,
            etchKPI1: this.parseFloatToFixed(e.scAmount, e.decimalScale),
            etchKPI2: this.parseFloatToFixed(e.stAmount, e.decimalScale),
            etchKPI3: this.parseFloatToFixed(e.sc2Amount, e.decimalScale),
            etchKPI4: this.parseFloatToFixed(e.st2Amount, e.decimalScale),
            etchScore1: { amount: e.scIconAmount, linkImg: e.rvcIconContentId },
            etchScore2: { amount: e.stIconAmount, linkImg: e.rvtIconContentId },
            etchScore3: { amount: e.sc2IconAmount, linkImg: e.rvc2IconContentId },
            etchScore4: { amount: e.st2IconAmount, linkImg: e.rvt2IconContentId },
          })

          console.log(e);
        })


        console.log(this.tmpGridArrayKPI);
        
        this.gridArrayKPI = this.tmpGridArrayKPI;
      })

    }

    if (this.comments.get('detailKPI') == 'PERIOD') {

      const workEffortAnalysis = this.workEffortAnalysisService.getWorkEffortAnalysis(this.analysisId);

      workEffortAnalysis.subscribe(wea => {

        if (this.comments.get('showKpiType') == 'Y') this.headArrayKPI.push({ head: this.i18nService.translate('Type'), fieldName: `typology`, actionInput: 'null', actionOutput: 'outputLabelData', display: "table-cell", filter: "null", sortIcon: false });
        if (this.comments.get('showKpiUdm') == 'Y') this.headArrayKPI.push({ head: this.i18nService.translate('Measures'), fieldName: `measures`, actionInput: 'null', actionOutput: 'outputLabelData', display: "table-cell", filter: "null", sortIcon: false });
        this.headArrayKPI.push({ head: `Stato\nAvanzamento`, fieldName: `etchIndex`, actionInput: 'null', actionOutput: 'actionMultipleRowString', display: "table-cell", filter: "null", sortIcon: false });

        if (!!wea.labelM4Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelM4Prev}`), fieldName: `labelM4Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelM3Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelM3Prev}`), fieldName: `labelM3Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelM2Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelM2Prev}`), fieldName: `labelM2Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelM1Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelM1Prev}`), fieldName: `labelM1Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelPrev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelPrev}`), fieldName: `labelPrev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelP1Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelP1Prev}`), fieldName: `labelP1Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelP2Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelP2Prev}`), fieldName: `labelP2Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelP3Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelP3Prev}`), fieldName: `labelP3Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });
        if (!!wea.labelP4Prev) this.headArrayKPI.push({ head: this.i18nService.translate(`${wea.labelP4Prev}`), fieldName: `labelP4Prev`, actionInput: 'null', actionOutput: 'actionMultipleRowNumber', display: "table-cell", filter: "null", sortIcon: false });

        if (!!this.etchScore1) this.headArrayKPI.push({ head: this.etchScore1, fieldName: `etchScore1`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
        if (!!this.etchScore2) this.headArrayKPI.push({ head: this.etchScore2, fieldName: `etchScore2`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
        if (!!this.etchScore3) this.headArrayKPI.push({ head: this.etchScore3, fieldName: `etchScore3`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });
        if (!!this.etchScore4) this.headArrayKPI.push({ head: this.etchScore4, fieldName: `etchScore4`, actionInput: 'null', actionOutput: 'actionEmoticonCard', display: "table-cell", filter: "null", sortIcon: false });



        const detailKPI = this.workEffortAnalysisService.getDetailKPIPeriod(this.analysisId, workEffortId, (!!this.comments.get('dateControl')) ? this.comments.get('dateControl') : "NONE");

        detailKPI.subscribe(detail => {

          let indicator = [];

          for (let index = indicator.length; index < detail.length; index += indicator.length) {
            let accountCode = detail[index].accountCode;

            indicator = detail.filter(x => x.accountCode == accountCode);

            //let img = (!!detail[index].drcObjectInfo) ? detail[index].drcObjectInfo.substring(detail[index].drcObjectInfo.indexOf("resources") - 1) : "";

            let labelIndicator;
            let accountName = (!this.secondaryLang)? detail[index].accountName : detail[index].accountNameLang;
            (this.comments.get('showKpiCode') == 'Y') ? labelIndicator = detail[index].accountCode + ' - ' + accountName : labelIndicator = accountName;

            let description = (!this.secondaryLang)? detail[index].description : detail[index].descriptionLang;
            let abbreviation = (!this.secondaryLang)? detail[index].abbreviation : detail[index].abbreviationLang;



            this.tmpGridArrayKPI.push({
              id: accountCode,
              indicator: labelIndicator,
              typology: description,
              measures: abbreviation,
              etchIndex: indicator.map(x => x.descFTId),
              labelM4Prev: indicator.map(x => this.parseFloatToFixed(x.m4Amount,  detail[index].decimalScale)),
              labelM3Prev: indicator.map(x => this.parseFloatToFixed(x.m3Amount,  detail[index].decimalScale)),
              labelM2Prev: indicator.map(x => this.parseFloatToFixed(x.m2Amount,  detail[index].decimalScale)),
              labelM1Prev: indicator.map(x => this.parseFloatToFixed(x.m1Amount,  detail[index].decimalScale)),
              labelPrev: indicator.map(x => this.parseFloatToFixed(x.isAmount,  detail[index].decimalScale)),
              labelP1Prev: indicator.map(x => this.parseFloatToFixed(x.p1Amount,  detail[index].decimalScale)),
              labelP2Prev: indicator.map(x => this.parseFloatToFixed(x.p2Amount,  detail[index].decimalScale)),
              labelP3Prev: indicator.map(x => this.parseFloatToFixed(x.p3Amount,  detail[index].decimalScale)),
              labelP4Prev: indicator.map(x => this.parseFloatToFixed(x.p4Amount,  detail[index].decimalScale)),
              etchScore1: { amount: detail[index].scIconAmount, linkImg: detail[index].rvcIconContentId },
              etchScore2: { amount: detail[index].stIconAmount, linkImg: detail[index].rvtIconContentId },
              etchScore3: { amount: detail[index].sc2IconAmount, linkImg: detail[index].rvc2IconContentId },
              etchScore4: { amount: detail[index].st2IconAmount, linkImg: detail[index].rvt2IconContentId },

            })
            console.log(detail[index]);

          }

          console.log(this.tmpGridArrayKPI);
          this.gridArrayKPI = this.tmpGridArrayKPI;

        })

      })

    }

  }

  /**
   * This function converts a string to a float 
   * with the precision specified.
   * 
   * @param value 
   * @returns - float value.
   */
  parseFloatToFixed(value, precision) {
    return (!!value) ? parseFloat(value).toFixed(precision) : null;

  }

  /**
   * This function sets the display of the labels for the chart.
   * 
   * @param item radioButtom item
   */
  radButSelectItem(item){

    this.tmpChartConfig.showEtchDescr = item.key;

    this.chartConfig = {...this.tmpChartConfig};       

  }



}
