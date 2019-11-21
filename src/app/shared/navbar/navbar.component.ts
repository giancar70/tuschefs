import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { NgbdModalBasicComponent } from '../../modal/modal.component'

import { AuthService } from '../../services/auth.service'

import { LoginModalComponent } from '../../login-modal/login-modal.component'

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
	@ViewChild(LoginModalComponent, {static: false})
	public loginModal: LoginModalComponent;

	private toggleButton: any;
	private sidebarVisible: boolean;
	private modalOpen: boolean;
	public userData: any;

	constructor(public location: Location, private element: ElementRef, private authService: AuthService) {
		this.sidebarVisible = false;
		this.userData = this.authService.getUserData;
	}

	ngOnInit() {
		const navbar: HTMLElement = this.element.nativeElement;
		this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
	}

	sidebarOpen() {
		const toggleButton = this.toggleButton;
		const html = document.getElementsByTagName('html')[0];
		setTimeout(function() {
			toggleButton.classList.add('toggled');
		}, 500);
		html.classList.add('nav-open');
		this.sidebarVisible = true;
	}

	sidebarClose() {
		const html = document.getElementsByTagName('html')[0];
		this.toggleButton.classList.remove('toggled');
		this.sidebarVisible = false;
		html.classList.remove('nav-open');
	}

	sidebarToggle() {
		if (this.sidebarVisible === false) {
			this.sidebarOpen();
		} else {
			this.sidebarClose();
		}
	}

	isAuthenticated() {
		return this.authService.isUserAuthenticated;
	}

	isHome() {
		const titlee = this.location.prepareExternalUrl(this.location.path());
		if ( titlee === '/home' ) {
			return true;
		} else {
			return false;
		}
	}

	isDocumentation() {
		const titlee = this.location.prepareExternalUrl(this.location.path());
		if ( titlee === '/documentation' ) {
			return true;
		} else {
			return false;
		}
	}
}
