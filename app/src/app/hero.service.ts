import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


import { ApiClientService } from './api/client.service';
import { Hero } from './hero';

import 'rxjs/add/operator/toPromise';

const HEROES_URL = 'rest/heroes';  // URL to web api
const HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class HeroService {

  constructor(private http: HttpClient, private client: ApiClientService) { }

  getHeroes(): Promise<Hero[]> {
    return this.client.get('heroes')
      .toPromise()
      .then(json => json.results as Hero[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error(`Error occurred while calling ${HEROES_URL}`, error);
    return Promise.reject(error.message || error);
  }

  getHero(id: number): Promise<Hero> {
    return this.getHeroes()
      .then(heroes => heroes.find(hero => hero.id === id));
  }

  create(name: string): Promise<Hero> {
    return this.http
      .post(HEROES_URL, JSON.stringify({ name: name }), {headers: HEADERS})
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  update(hero: Hero): Promise<Hero> {
    const url = `${HEROES_URL}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), { headers: HEADERS })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${HEROES_URL}/${id}`;
    return this.http.delete(url, { headers: HEADERS })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
}
