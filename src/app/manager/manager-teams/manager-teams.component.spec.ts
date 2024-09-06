import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTeamsComponent } from './manager-teams.component';

describe('ManagerTeamsComponent', () => {
  let component: ManagerTeamsComponent;
  let fixture: ComponentFixture<ManagerTeamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTeamsComponent]
    });
    fixture = TestBed.createComponent(ManagerTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
