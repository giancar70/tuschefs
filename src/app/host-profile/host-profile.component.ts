import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
	selector: 'app-host-profile',
	templateUrl: './host-profile.component.html',
	styleUrls: ['./host-profile.component.scss']
})
export class HostProfileComponent implements OnInit {

	public userId: any;
	public userData: any;
	public hostCreatedEvents: any;
	public isEditMode = false;

	constructor(private route: ActivatedRoute, private authService: AuthService,
				private http: HttpClient) { }

	ngOnInit() {
		// TODO: Proper errors for user
		this.route.params.subscribe(params => {
			this.userId = params['id'];
			this.authService.loadUserById(this.userId)
				.subscribe(response => {
					if (response.success) {
						this.userData = response.data;
					}
				});
			this.authService.loadUserCreatedEvents(this.userData.id)
				.subscribe(response => {
					if (response.success) {
						this.hostCreatedEvents = response.data;
					}
				});
		})
	}
}
