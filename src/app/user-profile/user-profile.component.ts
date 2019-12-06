import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	public userData: any;

	constructor(private authService: AuthService) { }

	ngOnInit() {
		this.userData = this.authService.getUserData;
		this.loadEventData();
	}

	loadEventData() {

	}

	editProfile() {

	}

}
