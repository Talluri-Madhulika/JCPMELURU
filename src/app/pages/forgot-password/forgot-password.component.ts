import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  sendResetLink() {
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
