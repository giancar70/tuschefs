import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


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

	private reservationDate: any;
	private numGuests: number;

	constructor(private route: ActivatedRoute, private http: HttpClient,
				private router: Router) { }

	ngOnInit() {
		this.loading = true;
		this.activeIds = ['panel-1', 'panel-2', 'panel-3'];
		this.route.params.subscribe(params => {
			this.eventId = params['id'];
			this.loadEventData();
		})
	}

	loadEventData() {
		this.http.get<any>(`/event/${this.eventId}`)
			.subscribe(response => {
				if (response.success) {
					this.eventData = response.data;
					this.loading = false;
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
		const payload = { numGuests: this.numGuests, reservationDate: this.reservationDate, eventData: this.eventData };
		localStorage.setItem('tuschefs_cart', JSON.stringify(payload));
	}

	public getFoodTypes() {
		const foodIds = [1, 2, 3];
		const menu = this.eventData.menu;
		const dishes = menu.filter(dish => foodIds.includes(dish.type_menu))
		return dishes.map(d => d.name).join(', ');
	}

	public getBeverageTypes() {
		const menu = this.eventData.menu;
		const beverages = menu.filter(bev => bev.type_menu === 4)
		return beverages.map(b => b.name).join(', ');
	}
}
