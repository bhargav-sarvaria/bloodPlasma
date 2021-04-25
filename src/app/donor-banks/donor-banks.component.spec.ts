import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorBanksComponent } from './donor-banks.component';

describe('DonorBanksComponent', () => {
  let component: DonorBanksComponent;
  let fixture: ComponentFixture<DonorBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorBanksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
