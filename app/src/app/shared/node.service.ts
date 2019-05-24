import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../api/client.service';

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
    console.log('search node with ' + nodeId);
    return this.client
      .get(`node/configuration/${nodeId}`)
      .pipe(
      map(json => json as Node)
      );
  }

}

