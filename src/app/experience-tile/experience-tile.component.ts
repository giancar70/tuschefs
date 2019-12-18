import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-experience-tile',
	templateUrl: './experience-tile.component.html',
	styleUrls: ['./experience-tile.component.scss']
})
export class ExperienceTileComponent implements OnInit {

	@Input()
	data: Object;

	@Input()
	hostedBy = true;

	@Input()
	smallPicture = false;

	constructor() { }

	ngOnInit() {

	}

}
