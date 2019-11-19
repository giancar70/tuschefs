import {Component, Input} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngbd-modal-component',
  templateUrl: './modal.component.html'
})

export class NgbdModalBasicComponent {
	@Input() type: string;
	closeResult: string;

	constructor(private modalService: NgbModal) {}

	open(content) {
		this.modalService.open(content, { windowClass: 'modal-login modal-primary' })
			.result.then((result) => {
				this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
