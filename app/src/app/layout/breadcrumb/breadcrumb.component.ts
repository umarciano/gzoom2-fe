import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { I18NService } from '../../i18n/i18n.service';
import { FolderMenu } from '../../commons/model/dto';
import { Observable } from 'rxjs';
import { element } from 'protractor';
import { Breadcrumb } from 'primeng/breadcrumb';

// Funzione di rimozione doppie stringhe in Breadcrumbs
function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item.label) ? false : (seen[item.label] = true);
  });
}


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: MenuItem[];
  roots: Observable<FolderMenu[]>;
  public home: MenuItem = { icon: 'fa fa-home', routerLink: '/c/dashboard' };
  public baseHref: String;
  LabelArray: string[] = [];
  // newBreadcrumbs: MenuItem[] = [];

  constructor(private router: Router,
    public readonly i18nService: I18NService,
    private activatedRoute: ActivatedRoute) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    });
  }

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */

  // buildBreadCrumb(route: ActivatedRoute, breadcrumbs: MenuItem[] = []): MenuItem[] {

  //   //label contiene data.breadcrumb
  //   let label = route.routeConfig && route.routeConfig.data ? ' ' + this.i18nService.translate(route.routeConfig.data.breadcrumb) : '';
  //   //- label = :context/analysis

  //   //routing path angular
  //   let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

  //   //prende l'ultima stringa del path
  //   const lastRoutePart = path.split('/').pop();
  //   // console.log("%clastRoutePart : " + lastRoutePart, 'color: pink' )

  //   //se lastRoutePart inizia con : isDynamicRoute è true
  //   const isDynamicRoute = lastRoutePart.startsWith(':');


  //   if (isDynamicRoute && !!route.snapshot) {   //se l'ultimo elemento comincia per : e route.snapshot è true
  //     // console.log("test")
  //     const paramName = lastRoutePart.split(':')[1]; //prende stringa a destra dei :

  //     path = path.replace(lastRoutePart, route.snapshot.params[paramName]); //sostituisce :parametro con il parametro passato

  //     label = ' ' + this.i18nService.translate(route.snapshot.params[paramName]); //traduce il parametro passato

  //   }
  //   else if (isDynamicRoute && !!route.params) {

  //     let par = lastRoutePart.split(':')[1];

  //     console.log("-------PAR:" + par);
      
  //     route.params.subscribe(params => {
  //       path = path.replace(lastRoutePart, params[par]);
  //       label = ' ' + this.i18nService.translate(params[par]);
  //     })
  //   }

  //   let nextUrl = this.router.url;

  //   if (this.router.url != null && this.router.url.indexOf('/') == 0) { //se l'URL è diverso da null e l'URL inizia per '/'
  //     nextUrl = this.router.url.substring(1); //prendi l'URL senza '/'
  //   }

  //   const breadcrumb: MenuItem = {
  //     label: label,
  //     url: nextUrl,
  //     icon: '',
  //   };

  //   // Only adding route with non-empty label
  //   const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
  //   // if(breadcrumb.label){
  //   //   this.newBreadcrumbs.push(breadcrumb);
  //   // }

  //   if (route.firstChild) {
  //     // If we are not on our current path yet,
  //     // there will be more children to look after, to build our breadcumb
  //     return this.buildBreadCrumb(route.firstChild, newBreadcrumbs);
  //   }
  //   // });
  //   return newBreadcrumbs;
  // }

  buildBreadCrumb(route: ActivatedRoute, breadcrumbs: MenuItem[] = []): MenuItem[] {

    // if(!!route.url["_value"][0]) {console.log(route.url["_value"][0].path);}
   
    

    // If no routeConfig is available we are on the root path
    if (route.routeConfig && route.routeConfig.data && route.routeConfig.data.breadcrumb.includes('/')) {
      this.LabelArray = route.routeConfig.data.breadcrumb.split('/');
    }
    else if (route.routeConfig && route.routeConfig.data) {

      if (route.routeConfig.data.breadcrumb != "") {
        this.LabelArray[0] = route.routeConfig.data.breadcrumb;
      } else {
        this.LabelArray[0] = route.routeConfig.path;
      }
    }

    // console.log(this.LabelArray);
    
    
    this.LabelArray.forEach((element,index) => {

      

      if (element != "") {

        let label = route.routeConfig && route.routeConfig.data ? ' ' + this.i18nService.translate(element) : '';

        //routing path angular
        let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

        //if element starts with : isDynamicRoute is true
        const isDynamicRoute = element.startsWith(':');

        let nextUrl = this.router.url;


        if (isDynamicRoute && !!route.snapshot) {
          // console.log("INGRESSO 1");

          const paramName = element.split(':')[1]; 
          let tempArrayNextUrl = nextUrl.split("/");   

          

          if (route.snapshot.params[paramName] && tempArrayNextUrl[2]!='legacy') {
            path = path.replace(element, route.snapshot.params[paramName]);
            label = ' ' + this.i18nService.translate(route.snapshot.params[paramName]);
            nextUrl = nextUrl.substring(0, nextUrl.indexOf(route.snapshot.params[paramName]) + route.snapshot.params[paramName].length);
          } 
          else if(route.snapshot.params[paramName] && tempArrayNextUrl[2]=='legacy') {
            // solo i path del LEGACY entrano qua
            path = path.replace(element, route.snapshot.params[paramName]);
            label = ' ' + this.i18nService.translate(route.snapshot.params[paramName]);            
          }
        }
        else if (isDynamicRoute && !!route.params) {
          // console.log("INGRESSO 2");

          let par = element.split(':')[1];         

          route.params.subscribe(params => {
            path = path.replace(element, params[par]);
            label = ' ' + this.i18nService.translate(params[par]);
            // nextUrl = nextUrl.substring(0, nextUrl.indexOf(params[par]) + params[par].length);
          })

        }else {
          // console.log("INGRESSO 3");

          let tempArrayNextUrl = nextUrl.split("/"); 
                   
          if(tempArrayNextUrl.length > 0){
            nextUrl = "";

            for (let i = 0; i < tempArrayNextUrl.length; i++)  {

              let item = tempArrayNextUrl[i];                

              if(element == item && i==2){        
                // breadcrumb del contesto
                nextUrl += item + "/";
                i = tempArrayNextUrl.length;
                
              }else{
                // breadcrumb dopo il contesto 
                  if(item.toLowerCase() == element.toLowerCase()){
                    nextUrl += item + "/";
                    i = tempArrayNextUrl.length;
                  }else{
                    nextUrl += item + "/";
                  }
                }
                
              }
          }                
        }

        let breadcrumb: MenuItem;
        
          breadcrumb = {
            label: label,
            routerLink: nextUrl,
            icon: '',
            target: "_SELF"
          
        };


        if (breadcrumb.label) {
          breadcrumbs.push(breadcrumb);
        }
      }
    });

    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      this.LabelArray = [];
      return this.buildBreadCrumb(route.firstChild, breadcrumbs);
    }

    breadcrumbs = uniq(breadcrumbs)

    return breadcrumbs;
  }
}
