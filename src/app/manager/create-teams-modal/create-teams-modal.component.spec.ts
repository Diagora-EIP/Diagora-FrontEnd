import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamsModalComponent } from './create-teams-modal.component';

describe('CreateTeamsModalComponent', () => {
  let component: CreateTeamsModalComponent;
  let fixture: ComponentFixture<CreateTeamsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTeamsModalComponent]
    });
    fixture = TestBed.createComponent(CreateTeamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
