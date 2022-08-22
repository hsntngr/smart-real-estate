import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateSummaryCardComponent } from './real-estate-summary-card.component';

describe('RealEstateSummaryCardComponent', () => {
  let component: RealEstateSummaryCardComponent;
  let fixture: ComponentFixture<RealEstateSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
