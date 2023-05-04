import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, mergeWith, switchMap } from 'rxjs/operators';
import { I18NService } from '../../../i18n/i18n.service';
import { Timesheet } from '../../../api/model/timesheet';
import { TimesheetService } from '../../../api/service/timesheet.service';
import { AuthService, UserProfile } from 'app/commons/service/auth.service';
import { UserPreferenceService } from 'app/api/service/user-preference.service';


@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit, OnChanges {
  _reload: Subject<void>;
  user: UserProfile;
  form: FormGroup;
  timesheets: Timesheet[];
  timesheetCalendar: boolean = false; //True -> attivo il timesheet-calendar-component altrimenti attivo il timesheet-table-component
  context: string;
  organizationSelected = 'Company';
  isAdmin: boolean = false;
  params: any = { managePlan: "N", showReference: "N", timeentryMapFormat: "DMY", weNoAssigned: "N", weExplAssLevel: 1, hasRateTypeList: "N", rateTtypeList: "STANDARD", hoursPercentage: "H", showComments: "N", glFisclTypeEnumId: "" };

  constructor(
    private readonly timesheetService: TimesheetService,
    private readonly authSrv: AuthService,
    private readonly route: ActivatedRoute,
    public readonly i18nService: I18NService,
    private readonly userPreferenceService: UserPreferenceService) {

    this.user = authSrv.userProfile();
    this._reload = new Subject<void>();
  }

  ngOnInit() {

    this.collapseSidebar();

    this.route.paramMap.subscribe(paramMap => {
      this.context = paramMap.get('context')
    });

    this.timesheetService.isAdmin(this.context).subscribe(
      data => {
        this.isAdmin = data;
      }
    );

    this.userPreferenceService.getUserPreference('ORGANIZATION_PARTY').subscribe(
      data => {
        this.organizationSelected = data.userPrefValue;
      }
    );

    this.route.paramMap.subscribe(paramMap => {
      this.context = paramMap.get('context')
    });

    const reloadedParams = this._reload.pipe(switchMap(() => this.timesheetService.params(this.context)));

    const paramsObs = this.route.data.pipe(
      map((data: { params: any[] }) => data),
      mergeWith(reloadedParams)
    );


    paramsObs.subscribe((data) => {
      let paramsTemp = data["params"][0].params.split(";");
      paramsTemp.forEach(element => {
        if (element.split("=")[0] != "") {
          switch (element.split("=")[0]) {
            case 'managePlan':
              this.params.managePlan = element.split("=")[1].split("'")[1];
              break;
            case 'showReference':
              this.params.showReference = element.split("=")[1].split("'")[1];
              break;
            case 'timeentryMapFormat':
              this.params.timeentryMapFormat = element.split("=")[1].split("'")[1];
              break;
            case 'weNoAssigned':
              this.params.weNoAssigned = element.split("=")[1].split("'")[1];
              break;
            case 'weExplAssLevel':
              this.params.weExplAssLevel = element.split("=")[1].split("'")[0];
              break;
            case 'hasRateTypeList':
              this.params.hasRateTypeList = element.split("=")[1].split("'")[1];
              break;
            case 'rateTtypeList':
              this.params.rateTtypeList = element.split("=")[1].split("'")[1];
              break;
            case 'hoursPercentage':
              this.params.hoursPercentage = element.split("=")[1].split("'")[1];
              break;
            case 'showComments':
              this.params.showComments = element.split("=")[1].split("'")[1];
              break;
          }
          this.params.glFisclTypeEnumId = data['params'][0].workEffortTypePeriod.glFiscalTypeEnumId;
        }
      });
    });

    if (this.params.timeentryMapFormat == "DMY") {
      this.timesheetCalendar = false;
    } else if (this.params.timeentryMapFormat == "DDM") {
      this.timesheetCalendar = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes["timesheets"]) {
      this._reload.next();
    }
  }

  collapseSidebar() {
    const dom: any = document.querySelector('body');
    const menu: any = document.querySelector('#sidebar');
    dom.classList.add('push-right');
    menu.classList.add('collapse');
  }
}

class PrimeTimesheet implements Timesheet {
  constructor(public partyId?: string, public partyName?: string, public timesheetId?: string, public fromDate?: Date,
    public thruDate?: Date, public contractHours?: number, public actualHours?: number) { }
}
