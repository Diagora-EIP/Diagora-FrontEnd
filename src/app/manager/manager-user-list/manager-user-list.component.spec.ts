import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerUserListComponent } from './manager-user-list.component';

describe('UserListComponent', () => {
    let component: ManagerUserListComponent;
    let fixture: ComponentFixture<ManagerUserListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManagerUserListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ManagerUserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
