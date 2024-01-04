import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent  {
  emailForm: FormGroup;

  constructor(private router: Router, private securityService: SecurityService, private utilsService: UtilsService, private fb: FormBuilder,) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  forgotPassword() {
    if (this.emailForm.invalid) {
      return;
    }

    const { email } = this.emailForm.value;

    if (!this.utilsService.checkEmail(email)) {
      return;
    }

    this.securityService.forgotPassword(email)
      .pipe(
        tap({
          next: data => {
            alert('Un email vous a été envoyé, veuillez vérifier votre boîte mail');
          },
          error: error => {
            throwError(error);
          }
        })
      ).subscribe();
  }

}
