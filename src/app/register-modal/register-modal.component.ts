import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

import { NgbDatepickerConfig, NgbCalendar, NgbDate,
		 NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter
	   } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-register-modal',
	templateUrl: './register-modal.component.html',
	styleUrls: ['./register-modal.component.scss']
})

export class RegisterModalComponent implements OnInit {

	closeResult: string;
	registerForm: FormGroup;
	loading = false;
	submitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private alertService: AlertService,
		private modalService: NgbModal,
		config: NgbDatepickerConfig, calendar: NgbCalendar
	) {

		config.minDate = { year: 1900, month: 1, day: 1 };
		config.maxDate = calendar.getToday();

		// redirect if already logged in
		if (this.authService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.registerForm = this.formBuilder.group({
			first_name: ['', Validators.required],
			date_birthday: ['', Validators.required],
			email: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	// convenience getter for easy access to form fields
	get f() { return this.registerForm.controls; }

	onSubmit(form: NgForm) {
		this.authService.register(form.value)
			.subscribe((data: any) => {
				if (data.success === true) {
					this.modalService.dismissAll('Login Successful')
					this.router.navigate([''])
					this.authService.setLoggedIn(true)
				} else {
					console.log(data.message)
				}
			})
	}

	loginFacebook() {

	}

	loginGoogle() {

	}

	open(content) {
		this.modalService.open(content, { size: 'lg', centered: true,  windowClass: 'modal-login modal-primary' })
			.result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				if (reason === 'GoToLoginModal') {
					// TODO: open modal
				}
			});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return  `with: ${reason}`;
		}
	}

	public goToLoginModal() {
		this.modalService.dismissAll('GoToLoginModal');
	}
}

export class NgbdDatepickerAdapter {
	model1: Date;
	model2: Date;
}
