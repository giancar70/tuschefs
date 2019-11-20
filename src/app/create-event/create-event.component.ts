import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { AuthService } from '../services/auth.service'

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
	public userData: UserData;

	@ViewChild('search', {static: false})
	public searchElementRef: ElementRef;

	constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private authService: AuthService) {
		this.showMap = true;
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
	}

	ngOnInit() {
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

	locationChange(value) {
		this.showMap = (value === 'En mi casa')
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
