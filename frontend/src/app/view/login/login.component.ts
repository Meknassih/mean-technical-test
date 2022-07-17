import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  name = "";
  password = "";

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.userService.login(this.name, this.password).subscribe({
      next: () => {
        this.router.navigate(["/"])
      },
      error: error => {
        console.warn(error)
        this.snackBar.open(error.error.error, "Close", { duration: 3000 })
      }
    });
  }
}
