import { Injectable, Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'

import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

import { NgbDatepickerConfig, NgbCalendar, NgbDate,
		 NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter
	   } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalInjectable } from '../login-modal/login-modal.component'


@Component({
  selector: 'app-register-modal-content',
  template: `
	<div class="card card-signup">
		<div class="card-body">
			<h4 style="color:black;" class="card-title text-center">Regístrate</h4>
			<div class="social text-center">
				<button type="button" class="btn btn-icon btn-round btn-facebook btn-facebook-continue" (click)="authService.FacebookAuth()">
					<span>Continuar con Facebook</span>
					<i class="fa fa-facebook"> </i>
				</button>
				<h5 class="card-description"> o con tu correo</h5>
			</div>
			<form [formGroup]="registerForm" (ngSubmit)="onSubmit(registerForm)">
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus===true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons users_circle-08"></i>
						</span>
					</div>
					<input type="text" class="form-control" placeholder="Nombre y apellido"
															formControlName="first_name"
															[ngClass]="{ 'is-invalid': submitted && f.firstName.errors }">
					<div *ngIf="submitted && f.firstName.errors" class="invalid-feedback">
						<div *ngIf="f.firstName.errors.required">First Name is required</div>
					</div>
				</div>
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus1===true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons text_caps-small"></i>
						</span>
					</div>
					<input type="date" class="form-control datetimepicker" placeholder="06/07/2000"
																		   formControlName="date_birthday" name="dp" ngbDatepicker #d="ngbDatepicker" (click)="d.toggle()" data-color="white">

				</div>

				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus2===true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons ui-1_email-85"></i>
						</span>
					</div>
					<input type="text" class="form-control" placeholder="Correo" (focus)="focus2=true"
															formControlName="email" (blur)="focus2=false">
				</div>
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus1===true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons text_caps-small"></i>
						</span>
					</div>
					<input type="password" placeholder="Password" class="form-control" (focus)="focus1=true"
															  formControlName="password" (blur)="focus1=false">
				</div>
				<div class="form-check">
					<label class="form-check-label">
						<input class="form-check-input" type="checkbox">
						<span class="form-check-sign"></span>
						Acepto los <a href="#something">Terminos y Condiciones</a>.
					</label>
				</div>
				<div class="form-group card-footer text-center">
					<button [disabled]="loading" type="submit"
												 class="btn btn-primary btn-round btn-lg">Crear cuenta</button>
				</div>
			</form>
			<div style="display: flex; justify-content: center; align-items: center;">
				<span style="font-size: 14px; color: #000; padding-right: 15px;">¿Ya tienes una cuenta?</span>
				<button (click)="goToLoginModal()" class="btn btn-no-fill btn-round btn-sm">Iniciar Sesión</button>
			</div>
		</div>
	</div>
	`,
	styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalContentComponent implements OnInit {
	registerForm: FormGroup;
	closeResult: string;
	loading = false;
	submitted = false;

	constructor(
		public activeModal: NgbActiveModal,
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private alertService: AlertService,
		private modalService: NgbModal,
		private loginModal: LoginModalInjectable,
		config: NgbDatepickerConfig, calendar: NgbCalendar) {}

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
		const data = form.value

		data.date_birthday = Object.keys(data.date_birthday).map(e => data.date_birthday[e]).join('-')
		this.authService.register(data)
			.subscribe(response => {
				if (response.success) {
					this.modalService.dismissAll('Login Successful')
					this.authService.login(response.email, data.password)
				} else {
					console.log(response.message)
				}
			})
	}

	loginFacebook() {

	}

	public goToLoginModal() {
		this.modalService.dismissAll('GoToLoginModal');
		this.loginModal.open()
	}
}


@Component({
	selector: 'app-register-modal',
	templateUrl: './register-modal.component.html'
})

export class RegisterModalComponent {

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
		if (this.authService.getUserData) {
			this.router.navigate(['/']);
		}
	}

	open() {
		this.modalService.open(RegisterModalContentComponent, { size: 'lg', centered: true,  windowClass: 'modal-login modal-primary' })
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
}

@Injectable({ providedIn: 'root' })
export class RegisterModalInjectable {
	closeResult: string;
	registerForm: FormGroup;
	loading = false;
	submitted = false;

	constructor(private formBuilder: FormBuilder, private modalService: NgbModal) { }

	open() {
		this.modalService.open(RegisterModalContentComponent, { size: 'lg', centered: true,  windowClass: 'modal-login modal-primary' })
		.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
}

export class NgbdDatepickerAdapter {
	model1: Date;
	model2: Date;
}
