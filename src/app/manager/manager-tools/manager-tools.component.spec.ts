import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerToolsComponent } from './manager-tools.component';

describe('ManagerToolsComponent', () => {
  let component: ManagerToolsComponent;
  let fixture: ComponentFixture<ManagerToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerToolsComponent]
    });
    fixture = TestBed.createComponent(ManagerToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
