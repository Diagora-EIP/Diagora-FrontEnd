import { Component, Input, OnChanges, SimpleChanges, ViewChildren, QueryList, AfterViewInit, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { TeamService } from '../../services/team.service';
import { ManagerService } from '../../services/manager.service';
import { DelivererAbsenceModalComponent } from '../modals/create-absent-modal/create-absent-modal';


@Component({
    selector: 'filter-bar',
    templateUrl: './filterBar.component.html',
    styleUrls: ['./filterBar.component.scss'],
})
export class FilterBarComponent implements AfterViewInit {
    @Input() UsersTeams: any = {};
    filteredUsers: any[] = [];
    managerControl: FormControl = new FormControl();
    selectedTeams: { [teamId: number]: any[] } = {};
    selectedNoTeamUsers: any[] = [];
    teams: any[] = [];
    companyData: any = {};
    usersWithoutTeams: any[] = [];
    isLoadingTeams: boolean = true;

    @ViewChildren('teamPanel') teamPanels!: QueryList<MatExpansionPanel>;
    @Output() selectedDataChange: EventEmitter<{ teams: { [teamId: number]: any[] }, usersWithoutTeams: any[] }> = new EventEmitter<{ teams: { [teamId: number]: any[] }, usersWithoutTeams: any[] }>();
    @Output() companyDataChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private dialog: MatDialog,
        private TeamService: TeamService,
        private managerService: ManagerService
    ) {}

    ngOnInit(): void {
        this.getAllTeamsInfos().then(() => {
            this.isLoadingTeams = false;
            this.openFirstTwoPanels();
        });
        this.getCompanyData();
    }

    ngAfterViewInit(): void {
        this.teamPanels.changes.subscribe(() => {
            this.openFirstTwoPanels();
        });
    }


    openFirstTwoPanels(): void {
        const panels = this.teamPanels.toArray();
        if (panels.length > 0) panels[0].open();
    }

    onManagerInput(event: any): void {
        const value = event.target.value;
        this.filteredUsers = this.filterManagers(value);
    }

    filterManagers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.filteredUsers.filter((user) =>
            user.name.toLowerCase().includes(filterValue)
        );
    }

    displayManager(manager: any): string {
        return manager ? manager.name : '';
    }

    getUsersForTeam(userIds: any[]): any[] {
        if (!userIds || userIds.length === 0)
            return [];
        const userIdsArray = userIds.map(user => user.user_id);
        const filteredUsers = this.filteredUsers.filter(user => userIdsArray.includes(user.user_id));
        return filteredUsers;
    }

    checkPermission(permission: string): boolean {
        return true;
    }

    getScheduleByUser() {
       
    }

    toggleSelectAll(event: any, team: any): void {
        if (event.checked) {
            this.selectedTeams[team.team_id] = this.getUsersForTeam(team.users);
        } else {
            this.selectedTeams[team.team_id] = [];
        }
        this.emitSelectedData();
    }

    onNoTeamUserSelectionChange(): void {
        this.emitSelectedData();
    }

    onSelectionChange(team: any): void {
        // Trigger change detection for the team selection
    }

    private emitSelectedData(): void {
        this.selectedDataChange.emit({
            teams: this.selectedTeams,
            usersWithoutTeams: this.selectedNoTeamUsers
        });
    }

    isTeamFullySelected(team: any): boolean {
        const selectedUsers = this.selectedTeams[team.team_id] || [];
        const teamUsers = this.getUsersForTeam(team.users);
        return selectedUsers.length === teamUsers.length;
    }

    isUserSelected(team: any, user: any): boolean {
        if (!team || !team.team_id) {
            const selectedUsers = this.selectedNoTeamUsers || [];
            return selectedUsers.some(selectedUser => selectedUser.user_id === user.user_id);
        }
    
        const selectedUsers = this.selectedTeams[team.team_id] || [];
        return selectedUsers.some(selectedUser => selectedUser.user_id === user.user_id);
    }

    isTeamIndeterminate(team: any): boolean {
        if (!team)
            return false;
        const selectedUsers = this.selectedTeams[team.team_id] || [];
        const teamUsers = this.getUsersForTeam(team.user_ids);

        return selectedUsers.length > 0 && selectedUsers.length < teamUsers.length;
    }

    // Filter users who are not assigned to any team
    filterUsersWithoutTeams(): void {
        const teamUserIds = new Set(this.teams.flatMap(team => team.users.map((user: { user_id: any; }) => user.user_id)));
        this.usersWithoutTeams = this.filteredUsers.filter(user => !teamUserIds.has(user.user_id));
    }

    // Returns all teams within user company, including the users assigned to each team
    async getAllTeamsInfos(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.TeamService.getAllTeams().subscribe({
                next: (response: any) => {
                    console.log("getAllTeamsInfos() response:", response);
                    this.teams = response;
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getAllTeamsInfos():", error);
                    reject(error);
                }
            });
        });
    }

    // Returns the company data of the logged in manager including the users within the company
    async getCompanyData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.managerService.getManagerEntreprise().subscribe({
                next: (response: any) => {
                    console.log("getCompanyData() response:", response);
                    this.companyData = response;
                    this.filteredUsers = this.companyData.users || [];
                    this.filterUsersWithoutTeams();
                    this.companyDataChange.emit(this.companyData);
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getCompanyData():", error);
                    reject(error);
                }
            });
        });
    }

    openAbsenceModal(user: any, event: Event): void {
        event.stopPropagation(); // Prevents the click event from bubbling up to the mat-list-option
    
        const dialogRef = this.dialog.open(DelivererAbsenceModalComponent, {
          width: '400px',
          data: { 
            user: user, 
            declaredAbsences: user.declaredAbsences || [] // Ensure declaredAbsences is passed
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Handle the new absence declaration
            console.log('New absence declared:', result);
          }
        });
    }
}
