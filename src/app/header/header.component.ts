import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authStatusSub: Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.authStatusListener.subscribe(
      (isAuthenticated) => this.isAuthenticated = isAuthenticated
    );
  }

    ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
