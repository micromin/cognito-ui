import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm;
  submitting: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private storageService : StorageService,
    private formBuilder: FormBuilder, public router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [true, Validators.pattern('true')]
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      this.submitting = true;
      const email = formData.email;
      this.authService.signup(formData.name, email, formData.password, formData.terms).subscribe(
        (res: any) => {         
          const navigationExtras: NavigationExtras = {
            state: {
              email: email    
            }
          };          
          this.router.navigate(['confirm-user'], navigationExtras);
        },
        (err: any) => {
          this.error = (err.error && err.error.message) || 'Sorry, failed to signup. Please try again.';
        }).add(() => {
          this.submitting = false;
        });
    }
  }


}
