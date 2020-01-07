import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
	selector: 'app-event-list',
	templateUrl: './event-list.component.html',
	styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
	experienceTiles: object[];
	searchForm: FormGroup;

	constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.getPromoEvents();
		this.searchForm = this.formBuilder.group({
			isHostHome: [0, Validators.required],
			numGuests: [1, Validators.required],
			dateInit: ['2019-12-12', Validators.required]
		});
	}

	onSubmitSearch(form: NgForm) {
		const data = form.value;

		// const location = data.location;
		data.dateInit = Object.keys(data.dateInit).map(e => data.dateInit[e]).join('-')
		const numGuests = data.numGuests;
		const dateInit = data.dateInit;
		const isHome = data.isHostHome;

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

}
