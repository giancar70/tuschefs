import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, AfterViewInit {

	@Input() isRound = false;
	@Input() image: string;
	@Input() text = 'Selecciona una imagen de perfil';
	@Input() bg = true;
	@Input() selfSave = false;

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
		this.input.nativeElement.children[2].onchange = this.handleImageChange;
	}

	handleImageChange(e) {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];
		reader.readAsDataURL(file);
		reader.onload = () => {
			this.state.file = file;
			this.state.imagePreviewUrl = reader.result;
		}
	}

	public handleSubmit(uploadUrl: string) {
		const formData: FormData = new FormData();
		formData.append('img', this.state.file);

		const headers = new HttpHeaders();
		headers.append('Content-Type', 'multipart/form-data')

		return this.http.post<any>(uploadUrl, formData, { headers: headers })
			.subscribe(response => {
				console.log(response)
			})
	}

	handleClick() {
		this.input.nativeElement.children[2].click();
	}

	saveUserProfilePicture() {
		this.state.file = null;
		this.handleSubmit('/user');
	}

	handleRemove() {
		this.state.file = null;
		this.state.imagePreviewUrl = this.image !== undefined ? this.image
			: (this.isRound ? 'assets/img/placeholder.jpg' : 'assets/img/image_placeholder.jpg');
	}
}
