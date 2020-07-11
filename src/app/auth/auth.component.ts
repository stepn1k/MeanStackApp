import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLogin = true;
  isLoading = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  switchMode() {
    this.isLogin = !this.isLogin;
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const {email, password} = form.value;

    this.isLoading = true;
    // signUP
    if (!this.isLogin) {
      this.authService.createUser(email, password).subscribe(() => {
        this.isLoading = false;
        this.isLogin = true;
      });
    } else {
      // login
      this.authService.login(email, password);
    }

  }
}
