import { Component, Type } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { UpdateTeamsModalComponent } from '../update-teams-modal/update-teams-modal.component';
import { CreateTeamsModalComponent } from '../create-teams-modal/create-teams-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ManagerService } from '../../services/manager.service';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-manager-teams',
  templateUrl: './manager-teams.component.html',
  styleUrls: ['./manager-teams.component.scss']
})

export class ManagerTeamsComponent {
  modalComponentMapping: { [key: string]: { component: Type<any>; constructor: () => any, action: (instance: any) => void } } = {
    UPDATETEAM: {
      component: UpdateTeamsModalComponent,
      constructor: () => {
        return {
          teams: this.selectedTeam,
          entrepriseUsers: this.entrepriseUsers
        }
      },
      action: (instance: any) => this.callUpdateTeam(instance)
    },
    CREATETEAM: {
      component: CreateTeamsModalComponent,
      constructor: () => {
        return {
          entrepriseUsers: this.entrepriseUsers
        }
      },
      action: () => this.openCreateTeamModal()
    }
  };
  entreprise: string = "";
  loading: boolean = false;
  teamsList : any = [];
  teamList : any = [];
  displayedColumns = ['Nom de la team', 'settings'];
  selectedTeam: any = null;
  entrepriseUsers: any = [];

  constructor(private teamsService: TeamsService,
    public dialog: MatDialog,
    private managerService: ManagerService,
    private snackBarService: SnackbarService
  ) {
    this.loading = true;
    this.entreprise = localStorage.getItem('entreprise') || '';
    this.getTeamUsers();
    this.getUserEntreprise();
    this.getTeamsList();
  }

  getTeamsList() {
    this.teamsService.getTeamsList().subscribe((data: any) => {
      this.teamsList = data;
      this.teamList = data;
      this.loading = false;
      console.log('Teams list', this.teamsList);
    });
  }

  getUserEntreprise() {
    this.managerService.getManagerEntreprise().subscribe((data: any) => {
      console.log('User entreprise', data);
      this.entrepriseUsers = data.users;
      if (this.entreprise == '') {
        this.entreprise = data.name
      }
      });
  }
  getTeamUsers() {
    this.teamsList.forEach((team: any) => {
      this.teamsService.getTeamUsers(team.team_id).subscribe((data: any) => {
        team.users = data;
        console.log('Team users', team.users);
      });
    });
  }

  openModal(modalType: string): void {
    const { component, constructor, action } = this.modalComponentMapping[modalType.toUpperCase()];

    if (!component) {
        throw new Error(`Type de modal non pris en charge : ${modalType}`);
    }

    const dialogRef = this.dialog.open(component, {
        panelClass: 'custom',
        data: constructor()
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        // Si on est dans le contexte d'update, on supprime d'abord l'ancienne entrée
        if (modalType.toUpperCase() === 'UPDATETEAM') {
          this.teamList = this.teamList.filter((team: { team_id: any; }) => team.team_id !== this.selectedTeam.team_id);
          console.log(this.teamList)
        }

        // Ajouter les données mises à jour ou créées
        this.teamList.push(data);

        // Mettre à jour la source de données
        this.teamsList = new MatTableDataSource(this.teamList);

        console.log(this.teamList);
        return
      }
      if (!data)
        return
      action(data);
    });
}

  callUpdateTeam(teamSelected: any) {
      // console.log('Update team', teamSelected);
      this.selectedTeam = teamSelected;
      // // this.teamsList = this.teamsList.filter((team: { team_id: any; }) => team.team_id !== teamSelected.team_id);
      // this.teamList = this.teamList.filter((team: { team_id: any; }) => team.team_id !== teamSelected.team_id);
      // // Mettre à jour `teamsList` avec la liste filtrée
      // this.teamsList = new MatTableDataSource(this.teamList);
      this.openModal('UPDATETEAM');
  }

  openCreateTeamModal() {
    this.openModal('CREATETEAM');
  }

  callDeleteTeam(teamSelected: any) {
    console.log("delete", teamSelected)
    this.teamList = this.teamList.filter((team: { team_id: any; }) => team.team_id !== teamSelected.team_id);
    this.teamsList = new MatTableDataSource(this.teamList);
    this.teamsService.deleteTeam(teamSelected.team_id).subscribe((data: any) => {
      this.snackBarService.successSnackBar('Team supprimée avec succès');
    });
  }
}
