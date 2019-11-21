import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';


const BASE_API_URL = 'http://ec2-54-210-210-173.compute-1.amazonaws.com/v1';


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
					Authorization: `Bearer ${currentUser.token}`
				}
			});
		}

		return next.handle(request);
	}
}
