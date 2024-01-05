import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVehiculeComponent } from './delete-vehicule.component';

describe('DeleteVehiculeComponent', () => {
  let component: DeleteVehiculeComponent;
  let fixture: ComponentFixture<DeleteVehiculeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteVehiculeComponent]
    });
    fixture = TestBed.createComponent(DeleteVehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
