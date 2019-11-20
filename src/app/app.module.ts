import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { SectionsModule } from './sections/sections.module';
import { ComponentsModule } from './components/components.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { PresentationComponent } from './presentation/presentation.component';
import { NavbarComponent } from './shared/navbar/navbar.component';


import { environment } from '../environments/environment';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventDescriptionComponent } from './event-description/event-description.component';
import { NgbdModalBasicComponent } from './modal/modal.component';
import { ImageUploadModule } from './shared/image-upload/image-upload.module';

import { AgmCoreModule } from '@agm/core';
import { LoginModalComponentModule } from './login-modal/login-modal.module';
import { RegisterModalComponentModule } from './register-modal/register-modal.module';
import { LoginModalComponent } from './login-modal/login-modal.component'
import { RegisterModalComponent } from './register-modal/register-modal.component'

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { ExperienceTileComponent } from './experience-tile/experience-tile.component';

const config = new AuthServiceConfig([
  {
	id: GoogleLoginProvider.PROVIDER_ID,
	provider: new GoogleLoginProvider('Google-OAuth-Client-Id')
  },
  {
	id: FacebookLoginProvider.PROVIDER_ID,
	provider: new FacebookLoginProvider('Facebook-App-Id')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		CreateEventComponent,
		EventDescriptionComponent,
		NgbdModalBasicComponent,
		PresentationComponent,
		ExperienceTileComponent,
	],
	imports: [
		BrowserAnimationsModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule,
		AngularFireAuthModule,
		NgbModule.forRoot(),
		FormsModule,
		RouterModule,
		AppRoutingModule,
		SectionsModule,
		ComponentsModule,
		ReactiveFormsModule,
		HttpClientModule,
		ImageUploadModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyAD_TNm6k3RQOkPz7_XbJci8PFNnqmV6Mg',
			libraries: ['places']
			}),
		SocialLoginModule,
		LoginModalComponentModule,
		RegisterModalComponentModule,
	],
	providers: [
		{
			provide: AuthServiceConfig,
			useFactory: provideConfig
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
