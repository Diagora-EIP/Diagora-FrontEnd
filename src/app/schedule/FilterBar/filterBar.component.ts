import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChildren,
    QueryList,
    AfterViewInit,
    ChangeDetectionStrategy,
    Output,
    EventEmitter,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { TeamService } from '../../services/team.service';
import { ManagerService } from '../../services/manager.service';
import { DelivererAbsenceModalComponent } from '../modals/create-absent-modal/create-absent-modal';
import { ChangeDetectorRef } from '@angular/core';


@Component({
    selector: 'filter-bar',
    templateUrl: './filterBar.component.html',
    styleUrls: ['./filterBar.component.scss'],
})
export class FilterBarComponent {
    filteredUsers: any[] = [];
    managerControl: FormControl = new FormControl();
    selectedNoTeamUsers: any[] = [];
    teams: any[] = [];
    companyData: any = {};
    usersWithoutTeams: any[] = [];
    selectedTeams: { [key: number]: any[] } = {};
    selectedUsers: { [teamId: string]: any[] } = {};
    teamUsersCache: { [teamId: number]: any[] } = {};
    isLoadingUsersWithoutTeams = true;

    @ViewChildren('teamPanel') teamPanels!: QueryList<MatExpansionPanel>;
    @Output() selectedDataChange: EventEmitter<{
        teams: { [teamId: number]: any[] };
        usersWithoutTeams: any[];
    }> = new EventEmitter<{
        teams: { [teamId: number]: any[] };
        usersWithoutTeams: any[];
    }>();
    @Output() companyDataChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private dialog: MatDialog,
        private TeamService: TeamService,
        private managerService: ManagerService,
        private cdr: ChangeDetectorRef

    ) {}

    async ngOnInit(): Promise<void> {
        try {
            this.isLoadingUsersWithoutTeams = true;
    
            await Promise.all([this.getAllTeamsInfos(), this.getCompanyData()]);
            this.filterUsersWithoutTeams();
            this.openFirstTwoPanels();
        } catch (error) {
            console.error('Error in fetching data:', error);
        } finally {
            this.isLoadingUsersWithoutTeams = false;
            this.cdr.detectChanges();  // Manually trigger change detection
        }
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

    getUsersForTeam(userIds: any[], team: any): any[] {
        if (!userIds || userIds.length === 0) return [];

        const teamKey = team.team_id;
        const teamColor = team.color;

        // If already cached, return the cached value
        if (this.teamUsersCache[teamKey] && this.teamUsersCache[teamKey].length > 0) {
            return this.teamUsersCache[teamKey];
        }

        const userIdsArray = userIds.map((user) => user.user_id);
        this.teamUsersCache[teamKey] = this.filteredUsers
            .filter((user) => userIdsArray.includes(user.user_id))
            .map((user) => ({
                email: user.email,
                name: user.name,
                user_id: user.user_id,
                color: user.color,
                teamColor: teamColor,
            }));


        return this.teamUsersCache[teamKey];
    }

    checkPermission(permission: string): boolean {
        return true;
    }

    compareUsers(user1: any, user2: any): boolean {
        return user1 && user2 && user1.user_id === user2.user_id;
    }

    getScheduleByUser() {}

    onSelectionChange(team: any) {
        this.emitSelectedData();
    }

    toggleSelectAll(event: any, team: any): void {
        if (event.checked) {
            this.selectedTeams[team.team_id] = this.getUsersForTeam(
                team.users,
                team
            );
        } else {
            this.selectedTeams[team.team_id] = [];
        }
        this.emitSelectedData();
    }

    onNoTeamUserSelectionChange(): void {
        this.emitSelectedData();
    }

    onUserSelectionChange(): void {
        this.emitSelectedData();
    }

    private emitSelectedData(): void {
        let selectedteamObj = this.selectedTeams;
        if (this.teams && this.teams.length > 0) {
            for (const team of this.teams) {
                team.isFullySelected = this.isTeamFullySelected(team);
                if (selectedteamObj[team.team_id]) {
                    selectedteamObj[team.team_id].forEach((user) => {
                        user.isFullySelected = this.isTeamFullySelected(team);
                    });
                }
            }
        }

        this.selectedDataChange.emit({
            teams: this.selectedTeams,
            usersWithoutTeams: this.selectedNoTeamUsers,
        });
    }

    isTeamFullySelected(team: any): boolean {
        const selectedUsers = this.selectedTeams[team.team_id] || [];
        const teamUsers = this.getUsersForTeam(team.users, team);
        return selectedUsers.length === teamUsers.length;
    }

    isUserSelected(team: any, user: any): boolean {
        if (!team || !team.team_id) {
            const selectedUsers = this.selectedNoTeamUsers || [];
            return selectedUsers.some(
                (selectedUser) => selectedUser.user_id === user.user_id
            );
        }
        const selectedUsers = this.selectedTeams[team.team_id] || [];
        return selectedUsers.some(
            (selectedUser) => selectedUser.user_id === user.user_id
        );
    }

    isTeamIndeterminate(team: any): boolean {
        if (!team) return false;
        const selectedUsers = this.selectedTeams[team.team_id] || [];
        const teamUsers = this.getUsersForTeam(team.users, team);

        return (
            selectedUsers.length > 0 && selectedUsers.length < teamUsers.length
        );
    }

    filterUsersWithoutTeams(): void {
        if (!this.teams || this.teams.length === 0) {
            this.usersWithoutTeams = [...this.filteredUsers];
        } else {
            const teamUserIds = new Set(
                this.teams.flatMap((team) =>
                    team.users.map((user: { user_id: any }) => user.user_id)
                )
            );
            this.usersWithoutTeams = this.filteredUsers.filter(
                (user) => !teamUserIds.has(user.user_id)
            );
        }
    }

    async getAllTeamsInfos(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.TeamService.getAllTeams().subscribe({
                next: (response: any) => {
                    this.teams = response;
                    resolve();
                },
                error: (error: any) => {
                    console.error('Error in getAllTeamsInfos():', error);
                    reject(error);
                },
            });
        });
    }

    // Returns the company data of the logged-in manager including the users within the company
    async getCompanyData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.managerService.getManagerEntreprise().subscribe({
                next: (response: any) => {
                    this.companyData = response;
                    this.filteredUsers = this.companyData.users || [];
                    localStorage.setItem(
                        'addressEntreprise',
                        this.companyData.address
                    );
                    localStorage.setItem(
                        'nameEntreprise',
                        this.companyData.name
                    );
                    resolve();
                },
                error: (error: any) => {
                    console.error('Error in getCompanyData():', error);
                    reject(error);
                },
            });
        });
    }

    openAbsenceModal(user: any, event: Event): void {
        event.stopPropagation(); // Prevents the click event from bubbling up to the mat-list-option

        const dialogRef = this.dialog.open(DelivererAbsenceModalComponent, {
            width: '400px',
            data: {
                user: user,
                declaredAbsences: user.declaredAbsences || [], // Ensure declaredAbsences is passed
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('New absence declared:', result);
            }
        });
    }

    // Add this method to select a user by default
    private selectDefaultUser(): void {
        const defaultUserId = Number(localStorage.getItem('id')); // Use the logged-in user's ID

        // Check if the user is in usersWithoutTeams
        const defaultUser = this.usersWithoutTeams.find(
            (user) => user.user_id === defaultUserId
        );

        if (defaultUser) {
            this.selectedNoTeamUsers.push(defaultUser);
        } else {
            // If the user is part of a team, find the team and select the user
            for (const team of this.teams) {
                const userInTeam = team.users.find(
                    (user: any) => user.user_id === defaultUserId
                );
                if (userInTeam) {
                    if (!this.selectedTeams[team.team_id]) {
                        this.selectedTeams[team.team_id] = [];
                    }
                    this.selectedTeams[team.team_id].push(userInTeam);
                    break;
                }
            }
        }

        // Emit the selected data
        this.emitSelectedData();
    }
}
