import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { HeadFilter, ActionInput, ActionOutput } from './table-editing-cell-configuration';
import { log } from 'console';


@Component({
  selector: 'app-table-editing-cell',
  templateUrl: './table-editing-cell.component.html',
  styleUrls: ['./table-editing-cell.component.css']
})
export class TableEditingCellComponent implements OnInit, OnChanges {
  // Boolean variable indicating the editing status of a row
  editNow: boolean = false;
  // Array containing the available languages
  languages: string[] = [];
  // Array containing the selected rows
  selectedItem: any[] = [];
  // Boolean variable that indicates if I'm selecting all rows
  selectAll: boolean = false;
  // Total number of rows
  totalRecords: number;
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
  // Variable to set scrollHeight
  @Input() scrollHeight: any;

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
  // user input write start notification event
  @Output() notifyInputChanges = new EventEmitter<any>();
  // user input write start notification event
  @Output() clickButtonDetailsEvent = new EventEmitter<any>();


  @Output() selectedItemDropdown = new EventEmitter<any>();
  itemDropdown: any[] = [];

  @ViewChild('dtec') private dataTable: Table;

  constructor(private fb: FormBuilder, private viewportScroller: ViewportScroller) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes["gridArray"]) {
        this.selectedItem = this.selectedItem.filter(x => this.gridArray.filter(y => y.variableGridArray.id == x.variableGridArray.id).length > 0);
        this.shareSelectionItem.emit(this.selectedItem);
        this.itemDropdown = new Array(this.gridArray.length);
      }
    }
  }

  ngOnInit(): void {
    this.headArray.forEach((element) => {
      if (element.filter == "dropdownFilter") {
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

  dropdownInputChanges(index, row) {
    this.selectedItemDropdown.emit(this.itemDropdown[row]);
    this.selectedItemDropdown.emit(index);
  }

  onTimeChange(index) {
    this.notifyInputChanges.emit(index);
  }

  onSelectionChange(values) {
    if (this.selectedOn) {
      this.selectAll = values.length === this.totalRecords;
      this.selectedItem = values;
      this.shareSelectionItem.emit(values);
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
        this.shareSelectionItem.emit(this.selectedItem);
      }
    }
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

  onClickButtonDetails(data) {
    this.clickButtonDetailsEvent.emit(data);
  }

  ngAfterViewInit() {
    setTimeout(() => this.shareDescriptorTable.emit(this.dataTable), 10);
  }
}
