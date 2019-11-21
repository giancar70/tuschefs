import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { CanActivate } from '@angular/router';
import { LoginModalInjectable } from '../login-modal/login-modal.component'

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public loginModal: LoginModalInjectable) { }

  canActivate(): boolean {
	  if (!this.authService.isUserAuthenticated) {
		this.loginModal.open();
		return false;
	  }
	  return true;
  }

}
