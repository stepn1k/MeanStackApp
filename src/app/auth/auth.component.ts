import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogin = true;
  isLoading = false;
  authStateSub: Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authStateSub = this.authService.authStatusListener.subscribe((authStatus) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
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
      this.authService.createUser(email, password);
    } else {
      // login
      this.authService.login(email, password);
    }
  }
}
