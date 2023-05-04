import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { ViewportScroller } from '@angular/common';
import { HeadFilter, ActionInput, ActionOutput } from './table-configuration';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<A> implements AfterViewInit, OnChanges, OnInit {

  // Boolean variable indicating the editing status of a row
  editNow: boolean = false;
  // Boolean variable that indicates if I'm selecting all rows
  selectAll: boolean = false;
  // Array containing the available languages
  languages: string[] = [];
  // Array containing the selected rows
  selectedItem: any[] = [];
  // Total number of rows
  totalRecords: number;
  // Form
  form: FormGroup;
  // Array containing the elements of the automatic dropdown filter
  typeDropdownFilterArray = new Map();

  headFilter = HeadFilter;

  actionInput = ActionInput;

  actionOutput = ActionOutput;

  // Array containing the elements of the head of the table
  @Input() headArray: any[] = [];
  // Array containing the elements of the table body
  @Input() gridArray: any[] = [];
  // Filter names array (optional)
  @Input() filterArray: string[] = [];
  // Boolean variable to enable table editing
  @Input() isAction: boolean;
  // Array containing the elements of the custom dropdown filter
  @Input() typeDropdownInputArray: Map<string, any>;
  // Array containing the elements of the custom details menu specific for each row enabled
  @Input() itemsButtonSlideMenu: any[] = [];
  // Boolean variables indicating whether we are adding a new line
  @Input() isNewItem: boolean = false;
  // Variable that indicates whether the selection is enabled for single or multiple lines
  @Input() selectionMode: string;
  // Variable that indicates which page to go to on click
  @Input() clickFrameToGo: string;
  // formShape
  @Input() formShape: { [name: string]: FormGroup | FormControl | FormArray }
  // Variable indicating whether the row is expanded or not
  @Input() rowExpand: boolean = false;
  // Variable indicating the id of the row to modify or of the new row
  @Input() editingKeyId: string;
  // Variable that indicates whether to display the icon flag in the head
  @Input() flag: boolean;
  // Boolean variable that indicates if the selection is active
  @Input() selectedOn: boolean;
  // Variable to disable the filter head
  @Input() headDisplay: string;
  // Boolean variable to enable double click on the line
  @Input() editRowDblClick: boolean
  // Boolean variable to enable load spinner in the body
  @Input() loading: boolean;

  @Input() sortField: string;

  // item change event
  @Output() buttonEditEvent = new EventEmitter<any>();
  // item deletion event
  @Output() buttonDeleteRowEvent = new EventEmitter<any>();
  // item save event
  @Output() buttonEditSaveEvent = new EventEmitter<any>();
  // element modification cancellation event
  @Output() buttonEditCancelEvent = new EventEmitter<any>();
  // line number sharing event
  @Output() buttonShareRiRowEvent = new EventEmitter<any>();
  // link click event
  @Output() clickLinkEvent = new EventEmitter<any>();
  // click event on the selected row
  @Output() clickRowSelectEvent = new EventEmitter<any>();
  // unclick event on selected row
  @Output() clickRowUnselectEvent = new EventEmitter<any>();
  // table descriptor sharing event
  @Output() shareDescriptorTable = new EventEmitter<any>();
  // selected items sharing event
  @Output() shareSelectionItem = new EventEmitter<any>();
  // double click event on the selected row
  @Output() dblclickRowEvent = new EventEmitter<any>();

  @ViewChild('dt') private dataTable: Table;

  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller) { }

  public onClick(elementId: string): void { this.viewportScroller.scrollToAnchor(elementId); }

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
    this.headArray.forEach((element) => {
      if (element.filter == "dropdownFilter" ) {
        if (this.typeDropdownFilterArray.get(element.fieldName) == undefined) {
          let tempArray = [];
          let tempArrayControl = [];
          this.gridArray.forEach((e) => {
            if (!tempArrayControl.includes(e[element.fieldName])) {
              tempArrayControl.push(e[element.fieldName]);
              tempArray.push({ label: e[element.fieldName], value: e[element.fieldName] })
            };
          })
          this.typeDropdownFilterArray.set(element.fieldName, tempArray)
        }
      }
    })
    this.totalRecords = this.gridArray.length;
  }

  ngAfterViewInit() {
    setTimeout(() => this.shareDescriptorTable.emit(this.dataTable), 10);
  }

  onSelectionChange(value) {
    if (this.selectedOn) {
      this.selectAll = value.length === this.totalRecords;
      this.selectedItem = value;
      this.shareSelectionItem.emit(value);
    }
  }

  onSelectAllChange(event) {
    if (this.selectedOn) {
      const checked = event.checked;

      if (checked) {
        this.selectedItem = this.gridArray;
        this.selectAll = true;
        this.shareSelectionItem.emit(this.selectedItem);
      }
      else {
        this.selectedItem = [];
        this.selectAll = false;
      }
    }
  }

  clickEditEvent(id: string, riRow: number) {
    this.shareDescriptorTable.emit(this.dataTable);
    this.editNow = true;
    this.form.reset();
    this.gridArray.forEach((element) => {
      if (element.id == id) {
        this.form.setValue(element);
      }
    })
    this.buttonEditEvent.emit(riRow);
  }

  clickDeleteRowEvent(id: string, riRow: number) {
    this.form.reset();
    this.gridArray.forEach((element) => {
      if (element.id == id) {
        this.form.setValue(element);
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
        if (data.data.idNumber != i) {
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

  dblclickRow(data) {
    this.dblclickRowEvent.emit(data);
  }
}

