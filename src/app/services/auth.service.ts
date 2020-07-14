import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  baseURL: string = environment.apiUrl;
  public isLoggedIn = new Subject();;

  constructor(private http: HttpClient, private storageService: StorageService, private router: Router) { }

  signup(name: any, email: any, password: any, terms: any) {
    return this.http.post(this.baseURL + 'signup', {
      name,
      email,
      password,
      terms
    });
  }

  login(email: any, password: any, rememberMe: any) {
    return this.http.post(this.baseURL + 'login', {
      email,
      password,
      rememberMe
    });
  }

  confirmUser(email: any, verificationCode: any) {
    return this.http.post(this.baseURL + 'confirmUser', {
      email,
      verificationCode
    });
  }

  resendVerificationCode(email: any) {
    return this.http.post(this.baseURL + 'resendVerificationCode', {
      email
    });
  }

  forgotPassword(email: any) {
    return this.http.post(this.baseURL + 'forgotPassword', {
      email
    });
  }
  resetPassword(email: any, newPassword: any, verificationCode: any) {
    return this.http.post(this.baseURL + 'resetPassword', {
      email,
      newPassword,
      verificationCode
    });
  }  

  isAuthenticated() {
    const user = this.storageService.get('user');
    if (user && user.sub) {
      this.isLoggedIn.next(true);
      return true;
    }
    this.isLoggedIn.next(false);
    return false;
  }

  logout() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.storageService.get('id-token') || ''
    });

    const user = this.storageService.get('user');
    let email = '';
    if (user) {
      email = user.email;
    }
    return this.http.post(this.baseURL + 'logout', {
      email
    }, { headers: headers }).subscribe((re: any) => {
      data => {
        this.cleanupAfterLogout();
      }
    }).add(() => {
      this.cleanupAfterLogout();
    });

  }

  private cleanupAfterLogout() {
    this.storageService.set('user', '');
    this.storageService.set('id-token', '');
    this.isLoggedIn.next(false);
    this.router.navigate(['login']);
  }
}
