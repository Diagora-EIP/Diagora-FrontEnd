import { Component, Inject } from '@angular/core';
import { Observable, Subscription, map, startWith, throwIfEmpty } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManagerService } from '../../services/manager.service';
import { TeamsService } from '../../services/teams.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-create-teams-modal',
  templateUrl: './create-teams-modal.component.html',
  styleUrls: ['./create-teams-modal.component.scss']
})
export class CreateTeamsModalComponent {
  myControl = new FormControl('');
  team: any = {}
  teamsUpdateSubscription: Subscription | undefined
  name: string = ''
  entrepriseUsers: any = [];
  displayedUsers: string[] = [];
  displayedColumns = ['Nom du livreur', 'email', 'settings'];
  filteredOptions: Observable<string[]>;
  dataSource: MatTableDataSource<User>;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTeamsModalComponent>,
    private managerService: ManagerService,
    private teamsService: TeamsService
  ) {
    this.team = {}
    this.team.users = []
    this.name = ""
    this.dataSource = new MatTableDataSource(this.team.users);
    this.entrepriseUsers = data.entrepriseUsers;
    this.getUserEntreprise()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    console.log('filteredOptions', this.filteredOptions)
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.displayedUsers.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  getUserEntreprise() {
    this.entrepriseUsers.forEach((user: any) => {
      this.displayedUsers.push(
        user.name
      );
    })
    if (this.team.users) {
      this.team.users.forEach((user: any) => {
        this.displayedUsers = this.displayedUsers.filter((name: string) => name !== user.name)
      })
    }
  }
  close(): void {
    console.log("close", this.team)
    this.dialogRef.close(this.team);
    this.teamsUpdateSubscription?.unsubscribe();
  }

  addUser() {
    const selectedUser = this.entrepriseUsers.find((user: any) => user.name === this.myControl.value)
    if (selectedUser) {
      this.team.users.push(selectedUser);
      this.dataSource.data = [...this.team.users];  // Update the data source
    }
  }

  callDeleteUser(user: any) {
    this.team.users = this.team.users.filter((u: any) => u.name !== user.name)
    this.dataSource.data = [...this.team.users]
    console.log('team', this.team)
    this.displayedUsers.push(user.name)
  }

  updateTeam() {
    const body = {
      name: this.name,
    }

    this.team.name = this.name

    this.team.users.forEach((user: any) => {
      this.teamsService.createUserTeamLink(this.team.team_id, user.user_id).subscribe((data: any) => {
      });
    })
    this.teamsUpdateSubscription = this.teamsService.createTeam(body).subscribe((data: any) => {
      this.team = data
      this.team.users = []
      this.close();
      // location.reload();
    });
  }
}
