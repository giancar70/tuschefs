import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactFormComponent, ContactFormContentComponent } from './contact-form.component';

@NgModule({
	imports: [
		BrowserModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [ContactFormComponent, ContactFormContentComponent],
	exports: [ContactFormComponent],
	bootstrap: [ContactFormComponent],
	entryComponents: [ContactFormContentComponent]
})
export class ContactFormComponentModule {}
