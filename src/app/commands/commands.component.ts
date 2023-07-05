import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent {

  constructor(private route: Router) { }

  isNavbarOpen = false;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  change() {
    this.route.navigate(['planning']);
  }

  gohome() {
    this.route.navigate(['home']);
  }
}
