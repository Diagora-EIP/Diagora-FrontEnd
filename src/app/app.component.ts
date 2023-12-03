import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Diagora';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    // Subscribe to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check the current route
        this.showNavbar = !['/login', '/register', '/forgot-password'].includes(event.url);
      }
    });
  }
}