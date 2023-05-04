import { Component, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InterfacciamentoDatiService } from '../../../api/service/interfacciamento-dati.service';
import { I18NService } from '../../../i18n/i18n.service';
import { Message } from '../../../commons/model/message';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-interfacciamento-dati',
  templateUrl: './interfacciamento-dati.component.html',
  styleUrls: ['./interfacciamento-dati.component.css'],
  providers: [MessageService]
})
export class InterfacciamentoDatiComponent implements OnInit {

  _reload: Subject<void>;
  msgs: Message[] = [];
  error = '';
  uploadedFiles: any;
  showError: boolean = false;
  showErrorButton: boolean = false;

  constructor(
    private readonly InterfacciamentoDatiService: InterfacciamentoDatiService,
    private readonly FileUploadModule: FileUploadModule,
    private readonly i18nService: I18NService,
    private messageService: MessageService
  ) { }



  ngOnInit(): void {
  }

  onClear(){
    this.showErrorButton = false;
    this.showError = false;
    this.error = null;
  }

  onUploadHandler(file: any) {

    this.uploadedFiles = file;

    if (file) {
      this.showErrorButton = false;
      this.showError = false;
      this.error = null;
      this.InterfacciamentoDatiService
        .shareFile(file.files[0])
        .then(() => {
          this.msgs = [{ severity: this.i18nService.translate('info'), summary: this.i18nService.translate('Created'), detail: this.i18nService.translate('Record created') }];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.msgs[0].detail });
        })
        .catch((error) => {
          this.showErrorButton = true;
          this.error = error;
        });

    }
  }

  show() {
    this.showError = true;
  }
}
