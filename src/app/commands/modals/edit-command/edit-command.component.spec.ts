import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommandComponent } from './edit-command.component';

describe('EditCommandComponent', () => {
  let component: EditCommandComponent;
  let fixture: ComponentFixture<EditCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCommandComponent]
    });
    fixture = TestBed.createComponent(EditCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
