import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm;
  submitting: boolean = false;
  error: string = '';


  constructor(private authService: AuthService, private storageService: StorageService,
    private formBuilder: FormBuilder, public router: Router) {
  }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    if (this.resetForm.valid) {
      const formData = this.resetForm.value;
      this.submitting = true;
      this.authService.resetPassword(formData.email, formData.newPassword, formData.verificationCode).subscribe(
        (res: any) => {
          alert(res.message || 'password is reset successfully. pleas login.');
          this.router.navigate(['login']);
        },
        (err: any) => {
          this.error = (err.error && err.error.message) || 'Sorry, failed to reset password. Please try again.';
        }).add(() => {
          this.submitting = false;
        });
    }
  }
}
