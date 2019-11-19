import { Component, OnInit } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit {
	closeResult: string;
	currentModal: any;

	constructor(private authService: AuthService, private router: Router,
				private modalService: NgbModal) {

	}

	ngOnInit() {

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
					window.alert(response.message)
				}
			})

		console.log(email, password)
	}

	loginFacebook(event) {
		event.preventDefault()
		const data = {};
		this.authService.loginFacebook(data)
			.subscribe(response => {
				if (response.success) {
					console.log(response)
					this.modalService.dismissAll('Login Successful')
					this.router.navigate([''])
				} else {
					window.alert(response.message)
				}
			})
	}

	loginGoogle(event) {
		event.preventDefault()
		const data = {};
		this.authService.loginGoogle(data)
			.subscribe(response => {
				if (response.success) {
					console.log(response)
					this.modalService.dismissAll('Login Successful')
					this.router.navigate([''])
				} else {
					window.alert(response.message)
				}
			})
	}

	open(content) {
		this.currentModal = this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'modal-login modal-primary' })
			.result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				if (reason === 'GoToRegisterModal') {
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

	private goToRegisterModal() {
		this.modalService.dismissAll('GoToRegisterModal')
	}

}
