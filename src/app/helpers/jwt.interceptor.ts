import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

import { environment } from '../../environments/environment';


const BASE_API_URL = environment.apiUrl;


@Injectable()
export class JwtInterceptor implements HttpInterceptor {


	constructor(private authService: AuthService) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		request = request.clone({
			url: `${BASE_API_URL}${request.url}`
		});

		const currentUser = this.authService.getUserData;
		if (currentUser && currentUser.token) {
			request = request.clone({
				setHeaders: {
					Authorization: `token ${currentUser.token}`
				}
			});
		}

		return next.handle(request);
	}
}
