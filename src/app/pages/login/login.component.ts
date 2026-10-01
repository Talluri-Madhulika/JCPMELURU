import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (response: any) => {

          this.authService.saveLoginData(response);

          this.loading = false;

          alert('Login successful!');

          if (response.user?.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message ||
            'Invalid email or password.';
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email to reset password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        alert('Password reset link has been sent to your email.');
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error sending password reset link.';
      }
    });
  }
}