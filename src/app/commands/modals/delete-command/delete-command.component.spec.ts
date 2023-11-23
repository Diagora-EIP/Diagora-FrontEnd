import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCommandComponent } from './delete-command.component';

describe('DeleteCommandComponent', () => {
  let component: DeleteCommandComponent;
  let fixture: ComponentFixture<DeleteCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteCommandComponent]
    });
    fixture = TestBed.createComponent(DeleteCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
