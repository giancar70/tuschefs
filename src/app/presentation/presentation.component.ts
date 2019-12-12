import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbDatepickerConfig, NgbCalendar, NgbDate,
		 NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter
	   } from '@ng-bootstrap/ng-bootstrap';

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
	searchForm: FormGroup;


	constructor(private http: HttpClient, private formBuilder: FormBuilder,
				private router: Router, config: NgbDatepickerConfig,
				calendar: NgbCalendar) {

		config.minDate = { year: 1900, month: 1, day: 1 };
		config.maxDate = { year: 3000, month: 12, day: 31 };
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('presentation-page');
		const navbar = document.getElementsByTagName('nav')[0];
		navbar.classList.add('navbar-transparent');

		this.searchForm = this.formBuilder.group({
			numGuests: [1, Validators.required],
			dateInit: ['2019-12-12', Validators.required]
		});

		this.getPromoEvents();
	}

	onSubmitSearch(form: NgForm) {
		const data = form.value;

		// const location = data.location;
		data.dateInit = Object.keys(data.dateInit).map(e => data.dateInit[e]).join('-')
		const numGuests = data.numGuests;
		const dateInit = data.dateInit;
		const isHome = 0;

		this.router.navigate(['/search'], { queryParams: { guests: numGuests, date_init: dateInit, is_home: isHome } });
	}

	getPromoEvents() {
		this.http.get<any>('/events/promo')
			.subscribe(response => {
				if (response.success) {
					this.experienceTiles = response.data.map(tile => {
						return { image: tile.photos.length > 0 ? tile.photos[0].image : 'https://via.placeholder.com/300x180',
								title: tile.title, description: tile.description, host: tile.chef.user.first_name, host_picture: tile.chef.user.photo,
								price: tile.price, id: tile.id, user_id: tile.chef.user.id };
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
