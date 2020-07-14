import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-user',
  templateUrl: './confirm-user.component.html',
  styleUrls: ['./confirm-user.component.css']
})
export class ConfirmUserComponent implements OnInit {
  verifyForm;
  submitting: boolean = false;
  error: string = '';

  state: any;
  email;
  verificationCode;

  constructor(private authService: AuthService, private storageService: StorageService,
    private formBuilder: FormBuilder, public router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      this.email = navigation.extras.state.email;
    }
  }

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      verificationCode: ['', Validators.required]
    });
  }

  get f() { return this.verifyForm.controls; }

  onSubmit() {
    if (this.verifyForm.valid) {
      const formData = this.verifyForm.value;
      this.submitting = true;
      this.authService.confirmUser(formData.email, formData.verificationCode).subscribe(
        (res: any) => {
          alert('account verified successfully. pleas login.');
          this.router.navigate(['login']);
        },
        (err: any) => {
          this.error = (err.error && err.error.message) || 'Sorry, failed to verify account. Please try again.';
        }).add(() => {
          this.submitting = false;
        });
    }
  }

  resendVerificationCode() {
    if (!this.verifyForm.controls['email'].valid) {
      this.error = 'Please enter a valid email.'
    }
    const formData = this.verifyForm.value;
    this.authService.resendVerificationCode(formData.email).subscribe(
      (res: any) => {
        alert(res.message || 'verification code sent.. please check your email.');
        this.error = '';
      },
      (err: any) => {
        this.error = (err.error && err.error.message) || 'Sorry, failed to send verification code. Please try again.';
      }).add(() => {
        this.submitting = false;
      });

  }

}
