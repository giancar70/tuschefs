import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-presentation',
	templateUrl: './presentation.component.html',
	styleUrls: ['./presentation.component.scss']
})

export class PresentationComponent implements OnInit, OnDestroy, AfterViewInit {
	model = {
		left: true,
		middle: false,
		right: false
	};
	date: Date = new Date();
	experienceTiles: object[];

	constructor(private http: HttpClient) { }

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('presentation-page');
		const navbar = document.getElementsByTagName('nav')[0];
		navbar.classList.add('navbar-transparent');

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

	ngAfterViewInit() {

	}

	ngOnDestroy() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('presentation-page');
		const navbar = document.getElementsByTagName('nav')[0];
		navbar.classList.remove('navbar-transparent');
	}
}
