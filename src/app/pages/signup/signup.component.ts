import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  name = '';
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  signup() {

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .signup(this.name, this.email, this.password)
      .subscribe({
        next: () => {
          alert('Account created successfully!');
          this.router.navigate(['/login']);
        },

        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || 'Signup failed. Please try again.';
        }
      });
  }
}