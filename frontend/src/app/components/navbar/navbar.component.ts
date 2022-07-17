import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.userService.isLoggedIn()
  }

  name() {
    return this.userService.name;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(["login"])
  }
}
