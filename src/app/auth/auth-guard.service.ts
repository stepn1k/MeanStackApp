import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate(): boolean {
    if (!this.authService.authStatusListener.getValue()) {
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
