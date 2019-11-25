import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent } from './presentation/presentation.component';

import { ComponentsComponent } from './components/components.component';
import { SectionsComponent } from './sections/sections.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';

import { CreateEventComponent } from './create-event/create-event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDescriptionComponent } from './event-description/event-description.component'

import { AuthGuardService as AuthGuard } from './auth-guard/auth-guard.service'

const routes: Routes = [
	{ path: '', redirectTo: 'presentation', pathMatch: 'full' },
	{ path: 'presentation', component: PresentationComponent },
	/*
	{ path: 'components', component: ComponentsComponent },
	{ path: 'sections', component: SectionsComponent },
	{ path: 'nucleoicons', component: NucleoiconsComponent },
	*/
	{ path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard] },
	{ path: 'event/:id', component: EventDescriptionComponent },
	{ path: 'events', component: EventListComponent }
];

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		RouterModule.forRoot(routes, {
			useHash: true
		})
	],
	exports: [
	],
})
export class AppRoutingModule { }
