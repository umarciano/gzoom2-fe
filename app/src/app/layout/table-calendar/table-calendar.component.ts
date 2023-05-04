import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table-calendar',
  templateUrl: './table-calendar.component.html',
  styleUrls: ['./table-calendar.component.css']
})
export class TableCalendarComponent implements OnInit {

  @Input() headArray: any[] = [];
  @Input() gridArray: any[] = [];
  @Input() filterArray: string[] = [];
  @Input() filterComponentArray: string[] = [];
  @Input() isAction: boolean = false;
  @Input() typeDropdownFilterArray: string[] = [];
  @Input() typeDropdownInputArray: string[] = [];
  @Input() itemsButtonSlideMenu: any[] = [];
  @Input() isNewItem: boolean = false;
  @Input() selectionMode: string;
  @Input() clickFrameToGo: string;
  @Input() formShape: { [name: string]: FormGroup | FormControl | FormArray }
  @Input() rowExpand: boolean = false;
  @Input() editingKeyId: string;
  @Input() flag: boolean;

  @Output() buttonEditEvent = new EventEmitter<any>();
  @Output() buttonDeleteRowEvent = new EventEmitter<any>();
  @Output() buttonEditSaveEvent = new EventEmitter<any>();
  @Output() buttonEditCancelEvent = new EventEmitter<any>();
  @Output() buttonShareRiRowEvent = new EventEmitter<any>();
  @Output() clickLinkEvent = new EventEmitter<any>();
  @Output() clickRowSelectEvent = new EventEmitter<any>();
  @Output() clickRowUnselectEvent = new EventEmitter<any>();

  @Output() shareDescriptorTable = new EventEmitter<any>();

  form: FormGroup;

  cols: any[] = [];
  exportColumns: any[];
  editNow: boolean = false;
  languages: string[] = [];

  @ViewChild('dt') private dataTable: Table;
  
  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes["isNewItem"] && changes["isNewItem"].currentValue) {
        this.editNow = true;
        this.form.reset();
        this.dataTable.reset();
        this.dataTable.editingRowKeys = { [this.editingKeyId]: true };
        this.isNewItem = false;
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group(this.formShape);
  }

  ngAfterViewInit() {
    setTimeout(() => this.shareDescriptorTable.emit(this.dataTable), 10);
  }

  clickEditEvent(id: string, riRow: number) {
    this.shareDescriptorTable.emit(this.dataTable);
    this.editNow = true;
    this.form.reset();
    this.gridArray.forEach((element, index) => {
      if (element.id == id) {
        this.form.setValue(element.value);
      }
    })
    this.buttonEditEvent.emit(riRow);
  }

  clickDeleteRowEvent(id: string, riRow: number) {
    this.form.reset();
    this.gridArray.forEach((element, index) => {
      if (element.id == id) {
        this.form.setValue(element.value);
      }
    })
    this.buttonDeleteRowEvent.emit({ form: this.form.value, index: id, riRow: riRow });
  }

  clickEditSaveEvent() {
    this.buttonEditSaveEvent.emit(this.form.value);
    this.form.reset();
    this.editNow = false;
  }

  clickEditCancelEvent(id: string, riRow: number) {
    this.buttonEditCancelEvent.emit(id);
    this.form.reset();
    this.editNow = false;
  }

  clickShareRiRowEvent(id: string, riRow: number) {
    this.buttonShareRiRowEvent.emit({ id, riRow });
  }

  clickLinkRowEvent(data) {
    this.clickLinkEvent.emit(data);
  }

  onRowSelect(data) {
    if (this.rowExpand) {
      for (let i = 0; i < this.dataTable.rows; i++) {
        if (data.data.value.idNumber != i) {
          this.dataTable.expandedRowKeys = { [i]: false };
        } else {
          this.dataTable.expandedRowKeys = { [i]: true };
        }
      }
    }
    this.clickRowSelectEvent.emit(data);
  }

  onRowUnselect(data) {
    this.clickRowUnselectEvent.emit(data);
  }
}
