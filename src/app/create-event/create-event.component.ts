import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { AuthService } from '../services/auth.service'
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http'

class UserData {
	first_name: string
	last_name: string
	email: string
	gender: string
	phone: string
};

@Component({
	selector: 'app-create-event',
	templateUrl: './create-event.component.html',
	styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
	latitude: number;
	longitude: number;
	zoom: number;
	address: string;
	public showMap: boolean;
	private geoCoder;
	// public userData: UserData;
	public foodTypes: any;

	profileForm: FormGroup;
	eventDescriptionForm: FormGroup;
	picturesForm: FormGroup;
	timeAndLocationForm: FormGroup;

	@ViewChild('search', {static: false})
	public searchElementRef: ElementRef;

	constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
				private authService: AuthService, private http: HttpClient,
				private formBuilder: FormBuilder) {

		this.showMap = true;
		/*
		this.userData = new UserData();

		const user = this.authService.currentUserValue;
		if (user !== null && user !== undefined) {
			this.userData.email = user.email;
			this.userData.first_name = user.first_name;
			this.userData.last_name = user.last_name;
			this.userData.phone = user.phone;
			this.userData.gender = user.gender;
		} else {
			this.userData.email = ''
			this.userData.first_name = '';
			this.userData.last_name = '';
			this.userData.phone = '';
			this.userData.gender = '';
		}
		*/
	}

	ngOnInit() {
		this.getFoodTypes();
		this.loadMapApi();

		this.profileForm = this.formBuilder.group({
			profile_picture: [''],
			first_name: ['', Validators.required],
			last_name: ['', Validators.required],
			email: ['', Validators.required],
			gender: ['', Validators.required],
			phone: ['', [Validators.required, Validators.minLength(9)]],
			description: ['', Validators.required]
		});

		this.eventDescriptionForm = this.formBuilder.group({
			food_type: ['', Validators.required],
			cuisine_type: ['', Validators.required],
			min_guests: ['', Validators.required],
			max_guests: ['', Validators.required],
			event_title: ['', Validators.required],
			about_host: ['', Validators.required],
			menu: [[], Validators.required],
			price_per_person: ['', Validators.required]
		});

		// TODO: Check
		this.picturesForm = this.formBuilder.group({
			pictures: [[], Validators.required]
		});

		// TODO: Set model according to 'frequency' or specific dates
		this.timeAndLocationForm = this.formBuilder.group({
			start_time: ['', Validators.required],
			end_time: ['', Validators.required],
			where: ['', Validators.required],
			address: ['']
		});

	}

	getFoodTypes() {
		this.http.get<any>('https://chefs-test.herokuapp.com/v1/type_food')
			.subscribe(result => {
				if (result.success === true) {
					this.foodTypes = result.data;
				}
			});
	}

	addDishToMenu() {

	}

	locationChange(value) {
		this.showMap = (value === 'En mi casa')
	}

	loadMapApi() {
		this.mapsAPILoader.load().then(() => {
			this.setCurrentLocation();
			this.geoCoder = new google.maps.Geocoder;

			const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ['address']
			});
			autocomplete.addListener('place_changed', () => {
				this.ngZone.run(() => {
					// get the place result
					const place: google.maps.places.PlaceResult = autocomplete.getPlace();

					// verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					// set latitude, longitude and zoom
					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.zoom = 12;
				});
			});
		});
	}

	private setCurrentLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this.zoom = 8;
				this.getAddress(this.latitude, this.longitude);
			});
		}
	}

	markerDragEnd($event: MouseEvent) {
		console.log($event);
		this.latitude = $event.coords.lat;
		this.longitude = $event.coords.lng;
		this.getAddress(this.latitude, this.longitude);
	}

	getAddress(latitude, longitude) {
		this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
			console.log(results);
			console.log(status);
			if (status === 'OK') {
				if (results[0]) {
					this.zoom = 12;
					this.address = results[0].formatted_address;
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}

		});
	}

}
