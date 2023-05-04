import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartyService } from 'app/api/service/party.service';
import { TimesheetService } from 'app/api/service/timesheet.service';
import { UomService } from 'app/api/service/uom.service';
import { I18NService } from 'app/i18n/i18n.service';
import { HeadArray } from 'app/layout/table/table-configuration';
import { ConfirmationService } from 'primeng/api';

function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getDayName(date = new Date(), locale = 'en-US') {
  const day = date.toLocaleDateString(locale, { weekday: 'long' });
  return day.slice(0, 3);
}


@Component({
  selector: 'app-timesheet-calendar',
  templateUrl: './timesheet-calendar.component.html',
  styleUrls: ['./timesheet-calendar.component.css']
})
export class TimesheetCalendarComponent implements OnInit {

  gridArray: any[] = [];
  daysOfThisMonth: any[] = [];
  dataTable: any;
  form: FormGroup;

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: 'null', actionOutput: 'outputLabelData', display: "none", filter: "null" },
    { head: 'COMPITO', fieldName: 'compito', actionInput: 'dropdownData', actionOutput: 'outputLabelData', display: "table-cell", filter: "null", width: "15em" },
    { head: 'TIPOPAGA', fieldName: 'paga', actionInput: 'dropdownData', actionOutput: 'outputLabelData', display: "table-cell", filter: "null", width: "15em" }
  ];

  constructor( private readonly timesheetService: TimesheetService,
    private readonly partyService: PartyService,
    private readonly uomService: UomService,
    private readonly confirmationService: ConfirmationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly i18nService: I18NService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      // 'partyId': new FormControl('', Validators.required),
      // 'fromDate': new FormControl('', Validators.required),
      // 'thruDate': new FormControl('', Validators.required),
      // 'contractHours': new FormControl(''),
      // 'actualHours': new FormControl('')
    });

    const d = new Date();
    this.daysOfThisMonth = getDaysInMonth(d.getMonth(), d.getFullYear());
    this.daysOfThisMonth.forEach((item, index) => {
      if (getDayName(item) == 'Sun') {
        this.headArray.push({ head: item.getDate(), subHead: getDayName(item), fieldName: index, actionInput: 'inputLabelNumber', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", width: "3em", colorHeader: '#E8151E' })
      } else if (getDayName(item) == 'Sat') {
        this.headArray.push({ head: item.getDate(), subHead: getDayName(item), fieldName: index, actionInput: 'inputLabelNumber', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", width: "3em", colorHeader: '#3F6DB7' })
      } else {
        this.headArray.push({ head: item.getDate(), subHead: getDayName(item), fieldName: index, actionInput: 'inputLabelNumber', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", width: "3em" })
      }

    })
    this.headArray.push({ head: 'ORE ATTUALI', fieldName: 'actual_hours', actionInput: 'inputLabelNumber', actionOutput: 'outputLabelNumber', display: "table-cell", filter: "null", width: "3em" })

  }

  shareDescriptorTable(data) {
    this.dataTable = data;
  }

  

}
