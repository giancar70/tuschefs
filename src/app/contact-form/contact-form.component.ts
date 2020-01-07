import { Injectable, Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-form-content',
  template: `
	<div class="card card-login card-plain">
		<form class="form" (submit)="sendContact($event)">
			<div class="card-header text-center">
				<div class="logo-container">
					<img src="assets/img/logo-color.png" alt="tus chefs logo">
					<h3 style="margin: auto; padding-top: 10px; color: #000;">Contáctanos</h3>
				</div>
			</div>
			<div class="card-body">
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus === true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons users_circle-08"></i>
						</span>
					</div>
					<input type="text" id="email" class="form-control" placeholder="Correo"
																		  (focus)="focus=true" (blur)="focus=false">
				</div>
				<div class="input-group form-group-no-border input-lg" [ngClass]="{'input-group-focus':focus1 === true}">
					<div class="input-group-prepend">
						<span class="input-group-text">
							<i class="now-ui-icons text_caps-small"></i>
						</span>
					</div>
					<textarea id="message" placeholder="Mensaje" class="form-control" (focus)="focus1=true" (blur)="focus1=false"></textarea>
				</div>
			</div>
			<div class="card-footer text-center">
				<input type="submit" value="Enviar" class="btn btn-primary btn-round btn-lg btn-block">
			</div>
			<div class="errors-container" *ngIf="errors != null">
				<p>{{errors}}</p>
			</div>
		</form>
	</div>
  `,
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormContentComponent implements OnInit {
	errors: string;

	constructor(public activeModal: NgbActiveModal, private authService: AuthService,
				private router: Router, private modalService: NgbModal,
				private http: HttpClient) { }

	ngOnInit() {
		this.errors = null;
	}

	sendContact(event) {
		event.preventDefault();
		const target = event.target;
		const email = target.querySelector('#email').value;
		const message = target.querySelector('#message').value;

		this.http.post<any>('/user/request/info/', { email, message })
			.subscribe(response => {
				if (response.success) {
					this.modalService.dismissAll('Message successful');
				}
			})
	}
}

@Component({
	selector: 'app-contact-form',
	templateUrl: './contact-form.component.html',
})

export class ContactFormComponent {
	closeResult: string;

	constructor(private authService: AuthService, private router: Router,
				private modalService: NgbModal) { }

	public open() {
		this.modalService.open(ContactFormContentComponent,
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
export class ContactFormInjectable {
	closeResult: string;

	constructor(private authService: AuthService, private router: Router,
				private modalService: NgbModal) { }

	public open() {
		this.modalService.open(ContactFormContentComponent,
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
