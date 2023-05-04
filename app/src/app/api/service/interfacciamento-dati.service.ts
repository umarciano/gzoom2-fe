import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from '../../commons/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Message} from 'primeng//api';
import {MessageService} from 'primeng/api';


@Injectable()
export class InterfacciamentoDatiService {

  constructor(private client: ApiClientService) { }

  shareFile(file: File):  Promise<any> { 
    const formData = new FormData();
    formData.append("file", file);

    const client$ = this.client.postFormData('interfacciamentoDati', formData);
    return lastValueFrom(client$).then(response => response)
    .catch(response => {
      console.error(`Error while share file xlsx in: ${response.error.message}`);
      return Promise.reject(response.error.message);
    });
  }
}




