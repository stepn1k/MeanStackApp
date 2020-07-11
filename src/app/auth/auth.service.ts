import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private tokenTimer;
  authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe((res) => console.log(res));

  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe((res) => {
        this.token = res.token;
        if (res.token) {
          const expiresInDuration = res.expiresIn;
          // auto logout after expired token
          this.setAuthTimer(expiresInDuration);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration);
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn);
    }
  }

  logout() {
    this.authStatusListener.next(false);
    this.token = null;
    this.router.navigate(['/auth']);
    clearTimeout(this.tokenTimer);
    this.clearStorage();
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
