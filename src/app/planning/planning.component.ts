import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent {

  constructor(private route: Router) { }

  isNavbarOpen = false;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  change() {
    this.route.navigate(['commands']);
  }
  gohome() {
    this.route.navigate(['home']);
  }
}
