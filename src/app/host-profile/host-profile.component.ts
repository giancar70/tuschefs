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

			this.authService.loadUserCreatedEvents(this.userId)
				.subscribe(response => {
					if (response.success) {
						this.hostCreatedEvents = response.data;
						this.hostCreatedEvents = this.hostCreatedEvents.sort((a, b) => {
							// NOTE: Sorting by datetime. Maybe this isn't necessary.
							const datetime1 = b.date_init + ' ' + b.time_start
							const datetime2 = a.date_init + ' ' + a.time_start
							return Date.parse(datetime1) - Date.parse(datetime2);
						});

						this.hostCreatedEvents = this.hostCreatedEvents.map(event => {
							return { image: event.photos.length > 0 ? event.photos[0].image : 'https://via.placeholder.com/300x180',
								title: event.title, description: event.description, host: event.chef.user.first_name, host_picture: event.chef.user.photo,
								price: event.price, id: event.id, user_id: event.chef.user.id };
						})
					}
				});
		})
	}
}
