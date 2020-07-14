import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm;
  submitting: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private storageService : StorageService,
    private formBuilder: FormBuilder, public router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: false
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.submitting = true;
      this.authService.login(formData.email, formData.password, formData.rememberMe).subscribe(
        (res: any) => {         
          const data = res.data; 
          this.storageService.set('user', data.idToken.payload);
          this.storageService.set('id-token', data.idToken.token);
          alert('logged in successfully.');
          this.router.navigate(['dashboard']);
        },
        (err: any) => {
          this.error = (err.error && err.error.message) || 'Sorry, failed to login. Please try again.';
        }).add(() => {
          this.submitting = false;
        });
    }
  }
}
