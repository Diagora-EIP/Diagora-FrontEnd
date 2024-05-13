import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationShowModalComponent } from './notification-show-modal.component';

describe('NotificationShowModalComponent', () => {
  let component: NotificationShowModalComponent;
  let fixture: ComponentFixture<NotificationShowModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationShowModalComponent]
    });
    fixture = TestBed.createComponent(NotificationShowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
