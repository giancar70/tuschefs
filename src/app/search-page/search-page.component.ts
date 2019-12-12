import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-search-page',
	templateUrl: './search-page.component.html',
	styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

	searchParams: any;
	searchResults: any;

	constructor(private route: ActivatedRoute, private http: HttpClient) { }

	ngOnInit() {
		this.route.queryParamMap.subscribe(params => {
			// Annoying linter error because ParamMap 'doesnt' have a params method,
			// so we can't do params.params to access the values. Hence, we split this in two lines.
			this.searchParams = { ...params };
			this.searchParams = this.searchParams.params;
			this.search();
		});
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
