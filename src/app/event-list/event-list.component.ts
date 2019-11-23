import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-event-list',
	templateUrl: './event-list.component.html',
	styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
	experienceTiles: object[];

	constructor(private http: HttpClient) { }

	ngOnInit() {
		this.getPromoEvents();
	}

	getPromoEvents() {
		this.http.get<any>('/events/promo')
			.subscribe(response => {
				if (response.success) {
					this.experienceTiles = response.data.map(tile => {
						return { image: tile.photos[0].image, title: tile.title,
								description: tile.description, host: tile.chef.user.first_name,
								price: tile.price, id: tile.id };
					})
				}
			});
	}

}
