import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.scss']
})
export class EventDescriptionComponent implements OnInit {
	private loading: boolean;
	private eventId: number;
	private eventData: any;

	constructor(private route: ActivatedRoute, private http: HttpClient,
				private router: Router) { }

	ngOnInit() {
		this.loading = true;
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
