import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth';

  private userSubject = new BehaviorSubject<any>(
    this.getStoredUser()
  );

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/signup`, {
      name,
      email,
      password
    });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { 
      email, 
      redirectTo: window.location.origin + '/reset-password' 
    });
  }

  resetPassword(password: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { password });
  }

  saveLoginData(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    this.userSubject.next(response.user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    return this.userSubject.value;
  }

  private getStoredUser(): any {
    const user = localStorage.getItem('user');

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
}