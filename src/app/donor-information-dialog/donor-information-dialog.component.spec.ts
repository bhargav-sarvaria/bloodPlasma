import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorInformationDialogComponent } from './donor-information-dialog.component';

describe('DonorInformationDialogComponent', () => {
  let component: DonorInformationDialogComponent;
  let fixture: ComponentFixture<DonorInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorInformationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
