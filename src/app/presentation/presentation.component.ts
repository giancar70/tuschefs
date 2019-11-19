import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as Rellax from 'rellax';

@Component({
	selector: 'app-presentation',
	templateUrl: './presentation.component.html',
	styleUrls: ['./presentation.component.scss']
})

export class PresentationComponent implements OnInit, OnDestroy, AfterViewInit {
	model = {
		left: true,
		middle: false,
		right: false
	};
	date: Date = new Date();

		constructor() { }

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('presentation-page');
		const navbar = document.getElementsByTagName('nav')[0];
		navbar.classList.add('navbar-transparent');
	}
	ngAfterViewInit() {
		setTimeout(function() {
		if (window.innerWidth >= 991) {
			const rellax = new Rellax('.rellax', {
				center: true
			});
			const rellax1 = new Rellax('.rellax1', {
				center: true
			});
			const rellax5 = new Rellax('.rellax5', {
				center: true
			});
			const rellax6 = new Rellax('.rellax6', {
				center: true
			});
			const rellax7 = new Rellax('.rellax7', {
				center: true
			});
			const rellax8 = new Rellax('.rellax8', {
				center: true
			});
			const rellax9 = new Rellax('.rellax9', {
				center: true
			});
			const rellax10 = new Rellax('.rellax10', {
				center: true
			});
			const rellax11 = new Rellax('.rellax11', {
				center: true
			});
			const rellax12 = new Rellax('.rellax12', {
				center: true
			});
			const rellax13 = new Rellax('.rellax13', {
				center: true
			});
			const rellax14 = new Rellax('.rellax14', {
				center: true
			});

			const rellaxHeader = new Rellax('.rellax-header');
			const rellaxText = new Rellax('.rellax-text');
		}
		}, 200);

	}
	ngOnDestroy() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('presentation-page');
		const navbar = document.getElementsByTagName('nav')[0];
		navbar.classList.remove('navbar-transparent');
	}
}
