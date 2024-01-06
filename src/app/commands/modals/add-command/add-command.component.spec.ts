import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommandComponent } from './add-command.component';

describe('AddCommandComponent', () => {
  let component: AddCommandComponent;
  let fixture: ComponentFixture<AddCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCommandComponent]
    });
    fixture = TestBed.createComponent(AddCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
