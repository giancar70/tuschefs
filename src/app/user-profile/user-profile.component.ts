import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	public userData: any;
	public userEvents: any;
	public attendedEvents: any;
	public isEditMode = false;

	profileForm: FormGroup;

	constructor(private authService: AuthService, private http: HttpClient,
				private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.userData = this.authService.getUserData;
		this.userEvents = this.authService.loadUserEvents(this.userData.id);
		this.attendedEvents = this.authService.loadAttendedEvents(this.userData.id);
		console.log(this.userEvents);
		console.log(this.attendedEvents);

		this.profileForm = this.formBuilder.group({
			name: [this.userData.first_name, Validators.required],
			last_name: [this.userData.last_name, Validators.required],
			address: [this.userData.address, Validators.required],
			email: [this.userData.email, Validators.required],
			phone: [this.userData.phone, [Validators.required, Validators.minLength(9)]],
			description: [this.userData.description, Validators.required],
			sex: [this.userData.sex, Validators.required],
			location: [this.userData.location, Validators.required],
			work: [this.userData.work, Validators.required],
		});

	}

	onSubmitProfileForm() {
		const data = this.profileForm.value;
		this.http.put<any>('/user', data)
			.subscribe(response => {
				if (response.success) {
					console.log('saved');
				} else {
					console.log('Something went wrong');
				}
			});
	}

	public editProfile() {
		this.isEditMode = true;
	}
	public cancelEditProfile() {
		this.isEditMode = false;
	}

}
