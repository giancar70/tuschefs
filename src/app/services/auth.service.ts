import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http'

import * as SocialLogin from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';


class FacebookLoginData {
	email: string;
	facebook_id: string;
	first_name: string;
	last_name: string;
}

class GoogleLoginData {
	email: string;
	google_id: string;
	first_name: string;
	last_name: string;
}

class User {
	date_birthday: string;
	email: string;
	password: string;
	first_name: string;
	token: string;
}

interface MyData {
	success: boolean,
	message: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

	private isAuthenticated = false;
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;
	public socialUser: SocialLogin.SocialUser;

	constructor(private http: HttpClient, private socialAuthService: SocialLogin.AuthService) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
		this.socialAuthService.authState.subscribe((user) => {
		  this.socialUser = user;
		  this.isAuthenticated = (user != null);
		});
	}

	setLoggedIn(value: boolean) {
		this.isAuthenticated = value
	}

	public get isUserAuthenticated(): boolean {
		return this.isAuthenticated;
	}

	public get currentUserValue(): any {
		if (this.currentUserSubject.value != null) {
			return this.currentUserSubject.value;
		} else {
			return this.socialUser;
		}
	}

	login(email, password) {
		return this.http.post<any>('https://chefs-test.herokuapp.com/v1/account/signin', { email, password })
			.pipe(map(user => {
				if (user && user.token) {
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
					this.setLoggedIn(true);
				}

				return user;
			}))
	}

	register(user: User) {
		return this.http.post<any>(`https://chefs-test.herokuapp.com/v1/account/signup/`, user)
			.pipe(map(usr => {
				if (usr && usr.token) {
					localStorage.setItem('currentUser', JSON.stringify(usr));
					this.currentUserSubject.next(usr);
					this.setLoggedIn(true);
				}

				return usr;
			}))
	}

	logout() {
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	loginFacebook(data: any) {
		this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
		return this.authLogin('facebook', data);
	}

	loginGoogle(data: any) {
		this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
		return this.authLogin('google', data);
	}

	authLogin(provider: string, data: any) {
		switch (provider) {
			case 'facebook':
				return this.http.post<any>('https://chefs-test.herokuapp.com/v1/account/signin', data)
					.pipe(map(user => {
						if (user && user.token) {
							localStorage.setItem('currentUser', JSON.stringify(user));
							this.currentUserSubject.next(user);
							this.setLoggedIn(true);
						}

						return user;
					}))
			case 'google':
				// TODO: implement
				break;
		}
	}


}
