import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterModalComponent, RegisterModalContentComponent } from './register-modal.component';

@NgModule({
	imports: [
		BrowserModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [RegisterModalComponent, RegisterModalContentComponent],
	exports: [RegisterModalComponent],
	bootstrap: [RegisterModalComponent],
	entryComponents: [RegisterModalContentComponent]
})
export class RegisterModalComponentModule {}
