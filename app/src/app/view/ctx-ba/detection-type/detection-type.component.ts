import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18NService } from 'app/i18n/i18n.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable, Subject, map, mergeMap, mergeWith } from 'rxjs';
import { Message as MessageError } from 'primeng/api';
import { Message } from 'app/commons/model/message';
import { Table } from 'primeng/table';
import { HeadArray, ActionInput, ActionOutput, HeadFilter } from 'app/layout/table-editing-cell/table-editing-cell-configuration';
import { GlFiscalTypeService } from 'app/api/service/gl-fiscal-type.service';
import { GlFiscalTypeEx } from 'app/api/model/glFiscalTypeEx';
import { LanguageService } from 'app/api/service/language.service';
import { EnumerationService } from 'app/api/service/enumeration.service';
import { GlFiscalType } from 'app/api/model/glFiscalType';


@Component({
  selector: 'app-detection-type',
  templateUrl: './detection-type.component.html',
  styleUrls: ['./detection-type.component.css']
})
export class DetectionTypeComponent implements OnInit {
  _reload: Subject<void>;
  messagesError: MessageError[] = [];
  buttonDelete: boolean;
  buttonNew: boolean = true;
  buttonSave: boolean;
  buttonBack: boolean = true;
  msgs: Message[] = [];
  elementToAdd: any;
  dataTable: Table;

  headArray: HeadArray[] = [
    { head: '', fieldName: 'idNumber', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" },
    { head: '', fieldName: 'id', actionInput: ActionInput.null, actionOutput: ActionOutput.outputLabelData, display: "none" }
  ]

  gridArray: any[] = [];
  editingKeyId: string;
  selectionList: any[] = [];
  newRow: any;

  secondaryLang: boolean;
  dropdownPhase: MenuItem[] = [];
  dropdownIsFinancialUsed: MenuItem[] = [
    { label: this.i18nService.translate('Y'), id: 'Y' },
    { label: this.i18nService.translate('N'), id: 'N' }];

  dropdownIsAccountUsed: any[] = [
    { label: this.i18nService.translate('Y'), id: 'Y' },
    { label: this.i18nService.translate('N'), id: 'N' }];

  dropdownIsIndicatorUsed: any[] = [
    { label: this.i18nService.translate('Y'), id: 'Y' },
    { label: this.i18nService.translate('N'), id: 'N' }];

  constructor(
    private route: ActivatedRoute,
    private readonly glFiscalTypeService: GlFiscalTypeService,
    private readonly enumerationService: EnumerationService,
    private readonly i18nService: I18NService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly languageService: LanguageService
  ) {
    this._reload = new Subject<void>();

  }

  async ngOnInit() {
    this.secondaryLang = await this.languageService.secondaryLang();
    const reload = this._reload.pipe(mergeMap(() => this.glFiscalTypeService.getDetectionType()));
    const w$ = this.route.data.pipe(
      map((data: { obss: GlFiscalTypeEx[] }) => data.obss),
      mergeWith(reload)
    );





    this.enumerationService.enumerations('GL_FISCAL_TYPE').subscribe(e => {
      e.forEach(item => this.dropdownPhase.push({ label: (!this.secondaryLang) ? item.description : item.descriptionLang, id: item.enumId }));

      this.setHeadArray();

      w$
        .subscribe(y => {
          setTimeout(() => { this.buttonSave = false; }, 0);
          setTimeout(() => { this.buttonDelete = false; }, 0);
          this.gridArray = [];
          if (this.newRow) this.gridArray.push(this.newRow);
          y.forEach((e, index) => {
            this.gridArray.push({
              glFiscalTypeId: e.glFiscalTypeId,
              description: e.description,
              descriptionLang: e.descriptionLang,
              glFiscalTypeEnumId: e.glFiscalTypeEnumId,
              phase: e.enumeration.description,
              phaseLang: e.enumeration.descriptionLang,
              isFinancialUsed: (e.isFinancialUsed != null) ? this.i18nService.translate(e.isFinancialUsed) : "",
              isAccountUsed: (e.isAccountUsed != null) ? this.i18nService.translate(e.isAccountUsed) : "",
              isIndicatorUsed: (e.isIndicatorUsed != null) ? this.i18nService.translate(e.isIndicatorUsed) : "",

              variableGridArray: {
                id: e.glFiscalTypeId,
                updated: false,
                buttonDetails: false,
                inputLabeldata: true,
                inputLabelNumber: true,
                inputNotes: false,
                outputData: true,
                inputNew: false,
                dropdownData: true,
              }

            })
          })
        })
    });

  }

  setHeadArray() {
    this.headArray.push({ head: this.i18nService.translate('Code'), fieldName: 'glFiscalTypeId', actionInput: ActionInput.outputData, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, required: true, width: "15%" });
    this.headArray.push({ head: this.i18nService.translate('Description'), fieldName: (!this.secondaryLang) ? "description" : "descriptionLang", actionInput: ActionInput.inputLabeldata, actionOutput: ActionOutput.outputLabelData, filter: HeadFilter.textFilter, required: true });
    this.headArray.push({ head: this.i18nService.translate('Phase'), fieldName: (!this.secondaryLang) ? "phase" : "phaseLang", actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, dropdown: this.dropdownPhase, dropdownClear: true, required: true, sortIcon: false });
    this.headArray.push({ head: this.i18nService.translate('Financial movements'), fieldName: "isFinancialUsed", actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, dropdown: this.dropdownIsFinancialUsed, dropdownClear: true, sortIcon: false });
    this.headArray.push({ head: this.i18nService.translate('Economic movements'), fieldName: "isAccountUsed", actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, dropdown: this.dropdownIsAccountUsed, dropdownClear: true, sortIcon: false });
    this.headArray.push({ head: this.i18nService.translate('Indicator movements'), fieldName: "isIndicatorUsed", actionInput: ActionInput.dropdownData, actionOutput: ActionOutput.outputLabelData, dropdown: this.dropdownIsIndicatorUsed, dropdownClear: true, sortIcon: false });

  }

  shareDescriptorTable(data: Table) {
    this.dataTable = data;
  }

  shareSelectionItem(data) {
    this.selectionList = data;

    if (this.selectionList.length > 0) {
      setTimeout(() => { this.buttonDelete = true; }, 0);
    }
    else setTimeout(() => { this.buttonDelete = false; }, 0);
  }

  notifyInputChanges(id) {
    this.gridArray.forEach(x => {
      if (x.variableGridArray.id == id) {
        x.variableGridArray.updated = true;

        x.glFiscalTypeEnumId = this.dropdownPhase.filter(y => y.label == ((!this.secondaryLang) ? x.phase : x.phaseLang)).map(e => e.id)[0];
      }
    });
    setTimeout(() => { this.buttonSave = true; }, 0);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.buttonSave) {
      return confirm(this.i18nService.translate('There are unsaved items, are you sure want to leave the page?'));
    } else {
      return true;
    }
  }

  openNew() {
    if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
      if (this.validArray(this.gridArray.filter(x => x.variableGridArray.id.includes("new")))) {
        this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => {
          this.resetTraslate(x);
          let obj: GlFiscalType = new GlFiscalType(x.glFiscalTypeId, x.description, x.descriptionLang, x.glFiscalTypeEnumId, x.isFinancialUsed, x.isAccountUsed, x.isIndicatorUsed);
          await this.glFiscalTypeService.createGlFiscalType(obj).then(() => {

            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') + ' [' + obj.glFiscalTypeId + ']' }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

            x.variableGridArray.id = x.glFiscalTypeId;
            x.variableGridArray.updated = false;
            this.addNew();
          }
          )
            .catch((error) => {
              console.log('error', error);
              this.messagesError = [{ severity: 'error', summary: 'Error', detail: error + ' [' + obj.glFiscalTypeId + ']' }];

            })
        });
      }
      else {
        this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];

      }
    }
    else this.addNew();

  }

  addNew() {

    this.elementToAdd = {

      glFiscalTypeId: "",
      description: "",
      descriptionLang: "",
      glFiscalTypeEnumId: "",
      phase: "",
      phaseLang: "",
      isFinancialUsed: "",
      isAccountUsed: "",
      isIndicatorUsed: "",

      variableGridArray: {
        id: "new" + Math.random(),
        buttonDetails: false,
        dropdownData: true,
        inputLabeldata: true,
        inputLabelNumber: true,
        inputNotes: false,
        outputData: false,
        inputNew: true,
        updated: true,
      }

    }

    this.gridArray = [this.elementToAdd, ...this.gridArray];
    this.editingKeyId = this.elementToAdd.variableGridArray.id;
    this.dataTable.editingRowKeys = { [this.editingKeyId]: true };
  }

  saveAllElement() {

    if (this.validArray(this.gridArray.filter(x => x.variableGridArray.updated))) {
      if (this.gridArray.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
        this.gridArray.filter(x => x.variableGridArray.id.includes("new")).forEach(async (x) => {
          this.resetTraslate(x);
          let obj: GlFiscalType = new GlFiscalType(x.glFiscalTypeId, x.description, x.descriptionLang, x.glFiscalTypeEnumId, x.isFinancialUsed, x.isAccountUsed, x.isIndicatorUsed);
          await this.glFiscalTypeService.createGlFiscalType(obj).then(() => {

            this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('New item added') + ' [' + obj.glFiscalTypeId + ']' }];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
          }
          )
            .catch((error) => {
              console.log('error', error);
              this.messagesError = [{ severity: 'error', summary: 'Error', detail: error + ' [' + obj.glFiscalTypeId + ']' }];
              this.newRow = x;

            })
        });

      }

      if (this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).length > 0) {
        this.gridArray.filter(x => x.variableGridArray.updated == true && !x.variableGridArray.id.includes("new")).forEach(async (x) => {
          this.resetTraslate(x);
          let obj: GlFiscalType = new GlFiscalType(x.glFiscalTypeId, x.description, x.descriptionLang, x.glFiscalTypeEnumId, x.isFinancialUsed, x.isAccountUsed, x.isIndicatorUsed);
          await this.glFiscalTypeService.updateGlFiscalType(obj)
            .then(() => {
              this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Update Confirmation') + ' [' + obj.glFiscalTypeId + ']' }];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

            })
            .catch((error) => {
              console.log('error', error);
              this.messagesError = [{ severity: 'error', summary: 'Error', detail: error + ' [' + obj.glFiscalTypeId + ']' }];

            })
        });
      }

      setTimeout(() => { this.reload() }, 500);
    } else {
      this.messagesError = [{ severity: 'error', summary: 'Error', detail: this.i18nService.translate('All mandatory fields must be filled in') }];

    }

  }

  deleteRowSelected() {

    this.confirmationService.confirm({
      message: this.i18nService.translate('Are you sure you want to proceed with the deletion?'),
      header: this.i18nService.translate('Attention'),
      icon: 'pi pi-question',

      accept: () => {

        if (this.selectionList.filter(x => x.variableGridArray.id.includes("new")).length > 0) {
          let newArray = this.selectionList.filter(x => x.variableGridArray.id.includes("new"));
          this.selectionList = this.selectionList.filter(x => !newArray.includes(x));
          this.gridArray = this.gridArray.filter(x => !x.variableGridArray.id.includes("new"));
        }
        if (this.selectionList.length > 0) {

          this.selectionList.map(x => x.glFiscalTypeId).forEach(id => {
            this.glFiscalTypeService.deleteGlFiscalType(id)
              .then(() => {
                this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
                this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail + "[" + id + "]" });
                this.gridArray = this.gridArray.filter(x => x.glFiscalTypeId != id);
                setTimeout(() => { this.buttonDelete = false; }, 0);
              })
              .catch((error) => {
                console.log('error', error.message);
                this.messagesError = [{ severity: 'error', summary: 'Error', detail: error.message + "[" + id + "]" }];
              });

          })

        } else {
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Confirmed'), detail: this.i18nService.translate('Delete confirmation') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });

          setTimeout(() => { this.buttonDelete = false; }, 0);
        }


      }
    });
  }


  reload() {
    setTimeout(() => { this.buttonSave = false; }, 0);
    this._reload.next();
  }

  validArray(array: any[]): boolean {

    return (!this.secondaryLang) ? array.filter(x => x.glFiscalTypeId == "" ||
      x.description == "" ||
      x.phase == "").length == 0 :
      array.filter(x => x.glFiscalTypeId == "" ||
        x.descriptionLang == "" ||
        x.phaseLang == "").length == 0;
  }

  resetTraslate(element) {

    if (element.isFinancialUsed == "S") element.isFinancialUsed = "Y";
    if (element.isFinancialUsed == "J") element.isFinancialUsed = "Y";
    if (element.isAccountUsed == "S") element.isAccountUsed = "Y";
    if (element.isAccountUsed == "J") element.isAccountUsed = "Y";
    if (element.isIndicatorUsed == "S") element.isIndicatorUsed = "Y";
    if (element.isIndicatorUsed == "J") element.isIndicatorUsed = "Y";

  }

}
