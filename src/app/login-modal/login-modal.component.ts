import { Injectable, Component, OnInit, Input } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { RegisterModalInjectable } from '../register-modal/register-modal.component'

@Component({
  selector: 'app-login-modal-content',
  template: `
	<div class="card card-login card-plain">
		<form class="form" (submit)="loginUser($event)">
			<div class="card-header text-center">
				<div class="logo-container">
					<img src="assets/img/logo-color.png" alt="tus chefs logo">
				</div>
			</div>
			<div class="social text-center">
				<button type="button" class="btn btn-icon btn-round btn-facebook btn-facebook-continue" (click)="loginFacebook($event)">
					<span>Continuar con Facebook</span>
					<i class="fa fa-facebook"> </i>
				</button>
			</div>
			<div class="card-body">
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus === true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons users_circle-08"></i>
						</span>
					</div>
					<input type="text" id="username" class="form-control" placeholder="Correo"
																		  (focus)="focus=true" (blur)="focus=false">
				</div>
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus1 === true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons text_caps-small"></i>
						</span>
					</div>
					<input type="password" id="password" placeholder="Contraseña" class="form-control"
																				  (focus)="focus1=true" (blur)="focus1=false" />
				</div>
			</div>
			<div class="card-footer text-center">
				<input type="submit" value="Login" class="btn btn-primary btn-round btn-lg btn-block">
			</div>
			<div class="errors-container" *ngIf="errors != null">
				<p>{{errors}}</p>
			</div>
			<div style="display: flex; justify-content: center; align-items: center;">
				<span style="font-size: 14px; color: #000; padding-right: 15px;">¿Todavía no tienes una cuenta?</span>
				<button (click)="goToRegisterModal()" class="btn btn-no-fill btn-round btn-sm">Regístrate ahora</button>
			</div>
		</form>
	</div>
	`,
	styleUrls: ['./login-modal.component.scss']
})
export class LoginModalContentComponent implements OnInit {
	errors: string;

	constructor(public activeModal: NgbActiveModal, private authService: AuthService,
				private router: Router, private modalService: NgbModal,
				private registerModal: RegisterModalInjectable) { }

	ngOnInit() {
		this.errors = null;
	}

	loginUser(event) {
		event.preventDefault()
		const target = event.target;
		const email = target.querySelector('#username').value;
		const password = target.querySelector('#password').value;

		this.authService.login(email, password)
			.subscribe(response => {
				if (response.success) {
					this.modalService.dismissAll('Login Successful')
					this.router.navigate([''])
				} else {
					this.errors = response.message
				}
			})
	}

	loginFacebook(event) {
		event.preventDefault()
		const data = {};
		this.authService.loginFacebook(data)
			.subscribe(response => {
				if (response.success) {
					this.modalService.dismissAll('Login Successful')
					this.router.navigate([''])
				} else {
					this.errors = response.message
				}
			})
	}

	private goToRegisterModal() {
		this.modalService.dismissAll('GoToRegisterModal')
		this.registerModal.open()
	}

}

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
})

export class LoginModalComponent {
	closeResult: string;

	constructor(private authService: AuthService, private router: Router,
				private modalService: NgbModal) { }

	public open() {
		this.modalService.open(LoginModalContentComponent,
							   { size: 'lg', centered: true, windowClass: 'modal-login modal-primary' })
			.result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				if (reason === 'GoToRegisterModal') {

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
export class LoginModalInjectable {
	closeResult: string;

	constructor(private authService: AuthService, private router: Router,
				private modalService: NgbModal) { }

	public open() {
		this.modalService.open(LoginModalContentComponent,
							   { size: 'lg', centered: true, windowClass: 'modal-login modal-primary' })
			.result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				if (reason === 'GoToRegisterModal') {

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
