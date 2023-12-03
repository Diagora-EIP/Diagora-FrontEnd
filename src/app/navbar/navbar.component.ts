import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  admin: boolean = false;
  // Add the following properties and methods
  menuOpen: boolean = false;

  goto(route: string) {
    // Implement your navigation logic here
    console.log(`Navigating to ${route}`);
  }

  logout() {
    // Implement your logout logic here
    console.log('Logging out');
  }

  toggleMenu() {
    // Implement your menu toggle logic here
    this.menuOpen = !this.menuOpen;
  }

  constructor() { }

  ngOnInit(): void {
    // Add any initialization logic here
  }

  // ... rest of your code
}
