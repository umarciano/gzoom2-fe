import { map, mergeMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { AuthService, UserProfile } from '../../commons/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { LockoutService } from '../../commons/service/lockout.service';
import { LogoutService } from '../../commons/service/logout.service';
import { LoginService } from '../../commons/service/login.service';
import { ChangePasswordService } from '../../shared/change-password/change-password.service';
import { ChangePasswordComponent } from '../../shared/change-password/change-password.component';
import { UserPreferenceService } from '../../api/service/user-preference.service';
import { UserPreference } from '../../shared/user-preference';
import { NodeService } from '../../shared/node.service';
import { SelectItem } from '../../commons/model/selectitem';

import { ApiConfig } from '../../commons/model/api-config';

import { I18NService } from '../../i18n/i18n.service';
import { Message } from '../../commons/model/message';
import { Node } from '../../view/node/node';
import { ApiClientService } from 'app/commons/service/client.service';
import { UserLoginValidPartyRole } from 'app/api/model/userLoginValidPartyRole';
import { MenuService } from 'app/commons/service/menu.service';
import { Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';

const CHANGE_PASS_ENDPOINT = 'change-password';
const CHANGE_LANG_ENDPOINT = 'change-language';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: UserProfile;
  node: Node;
  legacyAppVersions: String;
  restVersions: String;
  displayChangePassword = false;
  displayChangeTheme = false;
  displayUserInfo = false;
  userDetails: any = {};
  partyRoleData: any = {};
  error = '';
  langType: string;
  organizationType: string;
  organizations: UserLoginValidPartyRole[];
  organizationSelectItem: SelectItem[] = [];
  organizationSelected = 'Company';

  allowChangePassword: boolean = true;
  isAdmin: boolean = false;
  displayEmailSystem: boolean = false;
  emailRules: any[] = [];
  emailLog: any[] = [];
  emailLogTotal: number = 0;
  emailRulesLoading: boolean = false;
  emailLogLoading: boolean = false;

  activeTab: string = 'invio';
  emailLogFilter: string = '';
  emailLogStatusFilter: string = '';
  emailLogTypeFilter: string = '';
  emailLogPage: number = 0;
  readonly emailLogPageSize: number = 10;
  selectedInvioRuleId: string = '';
  invioDataScadenza: string = '';

  // Config dropdown da API
  configTipologie: {id: string, description: string}[] = [];
  configStati: {id: string, description: string}[] = [];
  configUo: {id: string, name: string}[] = [];
  allStatiMap: {[statusId: string]: string} = {};

  // Form "Crea / Modifica regola"
  customRules: any[] = [];
  customRulesLoading: boolean = false;
  editingRuleId: string | null = null;
  nrfName: string = '';
  nrfTipologia: string = 'CTX_EP';
  nrfStato: string = '';
  nrfDestinatario: string = 'WEM_EVAL_IN_CHARGE';
  nrfUO: string[] = [];
  nrfUOPicker: string = '';
  nrfSubject: string = '[GZOOM] Schede di valutazione da condividere — ciclo performance {{anno_valutazione}}';
  nrfBody: string = 'Gentile {{nome_destinatario}},\n\nrisultano {{num_schede}} schede di valutazione ancora nello stato "Valutazione da completare" per il ciclo di valutazione performance {{anno_valutazione}}.\n\nTi invitiamo a completare le operazioni necessarie entro il {{data_scadenza}}, in modo che possano prenderne visione.\n\nAccedi al portale: {{link_piattaforma}}\n\nCordiali saluti,\nUOC Pianificazione e Controllo di Gestione';

  private readonly DESTINATARI_MAP: {[tipologia: string]: {id: string, label: string}[]} = {
    'CTX_EP': [
      { id: 'WEM_EVAL_IN_CHARGE', label: 'Valutato' },
      { id: 'WEM_EVAL_MANAGER',   label: 'Valutatore' },
    ],
    'CTX_OR': [
      { id: 'DIRETTORE_UOC',  label: 'Direttore UOC' },
      { id: 'DIRETTORE_UOSD', label: 'Direttore UOSD' },
    ],
    'CTX_BS': [
      { id: 'DIRETTORE_UOC',  label: 'Direttore UOC' },
      { id: 'DIRETTORE_UOSD', label: 'Direttore UOSD' },
    ],
  };


  msgs: Message[] = [];
  languages: String[] = [];
  currentPassword: String;
  newPassword: String;
  newPasswordVerify: String;
  serverUrl: string;
  urlParam = 'GP_HOMEPAGE';

  private readonly changePassUrl: string;
  private readonly changeLangUrl: string;

  THEME_GREEN: String = 'GPLUS_GREEN_ACC';
  THEME_BLUE: String = 'GPLUS_BLUE_ACC';
  THEME_VIOLET: String = 'GPLUS_VIOLET_ACC';
  THEME_BLUE_LIGHT: String = "GPLUS_BLUE_LIGHT";
  THEME_GREEN_LIGHT: String = "GPLUS_GREEN_LIGHT";
  THEME_VIOLET_LIGHT: String = "GPLUS_VIOLET_LIGHT";
  THEME_HIGH_CONTRAST: String = "GPLUS_HIGH_CONTRAST";

  userPreference: UserPreference = new UserPreference();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readonly authSrv: AuthService,
              private readonly lockoutSrv: LockoutService,
              private readonly logoutSrv: LogoutService,
              private readonly userPreferenceService: UserPreferenceService,
              private readonly nodeService: NodeService,
              private readonly i18nService: I18NService,
              private readonly loginService: LoginService,
               private readonly changePasswordService: ChangePasswordService,
               private readonly changePasswordComponent: ChangePasswordComponent,
              private http: HttpClient,
              private apiConfig: ApiConfig,
              private authService: AuthService,
              private client: ApiClientService,
              private menuService: MenuService,
              private titleService: Title,
              private sanitizer: DomSanitizer
              ) {
    this.user = authSrv.userProfile();

    this.changePassUrl = `${apiConfig.rootPath}/${CHANGE_PASS_ENDPOINT}`;
    this.changeLangUrl = `${apiConfig.rootPath}/${CHANGE_LANG_ENDPOINT}`;
  }

  ngOnInit() {
    this.route.data.pipe(
      map((data: { node: Node }) => data.node),
    ).subscribe((data) => {
      this.node = data;
    });

    this.route.data.pipe(
      map((data: { theme: UserPreference }) => data.theme),
    ).subscribe((data) => {
      this.userPreference = data;
      this.setTheme(this.userPreference.userPrefValue);
    });


    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe( data => {
      this.urlParam = data['url'];
      this.urlParam = this.urlParam && this.urlParam.indexOf('legacy')>0?this.urlParam.substr(this.urlParam.lastIndexOf('/')+1,this.urlParam.length):'GP_HOMEPAGE';
    });

    this.langType = this.i18nService.getLanguageType();
    this.client.get('/profile/i18n/languages').subscribe( json => {
      this.languages = json.results as String[];
      console.log('languages available ' + this.languages);
    });

    this.userPreferenceService.getUserPreference('ORGANIZATION_PARTY').subscribe(
      data => {
        console.log('data.userPrefValue:' + data.userPrefValue);
        if (data.userPrefValue && data.userPrefValue !== 'DEFAULT') {
          this.organizationSelected = data.userPrefValue;
        }

        console.log('organizationSelected:' + this.organizationSelected);
       }
    );

    this.userPreferenceService.getOrganizationMultiType().subscribe(
      data => {this.organizationType = data;
      console.log('Organization type: ' + this.organizationType);
    });

    this.nodeService.nodeXmlRcpUrl().subscribe(
      data => {this.serverUrl = data.substring(0,data.indexOf('/gzoom'));
      console.log('Server URL: '+this.serverUrl)}
    )

    const organizationsReload = this.userPreferenceService.getOrganizations()
    .subscribe(
      data => {
        this.organizationSelectItem = this.organization2SelectItems(data);

        //setting title browser tab by organization selected
        let title = this.organizationSelectItem.find(item =>
          item.value === this.organizationSelected
        );
        this.titleService.setTitle(title.label);
      }
    );


    const loginService$ = this.loginService.getUserLogin();
    const usr = lastValueFrom(loginService$).then(
      userLogin => {
        if(userLogin) {
          if (userLogin.requirePasswordChange)
            this.changePasswordService.openPopup(userLogin);
        }
      });

    // const usr = this.loginService.getUserLogin().toPromise().then(
    //   userLogin => {
    //     if(userLogin) {
    //       if (userLogin.requirePasswordChange)
    //         this.changePasswordService.openPopup(userLogin);
    //     }
    //   });

    this.displayChangeTheme = false;

    this.nodeService.nodeLegacyVersions().subscribe(
      (legacyVersions: string) => {
        this.legacyAppVersions = legacyVersions;
      }
    );

    this.nodeService.nodeRestVersions().subscribe(
      (restVersions: string) => {
        this.restVersions = restVersions;
      }
    );

    //request enableChangePassword for show/hide the changePassword button
    this.client.get('/api/getEnableChangePassword').subscribe(
      (boolResponse: boolean)  => this.allowChangePassword = boolResponse,
      (err) => console.log(err)
    );

    this.client.get('/email/isAdmin').subscribe(
      (admin: boolean) => this.isAdmin = admin,
      () => this.isAdmin = false
    );
  }

  toggleSidebar() {

    const dom: any = document.querySelector('body');
    const menu: any = document.getElementById('sidebar');

    if (!menu || !dom) {
      console.error('Elementi non trovati!');
      return;
  }

    if (menu.classList.contains('collapse')) {
      dom.classList.remove('push-right');
    } else {
      dom.classList.add('push-right');
    }
    menu.classList.toggle('collapse');
  }

  logout() {
    this.logoutSrv.logout().then(() => {
      this.lockoutSrv.lockout();

      //TODO logout SSO

      this.http.get('/rest/api/getLoginMethod').subscribe(
        (data: any) => {
            console.log('login method : ' + data);
            if(data == 'OneLogin')
            {
              this.http.get('/rest/api/getOneLogin-LogoutUrl').subscribe(
                (url: any) => {
                    console.log('OneLogin-LogoutUrl : ' + url);
                    window.location.href = url;
                  },
                err => console.log(err) // error
                );
            }
          },
        err => console.log(err) // error
        );
    });
  }

  changePasswordDialog() {



    const loginService$ = this.loginService.getUserLogin();
    const usr = lastValueFrom(loginService$).then(
      userLogin => {
        if(userLogin) {
          this.changePasswordService.openPopup(userLogin);
        }
      });

    // const usr = this.loginService.getUserLogin().toPromise().then(
    //   userLogin => {
    //     if(userLogin) {
    //       this.changePasswordService.openPopup(userLogin);
    //     }
    //   });
  }

  changeThemeDialog() {
    this.displayChangeTheme = true;
  }

  setTheme(theme) {
    window['switchStyle'](theme);
    this.displayChangeTheme = false;
  }

  openHelp() {
    console.log('Open help');
    this.menuService.getHelpId(this.urlParam).subscribe((data: string) => {
      window.open(`${this.serverUrl}/help/content/${data.substring(data.indexOf("_")+1)}.htm`,'_blank').focus();
    });
  }

  setOrganization() {
    console.log('setOrganization: ' + this.organizationSelected);
    const newOrganization: UserPreference = new UserPreference();
    newOrganization.userPrefValue = this.organizationSelected;
    newOrganization.userPrefTypeId = 'ORGANIZATION_PARTY';
    this.userPreferenceService.updateUserPreference(newOrganization)
      .then(() => window.location.reload())
      .catch((error) => {
        console.log('ERROR setOrganization', error);
        this.error = this.i18nService.translate(error) || error;
      })
  }

  saveChangeTheme(theme) {
    this.userPreference.userPrefTypeId = 'VISUAL_THEME';
    this.userPreference.userPrefValue = theme;
    this.userPreferenceService
      .updateUserPreference(this.userPreference)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log('error.message' , error);
        this.error = this.i18nService.translate(error) || error;
      });
  }

  changeLang(lang: String) {
    const body = JSON.stringify({ username: this.user.username, externalLoginKey: this.user.externalLoginKey, lang: lang});
    this.client.post(this.changeLangUrl, body)
      .subscribe((data: any) => {
        console.log('change language:' + data);
        window.location.reload();
      },
      err => {
        console.log('error change language', err);
      });
  }


  organization2SelectItems(organization: UserLoginValidPartyRole[]): SelectItem[] {
    if (organization == null) {
      return [];
    }
    return _.map(organization['results'], u => {
      let label = u.partyGroup.groupName;
      if (this.languages.length > 1 && this.languages[1].indexOf(this.i18nService.getLang()) >= 0) {
        label = u.partyGroup.groupNameLang;
      }
      return {
        label: label, value: u.partyId
      };
    });
  }

  userInfoDialog() {
    if (!this.user?.username) {
      this.setDefaultUserDetails();
      this.displayUserInfo = true;
      return;
    }
    
    // Inizializza con loading
    this.userDetails = { 
      employeeId: 'Loading...', 
      fiscalCode: 'Loading...', 
      positionType: 'Loading...' 
    };
    
    // Chiama l'API dedicata per recuperare le informazioni complete dell'utente
    this.client.get(`/user-info/${this.user.username}`).subscribe(
      (userInfo: any) => {
        // Aggiorna i dati per il display
        this.userDetails = {
          employeeId: userInfo.matricola || userInfo.userLoginId || 'N/A',
          fiscalCode: userInfo.fiscalCode || 'N/A',
          positionType: userInfo.positionType || 'N/A'
        };
        
        // Store completo per eventuali usi futuri
        this.partyRoleData = userInfo;
      },
      (error) => {
        console.error('Error loading user info:', error);
        // Fallback ai dati di default
        this.setDefaultUserDetails();
      }
    );
    
    this.displayUserInfo = true;
  }
  
  setDefaultUserDetails() {
    this.userDetails = {
      employeeId: this.user?.username || 'N/A',
      fiscalCode: 'N/A',
      positionType: 'N/A'
    };
    this.partyRoleData = {};
  }

  emailSystemDialog() {
    this.displayEmailSystem = true;
    this.activeTab = 'invio';
    this.emailLogPage = 0;
    this.emailLogFilter = '';
    this.emailLogStatusFilter = '';
    this.emailLogTypeFilter = '';
    this.selectedInvioRuleId = this.customRules[0]?.ruleId || '';
    // data scadenza default: fine anno corrente
    const now = new Date();
    this.invioDataScadenza = `${now.getFullYear()}-12-31`;
    this.loadEmailRules();
    this.loadEmailLog();
    this.loadConfigData();
    this.loadCustomRules();
  }

  setEmailTab(tab: string) {
    this.activeTab = tab;
  }

  onEmailOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.displayEmailSystem = false;
    }
  }

  filteredEmailLog(): any[] {
    return this.emailLog.filter(l => {
      const q = this.emailLogFilter.toLowerCase();
      const matchFilter = !q || (l.recipientEmail || '').toLowerCase().includes(q) || (l.subject || '').toLowerCase().includes(q);
      const matchStatus = !this.emailLogStatusFilter || l.status === this.emailLogStatusFilter;
      const matchType = !this.emailLogTypeFilter || l.ruleId === this.emailLogTypeFilter;
      return matchFilter && matchStatus && matchType;
    });
  }

  emailLogPaged(): any[] {
    const f = this.filteredEmailLog();
    const start = this.emailLogPage * this.emailLogPageSize;
    return f.slice(start, start + this.emailLogPageSize);
  }

  emailLogTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmailLog().length / this.emailLogPageSize));
  }

  emailLogPageRange(): number[] {
    return Array.from({ length: this.emailLogTotalPages() }, (_, i) => i);
  }

  getInvioRule(): any {
    if (!this.selectedInvioRuleId) return null;
    return this.customRules.find(r => r.ruleId === this.selectedInvioRuleId) || null;
  }

  formatDataScadenza(): string {
    if (!this.invioDataScadenza) return '—';
    const [y, m, d] = this.invioDataScadenza.split('-');
    return `${d}/${m}/${y}`;
  }

  // ---- Config da API ----
  loadConfigData() {
    this.client.get('/email/rules/config/tipologie').subscribe(
      (data: any) => {
        this.configTipologie = data || [];
        if (this.configTipologie.length > 0 && !this.nrfTipologia) {
          this.nrfTipologia = this.configTipologie[0].id;
        }
      }
    );
    this.client.get('/email/rules/config/uo').subscribe(
      (data: any) => { this.configUo = data || []; }
    );
    // Precarica tutti gli stati per tutti i CTX (per label nelle card)
    ['CTX_EP', 'CTX_OR', 'CTX_BS'].forEach(ctx => {
      this.client.get(`/email/rules/config/stati?tipologia=${ctx}`).subscribe(
        (data: any[]) => {
          (data || []).forEach(s => this.allStatiMap[s.id] = s.description);
        }
      );
    });
    // Carica stati per la tipologia corrente del form
    this.loadStatiForTipologia(this.nrfTipologia);
  }

  loadStatiForTipologia(tipologia: string) {
    this.client.get(`/email/rules/config/stati?tipologia=${tipologia}`).subscribe(
      (data: any) => {
        this.configStati = data || [];
        if (this.configStati.length > 0) this.nrfStato = this.configStati[0].id;
      }
    );
  }

  loadCustomRules() {
    this.customRulesLoading = true;
    this.client.get('/email/rules/custom').subscribe(
      (result: any) => {
        this.customRules = result.results || [];
        this.customRulesLoading = false;
        if (!this.selectedInvioRuleId && this.customRules.length > 0) {
          this.selectedInvioRuleId = this.customRules[0].ruleId;
        }
      },
      () => this.customRulesLoading = false
    );
  }

  // ---- Helper label ----
  tipologiaLabel(id: string): string {
    const t = this.configTipologie.find(x => x.id === id);
    return t ? t.description : id;
  }

  statoLabel(id: string): string {
    return this.allStatiMap[id] || id;
  }

  destinatarioLabel(id: string): string {
    for (const opts of Object.values(this.DESTINATARI_MAP)) {
      const found = opts.find(d => d.id === id);
      if (found) return found.label;
    }
    return id;
  }

  uoName(partyId: string): string {
    const u = this.configUo.find(x => x.id === partyId);
    return u ? u.name : partyId;
  }

  tipoBadgeClass(typeId: string): string {
    const map: {[k: string]: string} = { 'CTX_EP': 'blue', 'CTX_OR': 'amber', 'CTX_BS': 'green' };
    return map[typeId] || 'gray';
  }

  invioRuleUoDisplay(rule: any): string {
    if (!rule) return '—';
    if (!rule.uoList) return 'Tutte le UO';
    try {
      const ids: string[] = JSON.parse(rule.uoList);
      return ids.map((id: string) => this.uoName(id)).join(', ') || 'Tutte le UO';
    } catch { return 'Tutte le UO'; }
  }

  // ---- Opzioni dinamiche form ----
  nrfStatiOptions(): {id: string, description: string}[] {
    return this.configStati;
  }

  nrfDestinatariOptions(): {id: string, label: string}[] {
    return this.DESTINATARI_MAP[this.nrfTipologia] || [];
  }

  onNrfTipologiaChange() {
    this.nrfStato = '';
    const dest = this.nrfDestinatariOptions();
    this.nrfDestinatario = dest.length > 0 ? dest[0].id : '';
    this.loadStatiForTipologia(this.nrfTipologia);
  }

  nrfAvailableUO(): {id: string, name: string}[] {
    return this.configUo.filter(u => !this.nrfUO.includes(u.id));
  }

  addNrfUO(id: string) {
    if (!id) return;
    if (!this.nrfUO.includes(id)) this.nrfUO = [...this.nrfUO, id];
    this.nrfUOPicker = '';
  }

  removeNrfUO(id: string) {
    this.nrfUO = this.nrfUO.filter(u => u !== id);
  }

  // ---- Preview live ----
  private readonly PH_DB: {[k: string]: string} = {
    '{{nome_destinatario}}': 'Mario Rossi',
    '{{anno_valutazione}}': '2025',
    '{{num_schede}}': '3',
    '{{link_piattaforma}}': 'https://gzoom.../dashboard',
    '{{uo_destinatario}}': 'UOC Cardiologia',
    '{{nome_valutatore}}': 'Dr. Bianchi',
  };
  private readonly PH_RUNTIME: {[k: string]: string} = {
    '{{data_scadenza}}': '31/03/2025',
    '{{note_amministratore}}': 'Si prega di completare al più presto',
  };

  nrfPreviewHtml(text: string): SafeHtml {
    const esc = (s: string) => s.replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    // escape first, then replace newlines and placeholder tokens
    let out = esc(text).replace(/\n/g, '<br>');
    Object.entries(this.PH_DB).forEach(([k, v]) => {
      out = out.split(esc(k)).join(`<span class="gz-em-ph-token">${esc(v)}</span>`);
    });
    Object.entries(this.PH_RUNTIME).forEach(([k, v]) => {
      out = out.split(esc(k)).join(`<span class="gz-em-ph-token runtime">${esc(v)}</span>`);
    });
    return this.sanitizer.bypassSecurityTrustHtml(out);
  }

  nrfInsertPlaceholder(ph: string) {
    const ta = document.getElementById('gz-em-body-ta') as HTMLTextAreaElement;
    if (!ta) { this.nrfBody += ph; return; }
    const start = ta.selectionStart ?? this.nrfBody.length;
    const end = ta.selectionEnd ?? start;
    this.nrfBody = this.nrfBody.slice(0, start) + ph + this.nrfBody.slice(end);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + ph.length; }, 0);
  }

  // ---- CRUD regole custom ----
  saveCustomRule() {
    if (!this.nrfName.trim()) return;
    const payload = {
      name: this.nrfName.trim(),
      workEffortTypeId: this.nrfTipologia,
      statusId: this.nrfStato,
      recipientRoleTypeId: this.nrfDestinatario,
      uoList: this.nrfUO.length > 0 ? JSON.stringify(this.nrfUO) : null,
      subject: this.nrfSubject,
      bodyTemplate: this.nrfBody,
      enabled: true,
    };
    if (this.editingRuleId !== null) {
      this.client.put(`/email/rules/custom/${this.editingRuleId}`, payload).subscribe(
        () => { this.loadCustomRules(); this.resetRuleForm(); },
        (err) => console.error('Errore salvataggio regola', err)
      );
    } else {
      this.client.post('/email/rules/custom', payload).subscribe(
        () => { this.loadCustomRules(); this.resetRuleForm(); },
        (err) => console.error('Errore creazione regola', err)
      );
    }
  }

  editCustomRule(rule: any) {
    this.editingRuleId = rule.ruleId;
    this.nrfName = rule.name;
    this.nrfTipologia = rule.workEffortTypeId;
    this.nrfDestinatario = rule.recipientRoleTypeId;
    this.nrfUO = rule.uoList ? JSON.parse(rule.uoList) : [];
    this.nrfSubject = rule.subject;
    this.nrfBody = rule.bodyTemplate;
    // carica gli stati per la tipologia della regola, poi imposta lo stato
    this.client.get(`/email/rules/config/stati?tipologia=${rule.workEffortTypeId}`).subscribe(
      (data: any) => {
        this.configStati = data || [];
        this.nrfStato = rule.statusId;
      }
    );
  }

  deleteCustomRule(ruleId: string) {
    this.client.delete(`/email/rules/custom/${ruleId}`).subscribe(
      () => {
        if (this.editingRuleId === ruleId) this.resetRuleForm();
        this.loadCustomRules();
      },
      (err) => console.error('Errore eliminazione regola', err)
    );
  }

  resetRuleForm() {
    this.editingRuleId = null;
    this.nrfName = '';
    this.nrfTipologia = 'CTX_EP';
    this.nrfDestinatario = 'WEM_EVAL_IN_CHARGE';
    this.nrfUO = [];
    this.nrfUOPicker = '';
    this.nrfSubject = '[GZOOM] Schede di valutazione da condividere — ciclo performance {{anno_valutazione}}';
    this.nrfBody = 'Gentile {{nome_destinatario}},\n\nrisultano {{num_schede}} schede di valutazione ancora nello stato "Valutazione da completare" per il ciclo di valutazione performance {{anno_valutazione}}.\n\nTi invitiamo a completare le operazioni necessarie entro il {{data_scadenza}}, in modo che possano prenderne visione.\n\nAccedi al portale: {{link_piattaforma}}\n\nCordiali saluti,\nUOC Pianificazione e Controllo di Gestione';
    this.loadStatiForTipologia('CTX_EP');
  }

  loadEmailRules() {
    this.emailRulesLoading = true;
    this.client.get('/email/rules').subscribe(
      (result: any) => {
        this.emailRules = result.results || [];
        this.emailRulesLoading = false;
      },
      () => this.emailRulesLoading = false
    );
  }

  toggleEmailRule(ruleId: string, enabled: boolean) {
    this.client.post(`/email/rules/${ruleId}/toggle`, { enabled }).subscribe(
      () => this.loadEmailRules(),
      (err) => console.error('Errore toggle regola email', err)
    );
  }

  loadEmailLog() {
    this.emailLogLoading = true;
    this.client.get('/email/log?limit=100').subscribe(
      (result: any) => {
        this.emailLog = result.results || [];
        this.emailLogTotal = result.total || 0;
        this.emailLogLoading = false;
      },
      () => this.emailLogLoading = false
    );
  }

  /**
   * Scarica il PDF della procedura di conciliazione
   * Usa HttpClient con token di autenticazione esplicito
   */
  downloadProceduraRicorso() {
    const downloadUrl = `${this.apiConfig.rootPath}/procedura-ricorso/download`;
    
    console.log('Inizio download procedura conciliazione...');
    console.log('URL download:', downloadUrl);
    
    // Ottieni il token manualmente
    const token = this.authSrv.token();
    
    if (!token) {
      console.error('Token non trovato, utente non autenticato');
      alert('Errore: devi essere autenticato per scaricare il PDF.');
      return;
    }
    
    console.log('Token trovato, avvio download con autenticazione...');
    
    // Crea headers con token esplicito
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // Usa HttpClient con headers espliciti
    this.http.get(downloadUrl, {
      headers: headers,
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        console.log('Download completato, creazione blob...');
        
        // Crea blob dal response body
        const blob = new Blob([response.body], { type: 'application/pdf' });
        
        // Crea URL temporaneo per il blob
        const url = window.URL.createObjectURL(blob);
        
        // Crea link temporaneo e simula click
        const link = document.createElement('a');
        link.href = url;
        link.download = 'documentazione_procedura_conciliazione.pdf';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log('Download procedura di conciliazione completato');
        }, 100);
      },
      error: (error) => {
        console.error('Errore durante il download del PDF:', error);
        if (error.status === 401 || error.status === 403) {
          alert('Errore di autenticazione. Effettua nuovamente il login.');
        } else if (error.status === 404) {
          alert('File PDF non trovato sul server.');
        } else {
          alert('Errore durante il download del PDF: ' + error.message);
        }
      }
    });
  }

}
