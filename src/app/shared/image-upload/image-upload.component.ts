import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

	@Input() isRound = false;
	@Input() image: string;

	state: any = {}

	@ViewChild('input', {static: false})
	input: ElementRef;

	constructor(private http: HttpClient) {
		this.handleImageChange = this.handleImageChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	ngOnInit() {
		this.state = {
			file: null,
			imagePreviewUrl: this.image !== undefined ? this.image :
				(this.isRound ? 'assets/img/placeholder.jpg' : 'assets/img/image_placeholder.jpg')
		}
	}

	ngAfterViewInit() {
		this.input.nativeElement.children[2].onchange = this.handleImageChange; ;
	}

	handleImageChange(e) {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];
		reader.onloadend = () => {
			this.state.file = file;
			this.state.imagePreviewUrl = reader.result;
		}
		reader.readAsDataURL(file);
	}

	public handleSubmit() {
		const formData: FormData = new FormData();
		formData.append('img', this.state.file);
		return this.http.put('/user', formData)
			.subscribe(response => {
				console.log(response)
			})
	}

	handleClick() {
		this.input.nativeElement.children[2].click();
	}

	handleRemove() {
		this.state.file = null;
		this.state.imagePreviewUrl = this.image !== undefined ? this.image
			: (this.isRound ? 'assets/img/placeholder.jpg' : 'assets/img/image_placeholder.jpg');
	}
}
