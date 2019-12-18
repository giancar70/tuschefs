import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
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

// Data returned after login / register
class User {
	address: string
	email: string
	fb_id: string
	first_name: string
	full_name: string
	is_verify: string
	last_name: string
	phone: string
	photo: string
	token: string
}

interface MyData {
	success: boolean,
	message: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

	private isAuthenticated;
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;
	public socialUser: SocialLogin.SocialUser;

	constructor(private http: HttpClient, private socialAuthService: SocialLogin.AuthService, private router: Router) {
		this.isAuthenticated = false;
		const u = JSON.parse(localStorage.getItem('currentUser'));
		this.currentUserSubject = new BehaviorSubject<User>(u);
		this.currentUser = this.currentUserSubject.asObservable();

		this.socialAuthService.authState.subscribe(user => {
			this.socialUser = user;
			this.setLoggedIn(user != null || u != null);
		});

		this.currentUser.subscribe(user => {
			this.setLoggedIn(user !== null);
		})

	}

	setLoggedIn(value: boolean) {
		this.isAuthenticated = value
	}

	public get isUserAuthenticated(): boolean {
		return this.isAuthenticated;
	}

	public get getUserData(): any {
		if (this.currentUserSubject.value != null) {
			return this.currentUserSubject.value;
		} else {
			return this.socialUser;
		}
	}

	login(email, password) {
		return this.http.post<any>('/account/signin/', { email, password })
			.pipe(map(response => {
				const { success, data } = response
				if (success && data.token) {
					localStorage.setItem('currentUser', JSON.stringify(data));
					this.currentUserSubject.next(data);
					this.setLoggedIn(true);
				}

				return response;
			}));
	}

	register(user: User) {
		return this.http.post<any>(`/account/signup/`, user)
			.pipe(map(response => {
				const { success, data } = response
				if (success && data.token) {
					localStorage.setItem('currentUser', JSON.stringify(data));
					this.currentUserSubject.next(data);
					this.setLoggedIn(true);
				}

				return response;
			}));
	}

	public loadUserCreatedEvents(user_id: any) {
		return this.http.get<any>(`/user/${user_id}/events/`)
			.pipe(map(response => {
				const { success, data } = response
				return response;
			}));
	}

	public loadAttendedEvents(user_id: any) {
		return this.http.get<any>(`/user/${user_id}/events/attended/`)
			.pipe(map(response => {
				const { success, data } = response
				return response;
			}));
	}

	public loadUserReviews(user_id: any) {
		return this.http.get<any>(`/user/${user_id}/reviews/`)
			.pipe(map(response => {
				const { success, data } = response
				return response;
			}));
	}

	public loadUserById(user_id: any) {
		return this.http.get<any>(`/user/${user_id}/info/`)
			.pipe(map(response => {
				const { success, data } = response
				return response;
			}));
	}

	logout() {
		this.setLoggedIn(false);
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
		this.router.navigate([''])
	}

	loginFacebook(data: any) {
		this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
		const id = this.socialUser.id
		return this.authLogin('facebook', data);
	}

	authLogin(provider: string, userData: any) {
		switch (provider) {
			case 'facebook':
				return this.http.post<any>('/account/signin/', userData)
					.pipe(map(response => {
						const { success, data } = response
						if (success && data.token) {
							localStorage.setItem('currentUser', JSON.stringify(data));
							this.currentUserSubject.next(data);
							this.setLoggedIn(true);
						}

						return response;
					}))
		}
	}


}
