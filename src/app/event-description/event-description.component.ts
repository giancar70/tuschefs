import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ContactFormInjectable } from '../contact-form/contact-form.component'
import { NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';


@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.scss']
})
export class EventDescriptionComponent implements OnInit {
	private loading: boolean;
	private eventId: number;
	private eventData: any;
	private activeIds = [];
	private foodType: any;

	private reservationForm: FormGroup;
	private guestsRange = [];

	// NOTE: This allows to only show available days for this event on the calendar.
	private disabledDates: any;

	constructor(private route: ActivatedRoute, private http: HttpClient,
				private router: Router, public contactModal: ContactFormInjectable,
			   private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.loading = true;
		this.activeIds = ['panel-1', 'panel-2', 'panel-3'];
		this.route.params.subscribe(params => {
			this.eventId = params['id'];
			this.loadEventData();
		})

		this.reservationForm = this.formBuilder.group({
			reservation_date: ['', Validators.required],
			num_guests: ['', Validators.required],
			customer_address: ''
		})

	}

	openContactForm() {
		this.contactModal.open()
	}

	loadEventData() {
		this.http.get<any>(`/event/${this.eventId}`)
			.subscribe(response => {
				if (response.success) {
					this.translateFoodType();
					this.eventData = response.data;
					this.loading = false;
					for (let i = this.eventData.min_people; i <= this.eventData.max_people; i++) {
						this.guestsRange.push(i);
					}

				}
			}, err => {
				this.router.navigate(['/'])
			})
	}

	makeReservation() {
		this.saveCheckoutDataToStorage();
		this.router.navigate(['/checkout'])
	}

	saveCheckoutDataToStorage() {
		// TODO: add expiration to 'Cart'
		const data = this.reservationForm.value;
		const payload = {
			numGuests: data.num_guests, reservationDate: data.reservation_date,
			eventData: this.eventData, customerAddress: data.customer_address
		};
		localStorage.setItem('tuschefs_cart', JSON.stringify(payload));
	}

	public getFoodTypes() {
		const foodIds = [1, 2, 3];
		const menu = this.eventData.menu;
		const dishes = menu.filter(dish => foodIds.includes(dish.type_menu))
		return dishes.map(d => ({ name: d.name, menu: d.type_menu_name }));
	}

	public getBeverageTypes() {
		const menu = this.eventData.menu;
		const beverages = menu.filter(bev => bev.type_menu === 4)
		return beverages.map(b => b.name);
	}

	translateFoodType() {
		this.http.get<any>('/type_food')
			.subscribe(response => {
				if (response.success) {
					const cuisineTypes = response.data;
					this.foodType = cuisineTypes.find(i => this.eventData.food === i.id);
				}
			});
	}
}
