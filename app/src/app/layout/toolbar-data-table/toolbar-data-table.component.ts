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
    /**
     * Tolta libreria dal package.json 
     *     "xlsx": "^0.18.5",
     * 
     * Codice precedente: 
     *     import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.exportArray);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Document");
    });
    */
   
    // Fallback CSV export to avoid relying on the vulnerable `xlsx` package.
    // Build CSV from exportArray (simple flat JSON -> CSV). For complex nested objects
    // this may need to be adapted, but this covers the common case of a table of objects.
    if (!this.exportArray || this.exportArray.length === 0) {
      // nothing to export
      return;
    }

    const keys = Object.keys(this.exportArray[0]);
    const escape = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      // Escape double quotes by doubling them
      if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const header = keys.join(',');
    const rows = this.exportArray.map(r => keys.map(k => escape(r[k])).join(','));
    const csv = [header].concat(rows).join('\n');
    this.saveAsCsvFile(csv, 'Document');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  saveAsCsvFile(csvContent: string, fileName: string): void {
    const CSV_TYPE = 'text/csv;charset=UTF-8';
    const CSV_EXTENSION = '.csv';
    const blob: Blob = new Blob([csvContent], { type: CSV_TYPE });
    FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + CSV_EXTENSION);
  }

}
