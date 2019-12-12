import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent } from './presentation/presentation.component';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component'

import { ComponentsComponent } from './components/components.component';
import { SectionsComponent } from './sections/sections.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';

import { CreateEventComponent } from './create-event/create-event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDescriptionComponent } from './event-description/event-description.component'
import { UserProfileComponent } from './user-profile/user-profile.component'
import { HostProfileComponent } from './host-profile/host-profile.component'

import { SearchPageComponent } from './search-page/search-page.component'

import { AuthGuardService as AuthGuard } from './auth-guard/auth-guard.service'

const routes: Routes = [
	{ path: '', redirectTo: 'presentation', pathMatch: 'full' },
	{ path: 'presentation', component: PresentationComponent },
	{ path: 'terms-and-conditions', component: TermsconditionsComponent },

	{ path: 'event/:id', component: EventDescriptionComponent },
	{ path: 'events', component: EventListComponent },
	{ path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard] },

	{ path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
	{ path: 'profile/:id', component: HostProfileComponent },

	{ path: 'search', component: SearchPageComponent }
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
