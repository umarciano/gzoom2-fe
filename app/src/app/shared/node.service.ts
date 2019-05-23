import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from '../api/client.service';

import { Node } from '../view/node/node';

import { UomType } from '../view/uom/uom-type/uom_type';
import { Uom } from '../view/uom/uom/uom';
import { UomRangeValues } from '../view/uom/range-values/uom-range-values';
import { UomRatingScale } from '../view/uom/scale/uom_rating_scale';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class NodeService {

  constructor(private client: ApiClientService) { }

  nodes(): Observable<Node[]> { // TODO
    console.log('search nodes');
    return this.client
      .get('nodes').pipe(
        map(json => json.results as Node[])
      );
  }

  node(nodeId: string):  Observable<Node> {
    console.log('search node with ' + nodeId);
    return this.client
      .get(`node/configuration/${nodeId}`)
      .pipe(
      map(json => json as Node)
      );
  }

}

