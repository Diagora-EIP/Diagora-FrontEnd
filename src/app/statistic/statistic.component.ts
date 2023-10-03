import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {
  logout1!: boolean;
  public chart: any;
  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.logout1 = false;
    this.createChart();
  }

  goto(params: string) {
    this.router.navigate([params]);
  }

  logout() {
    this.logout1 = true;
  }

  cancel() {
    this.logout1 = false;
  }

  confirm() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  createChart(){
  
    this.chart = new Chart("MyChart", {
      type: 'bar',

      data: {
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
									 '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

  statsAction(type:string = 'null', opt:string = 'null'): void {
    if (type === 'null') { return; }
    else if (type === 'AddStats') {
      this.dialog.open(AddStatsModalComponent);
    }
    else if (type === 'DeleteStats') {
      const data = { data: {type: '' }};
      if (opt === 'null') { return; }
      else if (opt === 'essences') { data.data['type'] = opt; }
      else if (opt === 'salaires') { data.data['type'] = opt; }
      else if (opt === 'materiels') { data.data['type'] = opt; }
      this.dialog.open(DeleteStatsModalComponent, data);
    }
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'add-statistic-modal.component',
  templateUrl: './add-statistic-modal.component.html',
  styleUrls: ['./add-statistic-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf, MatButtonModule, MatDialogModule],
})

export class AddStatsModalComponent {
  requiredValue = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();
}

export interface DialogData {
  type: string;
}

@Component({
  selector: 'delete-statistic-modal.component',
  templateUrl: './delete-statistic-modal.component.html',
  styleUrls: ['./delete-statistic-modal.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
})

export class DeleteStatsModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  factures = new FormControl('');

  factureList: string[] = [`${this.data['type']}_01`, `${this.data['type']}_02`, `${this.data['type']}_03`, `${this.data['type']}_04`, `${this.data['type']}_05`,];
}
