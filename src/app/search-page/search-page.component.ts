import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbDatepickerConfig, NgbCalendar, NgbDate,
		 NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter
	   } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-search-page',
	templateUrl: './search-page.component.html',
	styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

	searchParams: any;
	searchResults: any;
	searchForm: FormGroup;

	constructor(private http: HttpClient, private formBuilder: FormBuilder,
				private router: Router, config: NgbDatepickerConfig,
				calendar: NgbCalendar, private route: ActivatedRoute) {

		config.minDate = { year: 1900, month: 1, day: 1 };
		config.maxDate = { year: 3000, month: 12, day: 31 };
	}


	ngOnInit() {
		this.route.queryParamMap.subscribe(params => {
			// Annoying linter error because ParamMap 'doesnt' have a params method,
			// so we can't do params.params to access the values. Hence, we split this in two lines.
			this.searchParams = { ...params };
			this.searchParams = this.searchParams.params;
			this.search();
		});

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

		this.router.navigate([], { relativeTo: this.route, queryParams: { guests: numGuests, date_init: dateInit, is_home: isHome } });
	}

	search() {
		const isHome = this.searchParams.is_home;
		const numGuests = this.searchParams.guests;
		const dateInit = this.searchParams.date_init;

		this.http.get<any>(`/event?guest=${numGuests}&date_init=${dateInit}&is_home=${isHome}`)
			.subscribe(response => {
				if (response.success) {
					this.searchResults = response.data.map(tile => {
						return { image: tile.photos.length > 0 ? tile.photos[0].image : 'https://via.placeholder.com/300x180',
								title: tile.title, description: tile.description, host: tile.chef.user.first_name, host_picture: tile.chef.user.photo,
								price: tile.price, id: tile.id, user_id: tile.chef.user.id };
					})
				}
			})
	}

}
