import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

import { AuthService } from '../services/auth.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

	private userData: any;
	private eventData: any;

	@ViewChild('modal-content', {static: false})
	public content;

	private reservationDate: any;
	private numGuests: number;
	private reservationTime: any;
	private successResponse = '';

	private httpClient: HttpClient;
	checkoutForm: FormGroup;

	constructor(private route: ActivatedRoute, private http: HttpClient,
				private router: Router, private formBuilder: FormBuilder,
				private authService: AuthService, private handler: HttpBackend, private modalService: NgbModal) {

		this.httpClient = new HttpClient(handler);
	}

	ngOnInit() {
		this.userData = this.authService.getUserData;

		const { numGuests, reservationDate, eventData } = JSON.parse(localStorage.getItem('tuschefs_cart'));

		this.numGuests = numGuests;
		this.reservationTime = eventData.time_start;
		this.reservationDate = `${reservationDate.day}-${reservationDate.month}-${reservationDate.year}`;

		this.eventData = { image: eventData.photos.length > 0 ? eventData.photos[0].image : 'https://via.placeholder.com/300x180',
					title: eventData.title, description: eventData.description, host: eventData.chef.user.first_name,
				host_picture: eventData.chef.user.photo, price: eventData.price, id: eventData.id, user_id: eventData.chef.user.id };

		this.checkoutForm = this.formBuilder.group({
			numGuests: [this.numGuests, Validators.required],
			phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
			cardNumber: ['', Validators.required],
			cardExpiration: ['', Validators.required],
			nameOnCard: ['', Validators.required],
			cvv: ['', Validators.required]
		});
	}

	onSubmit(form: NgForm) {
		const data = form.value;
		const tmp = data.cardExpiration.split('/')
		const expMonth = tmp[0];
		const expYear = tmp[1];
		const payload = { card_number: data.cardNumber, cvv: data.cvv,
						expiration_month: expMonth, expiration_year: expYear,
						email: this.userData.email };
		let culqiToken;

		const headers = new HttpHeaders();
		headers.append('Authorization', 'Bearer pk_test_i70HDc7Rx8H4cepE');

		this.httpClient.post<any>('https://api.culqi.com/v2/tokens', payload, { headers: headers })
			.subscribe(response => {
				culqiToken = response.id;
				console.log(response);

				const payload2 = { token: culqiToken, card_year: expYear, card_month: expMonth };
				this.http.post<any>('/card/', payload2)
					.subscribe(response2 => {
						console.log(response2);

						if (response2.success) {
							const culqiCardToken = response2.token;
							const payload3 = {
								event: this.eventData.id,
								people: this.numGuests,
								token: culqiCardToken,
								latitude: 0,
								longitude: 0,
								address: this.eventData.address,
								date_event: this.reservationDate
							};
							this.http.post<any>('/event/reservation/', payload3)
								.subscribe(response3 => {
									if (response3.success) {
										console.log(response3.data);
										this.successResponse = response3.data;
										showReservationSummary();
									}
								})
						}
					})
			})
	}

	showReservationSummary() {
		this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	closeModal() {
		this.modalService.dismissAll();
		this.router.navigate([''])
	}

}
