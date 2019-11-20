import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginModalComponent, LoginModalContentComponent } from './login-modal.component';

@NgModule({
	imports: [
		BrowserModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [LoginModalComponent, LoginModalContentComponent],
	exports: [LoginModalComponent],
	bootstrap: [LoginModalComponent],
	entryComponents: [LoginModalContentComponent]
})
export class LoginModalComponentModule {}
