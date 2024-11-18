import { Component, Inject } from '@angular/core';
import { Observable, Subscription, map, startWith } from 'rxjs';
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
  selector: 'app-update-teams-modal',
  templateUrl: './update-teams-modal.component.html',
  styleUrls: ['./update-teams-modal.component.scss']
})

export class UpdateTeamsModalComponent {
  myControl = new FormControl('');
  team: any = {}
  teamsUpdateSubscription: Subscription | undefined
  name: string = ''
  selectedColor: string;
  entrepriseUsers: any = [];
  displayedUsers: string[] = [];
  displayedColumns = ['Nom du livreur', 'email', 'settings'];
  filteredOptions: Observable<string[]>;
  dataSource: MatTableDataSource<User>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateTeamsModalComponent>,
    private managerService: ManagerService,
    private teamsService: TeamsService
  ) {
    this.team = JSON.parse(JSON.stringify(data.teams))
    this.name = this.team.name
    this.selectedColor = this.team.color
    console.log('team', this.team)
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
    if (this.team.users != null) {  
      this.team.users.forEach((user: any) => {
        this.displayedUsers = this.displayedUsers.filter((name: string) => name !== user.name)
      })
    }
  }
  close(): void {
    this.dialogRef.close(this.team);
    this.teamsUpdateSubscription?.unsubscribe();
    
  }

  addUser() {
    console.log(this.myControl.value)
    const selectedUser = this.entrepriseUsers.find((user: any) => user.name === this.myControl.value)
    console.log('selectedUser', selectedUser)
    if (selectedUser) {
      this.team.users.push(selectedUser);
      this.dataSource.data = [...this.team.users];  // Update the data source
      console.log('team', this.team);
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
      color: this.selectedColor,
    }

    // users: this.team.users
    //get two list, the new user betwenn this.team.users and data.teams.user ans the user to delete
    const newUser = this.team.users.filter((user: any) => !this.data.teams.users.includes(user))
    const userToDelete = this.data.teams.users.filter((user: any) => !this.team.users.includes(user))
    newUser.forEach((user: any) => {
      this.teamsService.createUserTeamLink(this.team.team_id, user.user_id).subscribe((data: any) => {
      });
    })
    userToDelete.forEach((user: any) => {
      this.teamsService.deleteUserTeamLink(this.team.team_id, user.user_id).subscribe((data: any) => {
      });
    })
    this.teamsUpdateSubscription = this.teamsService.updateTeam(this.team.team_id, body).subscribe((data: any) => {
      const users = this.team.users
      this.team = data
      this.team.users = users
      this.close();
      // location.reload();
    });
  }
}
