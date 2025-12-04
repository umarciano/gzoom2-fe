import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-toolbar-data-table',
  templateUrl: './toolbar-data-table.component.html',
  styleUrls: ['./toolbar-data-table.component.css']
})
export class ToolbarDataTableComponent implements OnInit, OnChanges {

  @Input() isEditing: boolean;

  @Input() dataTable: any;
  @Input() gridArray: any[] = [];
  @Input() buttonBack: boolean;
  @Input() buttonNew: boolean;
  @Input() buttonExport: boolean;
  @Input() buttonDelete: boolean;
  @Input() buttonSave: boolean;

  @Output() buttonNewEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();
  @Output() deleteEvent = new EventEmitter<void>();

  exportArray: any[] = [];
  constructor(private _location: Location) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes["gridArray"]) {        
        this.exportArray = [];
        this.gridArray.forEach((element) => {
          this.exportArray.push(element);
        });
      }
    }
  }

  ngOnInit(): void {
    this.gridArray.forEach((element) => {
      this.exportArray.push(element);
    });
  }

  openNewRow() {
    this.buttonNewEvent.emit();
  }

  deleteRow() {
    this.deleteEvent.emit();
  }

  back() {
    this._location.back();
  }

  save() {
    this.saveEvent.emit();
  }

  exportExcel() {

    this.exportArray = [];
    this.gridArray.forEach((element) => {
      this.exportArray.push(element);
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.exportArray);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Document");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
