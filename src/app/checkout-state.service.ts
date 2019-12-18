import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CheckoutStateService {

	numGuests: number;
	date: any;
	eventData: any;

	constructor() { }
}
