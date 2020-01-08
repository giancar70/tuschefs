import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbDatepickerConfig, NgbCalendar, NgbDate,
		 NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter
	   } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
export class CreateEventComponent implements OnInit, AfterViewInit {
	latitude: number;
	longitude: number;
	zoom: number;
	address: string;
	public showMap: boolean;
	private geoCoder;

	public cuisineTypes: any;
	public menuTypes: any;
	public eventTypes = [
		{ id: 0, name: 'Cena'},
		{ id: 1, name: 'Almuerzo'},
		{ id: 2, name: 'Desayuno'},
	];
	userData: any;
	eventId: number;

	menu: FormArray;
	dishes: FormArray;

	profileForm: FormGroup;
	profileImageForm: FormGroup;
	eventDescriptionForm: FormGroup;
	picturesForm: FormGroup;
	timeAndLocationForm: FormGroup;

	showMessage = false;
	hideProfileTab = false;

	@ViewChild('modal-content', {static: false})
	public content;

	@ViewChild('search', {static: false})
	public searchElementRef: ElementRef;

	@ViewChild('mytabset', {static: false})
	public tabset;

	@ViewChild('imageUpload', {static: false})
	public imageUpload;

	@ViewChild('eventImage1', {static: false})
	public eventImage1;
	@ViewChild('eventImage2', {static: false})
	public eventImage2;
	@ViewChild('eventImage3', {static: false})
	public eventImage3;
	@ViewChild('eventImage4', {static: false})
	public eventImage4;

	@ViewChild('eventImageUpload', {static: false})
	public eventImageUpload;

	@ViewChild('emailField', {static: false})
	public emailField: ElementRef;

	closeResult: string;

	constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
				private authService: AuthService, private http: HttpClient,
				private formBuilder: FormBuilder, private router: Router,
				config: NgbDatepickerConfig, calendar: NgbCalendar,
				private modalService: NgbModal) {

		config.minDate = calendar.getToday();
		config.maxDate = { year: 2030, month: 12, day: 31 };

		this.showMap = true;
	}

	ngOnInit() {
		this.getFoodTypes();
		this.getMenuTypes();
		// this.loadMapApi();
		this.userData = this.authService.getUserData;
		this.hideProfileTab = this.userData.is_complete;

		this.profileForm = this.formBuilder.group({
			name: [this.userData.first_name, Validators.required],
			last_name: [this.userData.last_name, Validators.required],
			// email: ['', Validators.required],
			number_account_bank: ['', Validators.required],
			cci_number: ['', Validators.required],
			sex: ['', Validators.required],
			phone: [this.userData.phone, [Validators.required, Validators.minLength(9)]],
			description: ['', Validators.required]
		});

		this.profileImageForm = this.formBuilder.group({
			img: ''
		});

		this.eventDescriptionForm = this.formBuilder.group({
			type_event: ['', Validators.required],
			type_food: ['', Validators.required],
			min_people: [1, Validators.required],
			max_people: [2, Validators.required],
			title: ['', Validators.required],
			description: ['', Validators.required],
			menu: this.formBuilder.array([this.createMenuDish()]),
			price: ['', Validators.required]
		});

		this.picturesForm = this.formBuilder.group({
			pictures: this.formBuilder.array([])
		});

		this.timeAndLocationForm = this.formBuilder.group({
			time_start: '',
			time_end: '',
			date_init: '',
			date_end: '',
			sunday: false,
			monday: false,
			tuesday: false,
			wednesday: false,
			thursday: false,
			friday: false,
			saturday: false,
		});
	}

	ngAfterViewInit() {
		if (this.emailField !== undefined) {
			this.emailField.nativeElement.value = this.userData.email;
		}

		// NOTE: Skip first tab if the user filled it out previously.
		if (this.hideProfileTab) {
			this.tabset.select('description');
		}

	}

	private createMenuDish(): FormGroup {
		return this.formBuilder.group({
			type_menu: '',
			name: ''
		});
	}

	addMenuDish() {
		this.menu = this.eventDescriptionForm.get('menu') as FormArray;
		this.menu.push(this.createMenuDish());
	}

	// TODO: Move to service
	getFoodTypes() {
		this.http.get<any>('/type_food')
			.subscribe(response => {
				if (response.success) {
					this.cuisineTypes = response.data;
				}
			});
	}

	getMenuTypes() {
		this.http.get<any>('/type_menu')
			.subscribe(response => {
				if (response.success) {
					this.menuTypes = response.data;
				}
			});
	}

	back(tab: string) {
		this.tabset.select(tab);
	}

	getMaxPeopleArray() {
		const min = parseInt(this.eventDescriptionForm.get('min_people').value, 10);
		const x = Array(16 - min + 1).fill(0).map((_, idx) => min + idx);
		return x;
	}

	// Submits
	onSubmitProfileForm() {
		const data = this.profileForm.value;
		this.imageUpload.handleSubmit('/user');

		this.http.put<any>('/user', data)
			.subscribe(response => {
				if (response.success) {
					this.tabset.select('description');
				} else {
					console.log('Something went wrong');
				}
			});
	}

	onSubmitEventDescriptionForm() {
		const data = this.eventDescriptionForm.value;
		this.http.post<any>('/event', data)
			.subscribe(response => {
				if (response.success) {
					this.eventId = response.data.id;
					this.tabset.select('pictures');
				} else {
					console.log('Something went wrong');
				}
			})
	}

	onSubmitPicturesForm() {
		this.eventImage1.handleSubmit(`/event/${this.eventId}`);
		this.eventImage2.handleSubmit(`/event/${this.eventId}`);
		this.eventImage3.handleSubmit(`/event/${this.eventId}`);
		this.eventImage4.handleSubmit(`/event/${this.eventId}`);
		this.eventImageUpload.handleSubmit(`/event/${this.eventId}`);
		this.tabset.select('location')
	}

	onSubmitTimeAndLocationForm() {
		const data = this.timeAndLocationForm.value;
		data.time_start = Object.keys(data.time_start).map(e => data.time_start[e]).join(':')
		data.time_end = Object.keys(data.time_end).map(e => data.time_end[e]).join(':')
		data.date_init = Object.keys(data.date_init).map(e => data.date_init[e]).join('-')
		data.date_end = Object.keys(data.date_end).map(e => data.date_end[e]).join('-')

		this.http.put<any>(`/event/${this.eventId}`, { schedule: [data] })
			.subscribe(response => {
				if (response.success) {
					// this.router.navigate(['/event', this.eventId]);
					this.showMessage = true;
					this.open();
				} else {
					console.log('Something went wrong');
				}
			})
	}

	// Geolocation/Maps
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
					const place: google.maps.places.PlaceResult = autocomplete.getPlace();

					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

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
					console.log('No results found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}

		});
	}

	open() {
		this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	closeModal() {
		this.modalService.dismissAll();
		this.router.navigate([''])
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

}
