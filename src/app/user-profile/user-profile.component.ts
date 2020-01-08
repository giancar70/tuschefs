import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { NgbDatepickerConfig, NgbCalendar, NgbDate,
		 NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter
	   } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	public userData: any;
	public attendedEvents: any;
	public pastEvents: any;
	public upcomingEvents: any;
	public reviews: any;
	public isEditMode = false;

	profileForm: FormGroup;

	constructor(private authService: AuthService, private http: HttpClient,
				private formBuilder: FormBuilder) { }

	getDateNow() {
		const dt = new Date();
		const date = `${
			dt.getFullYear().toString().padStart(4, '0')}-${
			(dt.getMonth() + 1).toString().padStart(2, '0')}-${
			dt.getDate().toString().padStart(2, '0')}T${
			dt.getHours().toString().padStart(2, '0')}:${
			dt.getMinutes().toString().padStart(2, '0')}:${
			dt.getSeconds().toString().padStart(2, '0')}Z`
		;
		return date;
	}

	ngOnInit() {
		this.userData = this.authService.getUserData;

		this.authService.loadAttendedEvents(this.userData.id)
			.subscribe(response => {
				if (response.success) {
					this.attendedEvents = response.data;
					this.attendedEvents = this.attendedEvents.sort((a, b) => {
						// NOTE: Sorting by datetime. Maybe this isn't necessary.
						return Date.parse(a.date_event) - Date.parse(b.date_event);
					});

					this.attendedEvents = this.attendedEvents.map(tmp => {
						const event = tmp.event;
						return { image: event.photos.length > 0 ? event.photos[0].image : 'https://via.placeholder.com/300x180',
							title: event.title, description: event.description, host: event.chef.user.first_name, host_picture: event.chef.user.photo,
							date_event: tmp.date_event, price: event.price, id: event.id, user_id: event.chef.user.id };
					})

					const dateNow = this.getDateNow();

					this.pastEvents = this.attendedEvents.filter(a => {
						return a.date_event < dateNow
					})
					this.upcomingEvents = this.attendedEvents.filter(a => {
						return a.date_event >= dateNow
					})

				}
			});

			this.authService.loadUserReviews(this.userData.id)
			.subscribe(response => {
				if (response.success) {
					this.reviews = response.data;
				}
			});

			this.profileForm = this.formBuilder.group({
				name: [this.userData.first_name, Validators.required],
				last_name: [this.userData.last_name, Validators.required],
				address: [this.userData.address, Validators.required],
				email: this.userData.email,
				phone: [this.userData.phone, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9)]],
				description: [this.userData.description, Validators.required],
				sex: this.userData.sex,
				location: this.userData.location,
				work: this.userData.work,
				date_birthday: [this.userData.birthday, Validators.required],
				dni: [this.userData.dni, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(8)]],
			});

	}

	onSubmitProfileForm() {
		const data = this.profileForm.value;
		this.http.put<any>('/user', data)
		.subscribe(response => {
			if (response.success) {
				console.log('saved');
				this.isEditMode = false;
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
