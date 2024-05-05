import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGestionClientComponent } from './manager-gestion-client.component';

describe('ManagerGestionClientComponent', () => {
  let component: ManagerGestionClientComponent;
  let fixture: ComponentFixture<ManagerGestionClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerGestionClientComponent]
    });
    fixture = TestBed.createComponent(ManagerGestionClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
