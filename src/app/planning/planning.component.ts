import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})

export class PlanningComponent {

  logout1!: boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.logout1 = false;
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
}
