import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(private router: Router, 
              private securityService: SecurityService, 
              private utilsService: UtilsService, 
              private fb: FormBuilder,
              private snackBarService: SnackbarService) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { password, confirmPassword } = this.resetPasswordForm.value;

    if (password !== confirmPassword) {
      this.snackBarService.warningSnackBar('Les mots de passe ne correspondent pas');
      return;
    }


    const urlSegments = this.router.url.split('/');
    const resetPasswordIndex = urlSegments.indexOf('reset-password');
    const token = urlSegments[resetPasswordIndex + 1];
    console.log(token);
    this.securityService.resetPassword(token, password)
      .pipe(
        tap({
          next: data => {
            this.snackBarService.successSnackBar('Votre mot de passe a été réinitialisé avec succès');
            this.router.navigate(['/login']);
          },
          error: error => {
            console.log(error);
          }
        })
      ).subscribe();
  }

}
