import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import jwt from 'jsonwebtoken';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  goto(params: string) {
    this.router.navigate([params]);
  }
}
