import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../commons/service/client.service';

import { Node } from '../view/node/node';

@Injectable()
export class NodeService {

  constructor(private client: ApiClientService) { }

  /*nodes(): Observable<Node[]> { // TODO
    console.log('search nodes');
    return this.client
      .get('nodes').pipe(
        map(json => json.results as Node[])
      );
  }*/

  node(nodeId: string):  Observable<Node> {
    return this.client
      .get(`node/configuration/${nodeId}`)
      .pipe(
      map(json => json as Node)
      );
  }


  nodeLegacyVersions(): Observable<void | string> {
    return this.client.get(`node/version/legacy`);
  }

  nodeRestVersions(): Observable<void | string> {
    return this.client.get(`node/version/rest`);
  }

  nodeXmlRcpUrl(): Observable<string> {
    return this.client.get(`node/configuration/xmlrcpurl`);
  }

}

