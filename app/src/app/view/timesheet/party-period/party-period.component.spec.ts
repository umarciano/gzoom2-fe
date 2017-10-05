import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyPeriodComponent } from './party-period.component';

describe('PartyPeriodComponent', () => {
  let component: PartyPeriodComponent;
  let fixture: ComponentFixture<PartyPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
