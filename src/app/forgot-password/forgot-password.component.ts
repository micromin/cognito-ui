import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm;
  submitting: boolean = false;
  error: string = '';


  constructor(private authService: AuthService, private storageService: StorageService,
    private formBuilder: FormBuilder, public router: Router) {
  }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotForm.controls; }

  onSubmit() {
    if (this.forgotForm.valid) {
      const formData = this.forgotForm.value;
      this.submitting = true;
      this.authService.forgotPassword(formData.email).subscribe(
        (res: any) => {
          alert('Reset password initiated. Please check your email for verification code..');
          this.router.navigate(['reset-password']);
        },
        (err: any) => {
          this.error = (err.error && err.error.message) || 'Sorry, failed to reset password. Please try again.';
        }).add(() => {
          this.submitting = false;
        });
    }
  }
}
