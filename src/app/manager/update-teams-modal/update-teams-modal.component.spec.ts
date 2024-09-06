import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeamsModalComponent } from './update-teams-modal.component';

describe('UpdateTeamsModalComponent', () => {
  let component: UpdateTeamsModalComponent;
  let fixture: ComponentFixture<UpdateTeamsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTeamsModalComponent]
    });
    fixture = TestBed.createComponent(UpdateTeamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
